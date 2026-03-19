import { DiagnosisForm, Benefit } from "../types";

export function calculateBenefits(form: DiagnosisForm): Benefit[] {
  const results: Benefit[] = [];

  // 子供あり × 年収800万以下 → 児童手当
  if (
    form.familyType === "with_children" &&
    (form.incomeRange === "under300" ||
      form.incomeRange === "under600" ||
      form.incomeRange === "under800")
  ) {
    results.push({
      id: "child_allowance",
      name: "児童手当",
      description: "18歳未満の子を持つ世帯への給付金（年収800万円以下）",
      amount: 50000,
    });
  }

  // 賃貸 → 住居確保給付金
  if (form.housingType === "rent") {
    results.push({
      id: "housing_support",
      name: "住居確保給付金",
      description: "賃貸住宅に居住する世帯向けの家賃補助",
      amount: 30000,
    });
  }

  // 単身 × 年収300万以下 → 生活困窮者自立支援給付
  if (form.familyType === "single" && form.incomeRange === "under300") {
    results.push({
      id: "livelihood_support",
      name: "生活困窮者自立支援給付",
      description: "低所得の単身世帯向けの生活支援給付",
      amount: 20000,
    });
  }

  // 夫婦 × 年収600万以下 → 夫婦世帯支援給付
  if (
    form.familyType === "couple" &&
    (form.incomeRange === "under300" || form.incomeRange === "under600")
  ) {
    results.push({
      id: "couple_support",
      name: "夫婦世帯支援給付",
      description: "年収600万円以下の夫婦世帯を対象とした給付",
      amount: 25000,
    });
  }

  // 子供あり × 賃貸 → 子育て世帯家賃支援
  if (form.familyType === "with_children" && form.housingType === "rent") {
    results.push({
      id: "child_rent_support",
      name: "子育て世帯家賃支援",
      description: "子を持つ賃貸世帯に対する追加の家賃補助",
      amount: 15000,
    });
  }

  // 持ち家 × 子供あり → 住宅リフォーム補助
  if (form.familyType === "with_children" && form.housingType === "own") {
    results.push({
      id: "home_renovation",
      name: "子育て対応住宅リフォーム補助",
      description: "子育て環境整備のための住宅改修を支援",
      amount: 100000,
    });
  }

  // 年収300万以下 全員 → 低所得世帯給付金
  if (form.incomeRange === "under300") {
    results.push({
      id: "low_income",
      name: "低所得世帯給付金",
      description: "年収300万円以下の全世帯を対象とした給付金",
      amount: 40000,
    });
  }

  return results;
}

// ---- 新インターフェース ----

export interface User {
  family: string;   // "with_children" | "couple" | "single" など
  income: number;   // 年収（円）
  housing: string;  // "rent" | "own"
}

export interface BenefitResult {
  name: string;
  amount: number;
}

export interface MatchResult {
  benefits: BenefitResult[];
  total: number;
}

export function matchBenefits(user: User): MatchResult {
  const benefits: BenefitResult[] = [];

  // 子供あり && 年収800万以下 → 子育て給付金
  if (user.family === "with_children" && user.income <= 8_000_000) {
    benefits.push({ name: "子育て給付金", amount: 50_000 });
  }

  // 賃貸 → 家賃補助
  if (user.housing === "rent") {
    benefits.push({ name: "家賃補助", amount: 30_000 });
  }

  // 年収300万以下 → 低所得者支援
  if (user.income <= 3_000_000) {
    benefits.push({ name: "低所得者支援", amount: 40_000 });
  }

  const total = benefits.reduce((sum, b) => sum + b.amount, 0);

  return { benefits, total };
}
