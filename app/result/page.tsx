"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { DiagnosisForm, ApplicantInfo, FamilyType, IncomeRange, HousingType, AgeRange, TaxStatus, IncomeChange, DisabilityType, ChildSchool, Benefit } from "../types";
import { calculateBenefits } from "../lib/benefits";
import { loadMypage, mypageIsEmpty, EMPTY_APPLICANT } from "../lib/mypage";
import { detectMunicipality } from "../lib/municipality";
import PdfDownloadButton from "../components/PdfDownloadButton";

const colors = [
  { bg: "from-violet-500/20 to-indigo-500/20", border: "border-violet-400/40", badge: "bg-violet-500/30 text-violet-200", num: "from-violet-500 to-indigo-600" },
  { bg: "from-emerald-500/20 to-teal-500/20",  border: "border-emerald-400/40", badge: "bg-emerald-500/30 text-emerald-200", num: "from-emerald-500 to-teal-600" },
  { bg: "from-orange-500/20 to-rose-500/20",   border: "border-orange-400/40", badge: "bg-orange-500/30 text-orange-200",   num: "from-orange-500 to-rose-600" },
  { bg: "from-sky-500/20 to-blue-500/20",      border: "border-sky-400/40",    badge: "bg-sky-500/30 text-sky-200",         num: "from-sky-500 to-blue-600" },
  { bg: "from-pink-500/20 to-fuchsia-500/20",  border: "border-pink-400/40",   badge: "bg-pink-500/30 text-pink-200",       num: "from-pink-500 to-fuchsia-600" },
];

function parseEligibility(params: URLSearchParams): Omit<DiagnosisForm, keyof ApplicantInfo> {
  const g = (k: string, def: string) => params.get(k) ?? def;
  return {
    ageRange:     (g("ageRange",     "20to64")  as AgeRange),
    familyType:   (g("familyType",   "single")  as FamilyType),
    incomeRange:  (g("incomeRange",  "under300") as IncomeRange),
    taxStatus:    (g("taxStatus",    "taxed")    as TaxStatus),
    incomeChange: (g("incomeChange", "stable")   as IncomeChange),
    housingType:  (g("housingType",  "rent")     as HousingType),
    disability:   (g("disability",   "none")     as DisabilityType),
    childSchool:  (g("childSchool",  "na")       as ChildSchool),
  };
}

