import { ApplicantInfo } from "../types";

const KEY = "kyufukin_mypage";

export const EMPTY_APPLICANT: ApplicantInfo = {
  nameKanji: "", nameKana: "", postalCode: "", address: "", phone: "",
  bankName: "", bankBranch: "", bankType: "futsuu", bankNumber: "",
};

export function loadMypage(): ApplicantInfo {
  if (typeof window === "undefined") return EMPTY_APPLICANT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY_APPLICANT;
    return { ...EMPTY_APPLICANT, ...JSON.parse(raw) };
  } catch {
    return EMPTY_APPLICANT;
  }
}

export function saveMypage(info: ApplicantInfo): void {
  localStorage.setItem(KEY, JSON.stringify(info));
}

export function mypageIsEmpty(info: ApplicantInfo): boolean {
  return !info.nameKanji && !info.nameKana;
}
