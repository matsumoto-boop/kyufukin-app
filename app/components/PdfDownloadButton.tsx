"use client";

import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { Benefit, DiagnosisForm } from "../types";

interface Props {
  benefits: Benefit[];
  total: number;
  form: DiagnosisForm;
}

async function generatePdf(benefits: Benefit[], total: number, form: DiagnosisForm): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const fontRes = await fetch("/fonts/NotoSansJP-Regular.otf");
  const jpFont  = await pdfDoc.embedFont(await fontRes.arrayBuffer());
  const hel     = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const indigo    = rgb(0.29, 0.37, 0.93);
  const darkGray  = rgb(0.15, 0.15, 0.15);
  const midGray   = rgb(0.45, 0.45, 0.45);
  const lightGray = rgb(0.94, 0.94, 0.97);
  const white     = rgb(1, 1, 1);

  const W = 595, H = 842, M = 48;

  // ============================================================
  // ページ1: 申請書サマリー
  // ============================================================
  const p1 = pdfDoc.addPage([W, H]);

  // ヘッダー帯
  p1.drawRectangle({ x: 0, y: H - 80, width: W, height: 80, color: indigo });
  p1.drawText("給付金申請書", { x: M, y: H - 48, size: 22, font: jpFont, color: white });
  const today = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  p1.drawText(`発行日: ${today}`, { x: W - M - 110, y: H - 48, size: 9, font: jpFont, color: rgb(0.8, 0.85, 1) });
  p1.drawText("世田谷区 給付金診断アプリ", { x: M, y: H - 66, size: 9, font: jpFont, color: rgb(0.7, 0.75, 1) });

  let y = H - 100;

  // ─── 申請者情報 ───
  const drawSection = (page: typeof p1, label: string, yPos: number) => {
    page.drawText(label, { x: M, y: yPos, size: 11, font: jpFont, color: indigo });
    page.drawLine({ start: { x: M, y: yPos - 8 }, end: { x: W - M, y: yPos - 8 }, thickness: 0.8, color: indigo, opacity: 0.3 });
    return yPos - 22;
  };

  const drawRow = (page: typeof p1, label: string, value: string, yPos: number) => {
    page.drawRectangle({ x: M, y: yPos - 3, width: 108, height: 18, color: lightGray });
    page.drawText(label, { x: M + 6, y: yPos, size: 9, font: jpFont, color: midGray });
    page.drawText(value || "（未記入）", { x: M + 118, y: yPos, size: 10, font: jpFont, color: value ? darkGray : midGray });
    return yPos - 24;
  };

  y = drawSection(p1, "■ 申請者情報", y);
  y = drawRow(p1, "氏名（漢字）", form.nameKanji, y);
  y = drawRow(p1, "氏名（カナ）", form.nameKana, y);
  y = drawRow(p1, "郵便番号", form.postalCode ? `〒 ${form.postalCode}` : "", y);
  y = drawRow(p1, "住所", form.address, y);
  y = drawRow(p1, "電話番号", form.phone, y);
  y -= 8;
  y = drawRow(p1, "金融機関名", form.bankName, y);
  y = drawRow(p1, "支店名", form.bankBranch, y);
  y = drawRow(p1, "口座種別", form.bankType === "futsuu" ? "普通預金" : form.bankType === "toza" ? "当座預金" : "", y);
  y = drawRow(p1, "口座番号", form.bankNumber, y);

  y -= 14;
  y = drawSection(p1, "■ 対象給付金一覧", y);

  if (benefits.length === 0) {
    p1.drawText("現在の条件では対象となる給付金はありません。", { x: M, y, size: 10, font: jpFont, color: midGray });
    y -= 24;
  } else {
    // テーブルヘッダー
    p1.drawRectangle({ x: M, y: y - 3, width: W - M * 2, height: 20, color: indigo, opacity: 0.12 });
    p1.drawText("No.", { x: M + 6, y, size: 9, font: helBold, color: indigo });
    p1.drawText("給付金名", { x: M + 34, y, size: 9, font: jpFont, color: indigo });
    p1.drawText("出典", { x: M + 240, y, size: 9, font: jpFont, color: indigo });
    p1.drawText("金額（目安）", { x: W - M - 80, y, size: 9, font: jpFont, color: indigo });
    y -= 22;

    for (let i = 0; i < benefits.length; i++) {
      const b = benefits[i];
      if (i % 2 === 0) p1.drawRectangle({ x: M, y: y - 3, width: W - M * 2, height: 20, color: lightGray });
      p1.drawText(`${i + 1}`, { x: M + 10, y, size: 9, font: hel, color: darkGray });
      p1.drawText(b.name, { x: M + 34, y, size: 9, font: jpFont, color: darkGray });
      p1.drawText(b.source ?? "", { x: M + 240, y, size: 8, font: jpFont, color: midGray });
      const amtStr = b.amount > 0 ? `${b.amount.toLocaleString()} 円` : "無償化";
      p1.drawText(amtStr, { x: W - M - hel.widthOfTextAtSize(amtStr, 9) - 4, y, size: 9, font: hel, color: darkGray });
      y -= 22;
    }
  }

  // 合計
  y -= 6;
  p1.drawRectangle({ x: M, y: y - 6, width: W - M * 2, height: 32, color: indigo, opacity: 0.07, borderColor: indigo, borderWidth: 1.2 });
  p1.drawText("合計受給見込み額", { x: M + 12, y: y + 8, size: 11, font: jpFont, color: indigo });
  const totalStr = `${total.toLocaleString()} 円`;
  p1.drawText(totalStr, { x: W - M - helBold.widthOfTextAtSize(totalStr, 13) - 12, y: y + 7, size: 13, font: helBold, color: indigo });
  y -= 48;

  // 注意事項
  const notes = [
    "・本書は診断アプリによる自動生成書類です。実際の受給には別途審査が必要です。",
    "・各給付金の詳細条件は公式ページまたは窓口でご確認ください。",
    "・申請先窓口: 世田谷区役所　各地区保健福祉課（障害・生活支援系）",
    "　　　　　　  子ども・若者支援課（保育・幼稚園系）",
    "　　　　　　  ぷらっとホーム世田谷 03-5431-5355（住居確保給付金）",
  ];
  p1.drawText("【注意事項・申請先】", { x: M, y, size: 9, font: jpFont, color: midGray });
  y -= 13;
  for (const note of notes) {
    p1.drawText(note, { x: M, y, size: 8, font: jpFont, color: midGray });
    y -= 12;
  }

  // フッター
  p1.drawLine({ start: { x: M, y: 36 }, end: { x: W - M, y: 36 }, thickness: 0.4, color: midGray, opacity: 0.3 });
  p1.drawText("世田谷区 給付金診断アプリ 自動生成", { x: M, y: 22, size: 7, font: jpFont, color: midGray, opacity: 0.5 });
  p1.drawText("1 / " + (1 + benefits.length), { x: W - M - 30, y: 22, size: 7, font: hel, color: midGray, opacity: 0.5 });

  // ============================================================
  // ページ2以降: 給付金ごとの申請記入ガイド
  // ============================================================
  for (let bi = 0; bi < benefits.length; bi++) {
    const b = benefits[bi];
    const pg = pdfDoc.addPage([W, H]);

    // ヘッダー帯（薄め）
    pg.drawRectangle({ x: 0, y: H - 70, width: W, height: 70, color: indigo, opacity: 0.85 });
    pg.drawText(`申請記入ガイド（${bi + 1} / ${benefits.length}）`, { x: M, y: H - 30, size: 9, font: jpFont, color: rgb(0.75, 0.8, 1) });
    pg.drawText(b.name, { x: M, y: H - 52, size: 16, font: jpFont, color: white });
    pg.drawText(b.source ?? "", { x: W - M - (jpFont.widthOfTextAtSize(b.source ?? "", 9) + 4), y: H - 52, size: 9, font: jpFont, color: rgb(0.75, 0.8, 1) });

    let py = H - 90;

    // 申請方法
    if (b.applicationMethod) {
      py = drawSection(pg, "■ 申請方法", py);
      pg.drawText(b.applicationMethod, { x: M, y: py, size: 9, font: jpFont, color: darkGray, maxWidth: W - M * 2, lineHeight: 14 });
      py -= Math.ceil(b.applicationMethod.length / 55) * 14 + 8;
      if (b.onlineFormUrl) {
        pg.drawText(`オンライン申請: ${b.onlineFormUrl}`, { x: M, y: py, size: 8, font: jpFont, color: indigo });
        py -= 14;
      }
      if (b.sourceUrl) {
        pg.drawText(`公式ページ: ${b.sourceUrl}`, { x: M, y: py, size: 8, font: jpFont, color: indigo });
        py -= 14;
      }
      py -= 6;
    }

    // 必要書類
    if (b.requiredDocs && b.requiredDocs.length > 0) {
      py = drawSection(pg, "■ 必要書類チェックリスト", py);
      for (const doc of b.requiredDocs) {
        pg.drawRectangle({ x: M, y: py - 1, width: 12, height: 12, borderColor: indigo, borderWidth: 1, opacity: 0.5 });
        pg.drawText(doc, { x: M + 18, y: py, size: 9, font: jpFont, color: darkGray });
        py -= 18;
      }
      py -= 6;
    }

    // 申請書記入内容
    if (b.fieldGuide && b.fieldGuide.length > 0) {
      py = drawSection(pg, "■ 申請書記入内容（窓口・フォームに転記してください）", py);
      pg.drawRectangle({ x: M, y: py - 3, width: W - M * 2, height: 18, color: indigo, opacity: 0.1 });
      pg.drawText("記入欄", { x: M + 6, y: py, size: 8, font: jpFont, color: indigo });
      pg.drawText("入力内容", { x: M + 140, y: py, size: 8, font: jpFont, color: indigo });
      py -= 20;

      for (let fi = 0; fi < b.fieldGuide.length; fi++) {
        const { label, value } = b.fieldGuide[fi];
        if (fi % 2 === 0) pg.drawRectangle({ x: M, y: py - 3, width: W - M * 2, height: 18, color: lightGray });
        pg.drawText(label, { x: M + 6, y: py, size: 9, font: jpFont, color: midGray });
        pg.drawText(value, { x: M + 140, y: py, size: 9, font: jpFont, color: value.startsWith("（") ? midGray : darkGray });
        py -= 20;
        if (py < 60) break; // ページオーバーフロー防止
      }
    }

    // フッター
    pg.drawLine({ start: { x: M, y: 36 }, end: { x: W - M, y: 36 }, thickness: 0.4, color: midGray, opacity: 0.3 });
    pg.drawText("世田谷区 給付金診断アプリ 自動生成", { x: M, y: 22, size: 7, font: jpFont, color: midGray, opacity: 0.5 });
    pg.drawText(`${bi + 2} / ${1 + benefits.length}`, { x: W - M - 30, y: 22, size: 7, font: hel, color: midGray, opacity: 0.5 });
  }

  return await pdfDoc.save();
}

export default function PdfDownloadButton({ benefits, total, form }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const bytes = await generatePdf(benefits, total, form);
      const blob  = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url   = URL.createObjectURL(blob);
      const a     = document.createElement("a");
      a.href      = url;
      a.download  = `給付金申請書_${form.nameKanji || "診断結果"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleDownload} disabled={loading || benefits.length === 0}
      className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-gray-900 disabled:text-slate-400 font-extrabold rounded-2xl shadow-xl hover:shadow-2xl transition text-base flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          申請書PDF生成中...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          申請書PDFを一括ダウンロード（全{benefits.length}件）
        </>
      )}
    </button>
  );
}
