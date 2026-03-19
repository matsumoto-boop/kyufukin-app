export interface Municipality {
  code: string;
  name: string;
  prefecture: string;
}

// 郵便番号の先頭3桁から自治体を判定する対応表
const POSTAL_PREFIX_MAP: Record<string, Municipality> = {
  "154": { code: "setagaya", name: "世田谷区", prefecture: "東京都" },
  "155": { code: "setagaya", name: "世田谷区", prefecture: "東京都" },
  "156": { code: "setagaya", name: "世田谷区", prefecture: "東京都" },
  "157": { code: "setagaya", name: "世田谷区", prefecture: "東京都" },
  "158": { code: "setagaya", name: "世田谷区", prefecture: "東京都" },
};

/** 郵便番号（ハイフンあり・なし両対応）から自治体情報を返す。未対応の場合は null */
export function detectMunicipality(postalCode: string): Municipality | null {
  const digits = postalCode.replace(/[^0-9]/g, "");
  if (digits.length < 3) return null;
  return POSTAL_PREFIX_MAP[digits.slice(0, 3)] ?? null;
}

/** 郵便番号が有効な形式かどうかを返す */
export function isValidPostalCode(postalCode: string): boolean {
  return /^\d{3}-?\d{4}$/.test(postalCode.trim());
}
