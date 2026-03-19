export type FamilyType    = "single" | "couple" | "with_children";
export type IncomeRange   = "under300" | "under600" | "under800" | "over800";
export type HousingType   = "rent" | "own";
export type AgeRange      = "under20" | "20to64" | "over65";
export type TaxStatus     = "taxed" | "equalOnly" | "exempt";
export type IncomeChange  = "stable" | "reduced" | "quit";
export type DisabilityType =
  | "none"
  | "body12"          // 身体障害手帳 1〜2 級
  | "body3"           // 身体障害手帳 3 級
  | "intellectual13"  // 愛の手帳 1〜3 度
  | "intellectual4"   // 愛の手帳 4 度
  | "mental1"         // 精神障害者保健福祉手帳 1 級
  | "nanbyo"          // 指定難病・医療券所持
  | "severe_complex"; // 重度心身障害（重心手当対象レベル）
export type ChildSchool = "na" | "ninkatsu" | "private_yochien" | "other";

export interface ApplicantInfo {
  nameKanji: string;
  nameKana:  string;
  postalCode: string;
  address:   string;
  phone:     string;
  bankName:  string;
  bankBranch: string;
  bankType:  "futsuu" | "toza";
  bankNumber: string;
}

export interface DiagnosisForm extends ApplicantInfo {
  ageRange:     AgeRange;
  familyType:   FamilyType;
  incomeRange:  IncomeRange;
  taxStatus:    TaxStatus;
  incomeChange: IncomeChange;
  housingType:  HousingType;
  disability:   DisabilityType;
  childSchool:  ChildSchool;
}

export interface Benefit {
  id:          string;
  name:        string;
  description: string;
  amount:      number;
  amountNote?: string;
  source?:     string;
  sourceUrl?:  string;
  onlineFormUrl?: string;
  applicationMethod?: string;
  requiredDocs?: string[];
  fieldGuide?: { label: string; value: string }[];
  updatedAt?:  string;
}
