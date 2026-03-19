"use client";

import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { Benefit } from "../types";

interface Props {
  benefits: Benefit[];
  total: number;
}

// 申請書PDF生成
async function generateApplicationPdf(benefits: Benefit[], total: number): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // 日本語フォント（YuGothic）を読み込む
  const fontRes = await fetch("/fonts/YuGothic-Medium.otf");
  const fontBytes = await fontRes.arrayBuffer();
  const jpFont = await pdfDoc.embedFont(fontBytes);

  // 英数字用フォント
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // A4 ページ追加（595 × 842 pt）
  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();

  const margin = 50;
  const indigo = rgb(0.29, 0.37, 0.93); // #4A5EED 相当
  const darkGray = rgb(0.2, 0.2, 0.2);
  const midGray = rgb(0.5, 0.5, 0.5);
  const lightGray = rgb(0.93, 0.93, 0.97);

  // ---- ヘッダー背景 ----
  page.drawRectangle({
    x: 0,
    y: height - 90,
    width,
    height: 90,
    color: indigo,
  });

  // ---- タイトル ----
  page.drawText("給付金申請書", {
    x: margin,
    y: height - 52,
    size: 24,
    font: jpFont,
    color: rgb(1, 1, 1),
  });

  // 発行日
  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  page.drawText(`発行日: ${today}`, {
    x: width - margin - 120,
    y: height - 52,
    size: 10,
    font: jpFont,
    color: rgb(0.85, 0.88, 1),
  });

  let y = height - 120;

  // ---- セクション：申請者情報 ----
  page.drawText("■ 申請者情報", {
    x: margin,
    y,
    size: 13,
    font: jpFont,
    color: indigo,
  });
  y -= 10;

  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: indigo,
    opacity: 0.3,
  });
  y -= 20;

  // 申請者テーブル
  const applicantRows: [string, string][] = [
    ["氏名", "山田　太郎（ダミー）"],
    ["住所", "東京都渋谷区代々木 1-2-3（ダミー）"],
    ["郵便番号", "〒 151-0053"],
    ["電話番号", "03-0000-0000"],
  ];

  for (const [label, value] of applicantRows) {
    // ラベル背景
    page.drawRectangle({
      x: margin,
      y: y - 4,
      width: 100,
      height: 20,
      color: lightGray,
    });

    page.drawText(label, {
      x: margin + 8,
      y: y,
      size: 10,
      font: jpFont,
      color: midGray,
    });
    page.drawText(value, {
      x: margin + 115,
      y: y,
      size: 11,
      font: jpFont,
      color: darkGray,
    });
    y -= 28;
  }

  y -= 10;

  // ---- セクション：給付金一覧 ----
  page.drawText("■ 対象給付金一覧", {
    x: margin,
    y,
    size: 13,
    font: jpFont,
    color: indigo,
  });
  y -= 10;

  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: indigo,
    opacity: 0.3,
  });
  y -= 22;

  if (benefits.length === 0) {
    page.drawText("対象となる給付金はありません。", {
      x: margin,
      y,
      size: 11,
      font: jpFont,
      color: midGray,
    });
    y -= 24;
  } else {
    // テーブルヘッダー
    page.drawRectangle({
      x: margin,
      y: y - 4,
      width: width - margin * 2,
      height: 22,
      color: indigo,
      opacity: 0.1,
    });

    page.drawText("No.", { x: margin + 8, y, size: 10, font: helveticaBold, color: indigo });
    page.drawText("給付金名", { x: margin + 40, y, size: 10, font: jpFont, color: indigo });
    page.drawText("金額", { x: width - margin - 80, y, size: 10, font: jpFont, color: indigo });
    y -= 26;

    for (let i = 0; i < benefits.length; i++) {
      const b = benefits[i];

      // ゼブラストライプ
      if (i % 2 === 0) {
        page.drawRectangle({
          x: margin,
          y: y - 4,
          width: width - margin * 2,
          height: 22,
          color: lightGray,
        });
      }

      page.drawText(`${i + 1}`, {
        x: margin + 10,
        y,
        size: 10,
        font: helvetica,
        color: darkGray,
      });
      page.drawText(b.name, {
        x: margin + 40,
        y,
        size: 10,
        font: jpFont,
        color: darkGray,
      });
      const amountStr = `${b.amount.toLocaleString("ja-JP")} 円`;
      const amountWidth = helvetica.widthOfTextAtSize(amountStr, 10);
      page.drawText(amountStr, {
        x: width - margin - amountWidth,
        y,
        size: 10,
        font: helvetica,
        color: darkGray,
      });
      y -= 26;
    }
  }

  y -= 10;

  // ---- 合計金額ボックス ----
  page.drawRectangle({
    x: margin,
    y: y - 8,
    width: width - margin * 2,
    height: 36,
    color: indigo,
    opacity: 0.08,
    borderColor: indigo,
    borderWidth: 1.5,
  });

  page.drawText("合計受給見込み額", {
    x: margin + 14,
    y: y + 8,
    size: 12,
    font: jpFont,
    color: indigo,
  });

  const totalStr = `${total.toLocaleString("ja-JP")} 円`;
  const totalWidth = helveticaBold.widthOfTextAtSize(totalStr, 14);
  page.drawText(totalStr, {
    x: width - margin - totalWidth - 14,
    y: y + 6,
    size: 14,
    font: helveticaBold,
    color: indigo,
  });

  y -= 60;

  // ---- 備考 ----
  page.drawText("【注意事項】", {
    x: margin,
    y,
    size: 10,
    font: jpFont,
    color: midGray,
  });
  y -= 16;

  const notes = [
    "・本書は診断結果に基づく参考資料です。実際の給付には別途審査が必要です。",
    "・給付金の受給条件は自治体により異なる場合があります。",
    "・詳細は各給付金の窓口または自治体にご確認ください。",
  ];

  for (const note of notes) {
    page.drawText(note, {
      x: margin,
      y,
      size: 9,
      font: jpFont,
      color: midGray,
    });
    y -= 14;
  }

  // ---- フッター ----
  page.drawLine({
    start: { x: margin, y: 40 },
    end: { x: width - margin, y: 40 },
    thickness: 0.5,
    color: midGray,
    opacity: 0.4,
  });
  page.drawText("給付金診断アプリ　自動生成書類", {
    x: margin,
    y: 25,
    size: 8,
    font: jpFont,
    color: midGray,
    opacity: 0.6,
  });
  page.drawText(`Page 1`, {
    x: width - margin - 30,
    y: 25,
    size: 8,
    font: helvetica,
    color: midGray,
    opacity: 0.6,
  });

  return await pdfDoc.save();
}

export default function PdfDownloadButton({ benefits, total }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const pdfBytes = await generateApplicationPdf(benefits, total);
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "給付金申請書.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading || benefits.length === 0}
      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md hover:shadow-lg transition text-base flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          PDF生成中...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          申請書PDFをダウンロード
        </>
      )}
    </button>
  );
}
