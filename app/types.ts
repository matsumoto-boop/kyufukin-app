export type FamilyType = "single" | "couple" | "with_children";
export type IncomeRange = "under300" | "under600" | "under800" | "over800";
export type HousingType = "rent" | "own";

export interface DiagnosisForm {
  postalCode: string;
  familyType: FamilyType;
  incomeRange: IncomeRange;
  housingType: HousingType;
}

export interface Benefit {
  id: string;
  name: string;
  description: string;
  amount: number;
}