// ---- 申請ガイドパネル ----
function ApplyPanel({ benefit, form, onClose }: {
  benefit: Benefit; form: DiagnosisForm; onClose: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(value: string, key: string) {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-2 pb-0 sm:pb-0">
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* パネル */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
          <div>
            <p className="text-xs text-indigo-300 font-bold">申請ガイド</p>
            <h3 className="text-white font-extrabold text-sm mt-0.5">{benefit.name}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
          {/* 申請方法 */}
          {benefit.applicationMethod && (
            <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-xl p-4">
              <p className="text-xs font-bold text-indigo-300 mb-1">申請方法</p>
              <p className="text-slate-200 text-sm leading-relaxed">{benefit.applicationMethod}</p>
              {benefit.onlineFormUrl && (
                <a href={benefit.onlineFormUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-full transition">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  オンライン申請フォームを開く
                </a>
              )}
              {benefit.sourceUrl && (
                <a href={benefit.sourceUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 ml-2 text-indigo-400 hover:text-indigo-300 text-xs transition underline">
                  公式ページを確認する →
                </a>
              )}
            </div>
          )}

          {/* 必要書類 */}
          {benefit.requiredDocs && benefit.requiredDocs.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 mb-2">📄 必要書類</p>
              <ul className="space-y-1.5">
                {benefit.requiredDocs.map((doc, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="w-4 h-4 bg-emerald-500/20 text-emerald-400 rounded flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">✓</span>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 入力フィールドガイド */}
          {benefit.fieldGuide && benefit.fieldGuide.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 mb-2">📋 申請書への記入内容（コピーして使えます）</p>
              <div className="space-y-2">
                {benefit.fieldGuide.map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2.5 border border-white/10">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="text-sm text-white font-medium truncate">{value}</p>
                    </div>
                    {value !== "（未入力）" && (
                      <button onClick={() => copy(value, label)}
                        className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full transition font-bold ${
                          copied === label
                            ? "bg-emerald-500/30 text-emerald-300"
                            : "bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40"
                        }`}>
                        {copied === label ? "✓" : "コピー"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {form.nameKanji === "" && (
                <p className="text-yellow-400/80 text-xs mt-2">
                  ⚠ 氏名・住所は
                  <Link href="/mypage" className="underline mx-1">マイページ</Link>
                  で入力すると自動で埋まります。
                </p>
              )}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="px-5 py-4 border-t border-white/10 flex-shrink-0">
          <p className="text-slate-500 text-xs">
            ※ 表示内容は目安です。実際の申請は公式窓口・ページでご確認ください。
          </p>
        </div>
      </div>
    </div>
  );
}

// ---- メインコンテンツ ----
function ResultContent() {
  const router = useRouter();
  const params = useSearchParams();
  const eligibility = parseEligibility(params);

  const [mypage, setMypage] = useState<ApplicantInfo>(EMPTY_APPLICANT);
  useEffect(() => { setMypage(loadMypage()); }, []);

  const form: DiagnosisForm = { ...mypage, ...eligibility };
  const noMypage = mypageIsEmpty(mypage);

  const municipalityCode = params.get("municipalityCode") ?? undefined;
  const municipality = municipalityCode ? detectMunicipality(form.postalCode || "") ?? { code: municipalityCode, name: municipalityCode, prefecture: "" } : null;

  const benefits: Benefit[] = calculateBenefits(form, municipalityCode);
  const total  = benefits.reduce((s, b) => s + b.amount, 0);
  const hasResult = benefits.length > 0;

  const [activeBenefit, setActiveBenefit] = useState<Benefit | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 flex flex-col">
      {/* 背景 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600 opacity-10 rounded-full blur-3xl" />
        {hasResult && [...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full opacity-50"
            style={{
              width: `${6 + (i % 3) * 4}px`, height: `${6 + (i % 3) * 4}px`,
              left: `${10 + i * 14}%`, top: `${4 + (i % 3) * 6}%`,
              background: ["#fbbf24","#818cf8","#34d399","#f472b6","#38bdf8","#fb923c"][i],
              animation: `confetti-fall ${2 + i * 0.4}s ease-in infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* ヘッダー */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link href="/diagnosis" className="flex items-center gap-2 text-slate-300 hover:text-white transition text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          やり直す
        </Link>
        <span className="text-white font-bold text-sm">給付金診断</span>
        <Link href="/mypage" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition text-xs">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          マイページ
        </Link>
      </header>

      <main className="relative z-10 flex-1 px-4 py-4 pb-12">
        <div className="max-w-lg mx-auto space-y-4">

          {/* 合計カード */}
          <div className="relative rounded-3xl overflow-hidden">
            <div className={`absolute inset-0 ${hasResult
              ? "bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700"
              : "bg-gradient-to-br from-slate-700 to-slate-800"}`} />
            {hasResult && (
              <>
                <div className="absolute top-4 right-8 w-24 h-24 bg-white opacity-5 rounded-full blur-xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl" />
              </>
            )}
            <div className="relative p-8 text-center">
              {hasResult ? (
                <>
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                    <div className="inline-flex items-center gap-2 glass text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefits.length}件の給付金が申請可能です
                    </div>
                    {municipality && (
                      <div className="inline-flex items-center gap-1.5 bg-indigo-500/30 text-indigo-200 text-xs font-bold px-3 py-1.5 rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {municipality.name}
                      </div>
                    )}
                  </div>
                  {form.nameKanji && (
                    <p className="text-slate-300 text-xs mb-2">{form.nameKanji} さんへの診断結果</p>
                  )}
                  <p className="text-slate-300 text-sm mb-1">受給可能な合計額（目安）</p>
                  <p className="text-6xl md:text-7xl font-extrabold text-white tracking-tight">
                    {total.toLocaleString()}
                    <span className="text-3xl text-yellow-300 ml-2">円</span>
                  </p>
                  <p className="text-slate-400 text-xs mt-3">※ 審査・窓口確認により変動する場合があります</p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-4">😔</div>
                  <p className="text-slate-300 text-lg font-bold mb-2">現在の条件では該当する給付金はありません</p>
                  <p className="text-slate-400 text-sm">条件を変えて再度お試しください</p>
                </>
              )}
            </div>
          </div>

          {/* マイページ未入力バナー */}
          {noMypage && hasResult && (
            <Link href="/mypage"
              className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-400/30 rounded-2xl px-4 py-3 hover:bg-yellow-500/20 transition">
              <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-yellow-300 text-xs font-bold">マイページを入力するとPDFに氏名・住所が自動入力されます</p>
                <p className="text-yellow-400/70 text-xs mt-0.5">タップして入力 →</p>
              </div>
            </Link>
          )}

          {/* 給付金リスト */}
          {hasResult && (
            <div className="space-y-3">
              <h2 className="text-slate-300 text-sm font-bold px-1">📋 申請可能な給付金</h2>
              {benefits.map((benefit, index) => {
                const c = colors[index % colors.length];
                return (
                  <div key={benefit.id}
                    className={`rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} p-4 card-hover`}>
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${c.num} text-white flex items-center justify-center text-sm font-extrabold shadow-lg`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-white font-bold text-sm">{benefit.name}</h3>
                          <span className={`flex-shrink-0 text-xs font-extrabold px-2.5 py-0.5 rounded-full ${c.badge}`}>
                            {benefit.amount > 0 ? `${benefit.amount.toLocaleString()}円` : "無償化"}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed mb-2">{benefit.description}</p>
                        {benefit.amountNote && (
                          <p className="text-yellow-300/80 text-xs mb-2">💡 {benefit.amountNote}</p>
                        )}
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-slate-500 text-xs">出典: {benefit.source}</span>
                          {/* 申請ボタン */}
                          <button
                            onClick={() => setActiveBenefit(benefit)}
                            className="inline-flex items-center gap-1.5 bg-indigo-500/30 hover:bg-indigo-500/50 border border-indigo-400/40 text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-full transition"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            申請ガイドを見る
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 合計バー */}
          {hasResult && (
            <div className="glass rounded-2xl p-4 flex items-center justify-between">
              <span className="text-slate-300 text-sm font-bold">合計受給見込み額</span>
              <span className="text-2xl font-extrabold text-yellow-300">{total.toLocaleString()}円</span>
            </div>
          )}

          {/* アクションボタン */}
          <div className="space-y-3 pt-2">
            <PdfDownloadButton benefits={benefits} total={total} form={form} />
            <button onClick={() => router.push("/diagnosis")}
              className="w-full py-3.5 glass hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition text-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              もう一度診断する
            </button>
            <Link href="/" className="w-full py-3 flex items-center justify-center text-slate-500 hover:text-slate-300 text-xs transition">
              トップへ戻る
            </Link>
          </div>
        </div>
      </main>

      {/* 申請ガイドパネル */}
      {activeBenefit && (
        <ApplyPanel benefit={activeBenefit} form={form} onClose={() => setActiveBenefit(null)} />
      )}
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-indigo-300 text-sm font-semibold">診断中...</p>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
