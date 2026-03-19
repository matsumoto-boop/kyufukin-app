"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { DiagnosisForm, FamilyType, IncomeRange, HousingType, Benefit } from "../types";
import { calculateBenefits } from "../lib/benefits";
import PdfDownloadButton from "../components/PdfDownloadButton";

const familyLabels: Record<FamilyType, string> = {
  single: "単身",
  couple: "夫婦",
  with_children: "子供あり",
};

const incomeLabels: Record<IncomeRange, string> = {
  under300: "〜300万円",
  under600: "〜600万円",
  under800: "〜800万円",
  over800: "800万円以上",
};

const housingLabels: Record<HousingType, string> = {
  rent: "賃貸",
  own: "持ち家",
};

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form: DiagnosisForm = {
    postalCode: searchParams.get("postalCode") ?? "",
    familyType: (searchParams.get("familyType") as FamilyType) ?? "single",
    incomeRange: (searchParams.get("incomeRange") as IncomeRange) ?? "under300",
    housingType: (searchParams.get("housingType") as HousingType) ?? "rent",
  };

  const benefits: Benefit[] = calculateBenefits(form);
  const total = benefits.reduce((sum, b) => sum + b.amount, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">診断結果</h1>
          <p className="mt-2 text-gray-500 text-sm">あなたが該当する給付金の一覧です</p>
        </div>

        {/* 入力内容サマリー */}
        <div className="bg-white rounded-2xl shadow p-4 mb-4 flex flex-wrap gap-2 text-xs text-gray-600">
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">📮 {form.postalCode}</span>
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">👥 {familyLabels[form.familyType]}</span>
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">💴 {incomeLabels[form.incomeRange]}</span>
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">🏠 {housingLabels[form.housingType]}</span>
        </div>

        {/* 合計金額 */}
        <div className="bg-indigo-600 rounded-3xl shadow-xl p-6 mb-6 text-white text-center">
          <p className="text-sm font-medium opacity-80 mb-1">受給可能な合計金額（目安）</p>
          {benefits.length > 0 ? (
            <p className="text-5xl font-extrabold tracking-tight">
              {total.toLocaleString()}<span className="text-2xl ml-1">円</span>
            </p>
          ) : (
            <p className="text-2xl font-bold">該当する給付金はありません</p>
          )}
          <p className="text-xs opacity-60 mt-2">{benefits.length}件の給付金が該当</p>
        </div>

        {/* 給付金一覧 */}
        {benefits.length > 0 ? (
          <div className="space-y-3 mb-6">
            {benefits.map((benefit, index) => (
              <div key={benefit.id} className="bg-white rounded-2xl shadow p-5 flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-gray-800">{benefit.name}</h3>
                    <span className="text-indigo-600 font-extrabold text-sm whitespace-nowrap">
                      {benefit.amount.toLocaleString()}円
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-8 text-center mb-6">
            <p className="text-gray-400 text-sm">入力内容に該当する給付金が見つかりませんでした。</p>
          </div>
        )}

        {/* PDFダウンロードボタン */}
        <div className="mb-3">
          <PdfDownloadButton benefits={benefits} total={total} />
        </div>

        {/* 戻るボタン */}
        <button
          onClick={() => router.push("/")}
          className="w-full py-4 bg-white hover:bg-gray-50 text-indigo-600 font-bold rounded-xl shadow border border-indigo-100 transition text-base"
        >
          ← もう一度診断する
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          ※ 表示される給付金額は目安です。実際の受給には審査が必要です。
        </p>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-indigo-600 text-lg font-semibold">診断中...</div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
