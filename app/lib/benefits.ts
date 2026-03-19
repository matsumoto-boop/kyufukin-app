import {
  DiagnosisForm, Benefit,
  FamilyType, IncomeRange, HousingType,
  AgeRange, TaxStatus, IncomeChange, DisabilityType, ChildSchool,
} from "../types";
import rawData from "../data/setagaya-benefits.json";

interface BenefitRecord {
  id: string;
  municipalityCode: string;
  name: string;
  description: string;
  amount: number;
  amountNote: string;
  source: string;
  sourceUrl: string;
  onlineFormUrl: string | null;
  applicationMethod: string;
  requiredDocs: string[];
  updatedAt: string;
  conditions: {
    ageRanges:     string[];
    familyTypes:   string[];
    incomeRanges:  string[];
    taxStatuses:   string[];
    incomeChanges: string[];
    housingTypes:  string[];
    disabilities:  string[];
    childSchools:  string[];
  };
}

export function calculateBenefits(form: DiagnosisForm, municipalityCode?: string): Benefit[] {
  return (rawData as BenefitRecord[])
    .filter((r) => {
      // 自治体コードが指定されている場合は一致するものだけ
      if (municipalityCode && r.municipalityCode !== municipalityCode) return false;
      const c = r.conditions;
      return (
        c.ageRanges.includes(form.ageRange) &&
        c.familyTypes.includes(form.familyType) &&
        c.incomeRanges.includes(form.incomeRange) &&
        c.taxStatuses.includes(form.taxStatus) &&
        c.incomeChanges.includes(form.incomeChange) &&
        c.housingTypes.includes(form.housingType) &&
        c.disabilities.includes(form.disability) &&
        c.childSchools.includes(form.childSchool)
      );
    })
    .map((r) => {
      // 申請ガイド用フィールドを動的生成
      const fieldGuide = buildFieldGuide(r, form);
      return {
        id:                r.id,
        name:              r.name,
        description:       r.description,
        amount:            r.amount,
        amountNote:        r.amountNote,
        source:            r.source,
        sourceUrl:         r.sourceUrl,
        onlineFormUrl:     r.onlineFormUrl ?? undefined,
        applicationMethod: r.applicationMethod,
        requiredDocs:      r.requiredDocs,
        fieldGuide,
        updatedAt:         r.updatedAt,
      };
    });
}

/** 申請フォームに入力すべき値の一覧を生成 */
function buildFieldGuide(
  record: BenefitRecord,
  form: DiagnosisForm,
): { label: string; value: string }[] {
  const base = [
    { label: "氏名（漢字）",     value: form.nameKanji   || "（未入力）" },
    { label: "氏名（カナ）",     value: form.nameKana    || "（未入力）" },
    { label: "郵便番号",         value: form.postalCode  || "（未入力）" },
    { label: "住所",             value: form.address     || "（未入力）" },
    { label: "電話番号",         value: form.phone       || "（未入力）" },
    { label: "金融機関名",       value: form.bankName    || "（未入力）" },
    { label: "支店名",           value: form.bankBranch  || "（未入力）" },
    { label: "口座種別",         value: form.bankType === "futsuu" ? "普通" : form.bankType === "toza" ? "当座" : "（未入力）" },
    { label: "口座番号",         value: form.bankNumber  || "（未入力）" },
  ];

  // 給付金ごとの追加フィールド
  const extra: { label: string; value: string }[] = [];

  if (record.id === "setagaya_noncourse_2025") {
    extra.push({ label: "課税状況", value: taxStatusLabel(form.taxStatus) });
    extra.push({ label: "申請理由", value: "物価高騰により生活が圧迫されている" });
  }

  if (record.id === "setagaya_housing_support") {
    extra.push({ label: "離職・廃業・収入減の種別", value: incomeChangeLabel(form.incomeChange) });
    extra.push({ label: "現在の住居形態", value: "賃貸" });
    extra.push({ label: "世帯人員数", value: familyLabel(form.familyType) });
  }

  if (["setagaya_disability_welfare", "setagaya_special_disability",
       "setagaya_disability_child", "setagaya_severe_disability_tokyo"].includes(record.id)) {
    extra.push({ label: "障害・手帳の種別", value: disabilityLabel(form.disability) });
    extra.push({ label: "年齢区分", value: ageRangeLabel(form.ageRange) });
  }

  if (record.id === "setagaya_private_kindergarten") {
    extra.push({ label: "子の通園施設種別", value: "私立幼稚園（新制度未移行）" });
  }

  if (record.id === "setagaya_nursery_free") {
    extra.push({ label: "利用施設種別", value: "認可保育施設" });
  }

  return [...base, ...extra];
}

// ---- ラベル変換ヘルパー ----

function taxStatusLabel(v: TaxStatus) {
  return { taxed: "課税", equalOnly: "均等割のみ課税", exempt: "非課税" }[v] ?? v;
}
function incomeChangeLabel(v: IncomeChange) {
  return { stable: "変化なし", reduced: "最近収入が減少した", quit: "離職・廃業した" }[v] ?? v;
}
function familyLabel(v: FamilyType) {
  return { single: "1人（単身）", couple: "2人（夫婦）", with_children: "子供あり世帯" }[v] ?? v;
}
function disabilityLabel(v: DisabilityType) {
  const map: Record<DisabilityType, string> = {
    none:             "なし",
    body12:           "身体障害者手帳1〜2級",
    body3:            "身体障害者手帳3級",
    intellectual13:   "愛の手帳1〜3度",
    intellectual4:    "愛の手帳4度",
    mental1:          "精神障害者保健福祉手帳1級",
    nanbyo:           "指定難病・医療券所持",
    severe_complex:   "重度心身障害（重複障害）",
  };
  return map[v] ?? v;
}
function ageRangeLabel(v: AgeRange) {
  return { under20: "20歳未満", "20to64": "20〜64歳", over65: "65歳以上" }[v] ?? v;
}

// ---- matchBenefits（数値年収インターフェース） ----

export interface User {
  family: string;
  income: number;
  housing: string;
}
export interface BenefitResult { name: string; amount: number; }
export interface MatchResult { benefits: BenefitResult[]; total: number; }

export function matchBenefits(user: User): MatchResult {
  const incomeRange: IncomeRange =
    user.income <= 3_000_000 ? "under300" :
    user.income <= 6_000_000 ? "under600" :
    user.income <= 8_000_000 ? "under800" : "over800";

  const form: DiagnosisForm = {
    nameKanji: "", nameKana: "", postalCode: "000-0000",
    address: "", phone: "", bankName: "", bankBranch: "",
    bankType: "futsuu", bankNumber: "",
    ageRange: "20to64",
    familyType:   user.family  as FamilyType,
    incomeRange,
    taxStatus:    "taxed",
    incomeChange: "stable",
    housingType:  user.housing as HousingType,
    disability:   "none",
    childSchool:  user.family === "with_children" ? "ninkatsu" : "na",
  };
  const benefits = calculateBenefits(form);
  return {
    benefits: benefits.map((b) => ({ name: b.name, amount: b.amount })),
    total:    benefits.reduce((s, b) => s + b.amount, 0),
  };
}
