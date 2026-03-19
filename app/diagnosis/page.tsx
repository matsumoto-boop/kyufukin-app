"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DiagnosisForm, FamilyType, IncomeRange, HousingType,
  AgeRange, TaxStatus, IncomeChange, DisabilityType, ChildSchool,
} from "../types";
import { detectMunicipality, isValidPostalCode } from "../lib/municipality";

type EligibilityForm = {
  postalCode:   string;
  ageRange:     AgeRange;
  familyType:   FamilyType;
  incomeRange:  IncomeRange;
  taxStatus:    TaxStatus;
  incomeChange: IncomeChange;
  housingType:  HousingType;
  disability:   DisabilityType;
  childSchool:  ChildSchool;
};

const EMPTY: EligibilityForm = {
  postalCode: "",
  ageRange: "20to64", familyType: "single", incomeRange: "under300",
  taxStatus: "taxed", incomeChange: "stable", housingType: "rent",
  disability: "none", childSchool: "na",
};

const STEPS = ["世帯・収入", "住居・状況"];

export default function DiagnosisPage() {
  const router = useRouter();
  const [form, setForm] = useState<EligibilityForm>(EMPTY);
  const [step, setStep] = useState(0);
  const [postalError, setPostalError] = useState("");

  const set = (patch: Partial<EligibilityForm>) => setForm((f) => ({ ...f, ...patch }));

  const municipality = isValidPostalCode(form.postalCode)
    ? detectMunicipality(form.postalCode)
    : null;

  function handlePostalChange(v: string) {
    set({ postalCode: v });
    setPostalError("");
  }

  function handleStart(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidPostalCode(form.postalCode)) {
      setPostalError("郵便番号を正しく入力してください（例: 154-0004）");
      return;
    }
    if (!municipality) {
      setPostalError("現在このエリアの給付金情報は準備中です");
      return;
    }
    setStep(1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(
      Object.entries(form).map(([k, v]) => [k, v as string])
    );
    if (municipality) params.set("municipalityCode", municipality.code);
    router.push(`/result?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600 opacity-10 rounded-full blur-3xl" />
      </div>

      {/* ヘッダー */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          トップへ
        </Link>
        <span className="text-white font-bold text-sm">給付金診断</span>
        <Link href="/mypage" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition text-xs">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          マイページ
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-start justify-center px-4 py-6 pb-12">
        <div className="w-full max-w-lg">

          {/* タイトル */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 glass text-indigo-300 text-xs font-semibold px-4 py-2 rounded-full mb-4">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              {municipality ? `${municipality.prefecture} ${municipality.name}・給付金診断` : "給付金診断"}
            </div>
            <h1 className="text-2xl font-extrabold text-white">あなたの状況を教えてください</h1>
            <p className="text-slate-400 text-xs mt-1">選択するだけ・約30秒で完了します</p>
          </div>

          {/* ===== STEP 0: 郵便番号入力 ===== */}
          {step === 0 && (
            <form onSubmit={handleStart}>
              <div className="glass rounded-3xl p-6 md:p-8 shadow-2xl">
                <p className="text-slate-300 text-sm font-bold mb-1">お住まいの郵便番号</p>
                <p className="text-slate-500 text-xs mb-4">お住まいのエリアに対応した給付金情報を検索します</p>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="154-0004"
                      value={form.postalCode}
                      onChange={(e) => handlePostalChange(e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-xl border text-white text-lg font-bold tracking-widest placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 transition ${
                        postalError
                          ? "border-red-400/60 bg-red-500/10"
                          : municipality
                          ? "border-emerald-400/60 bg-emerald-500/10"
                          : "border-white/20 bg-white/10"
                      }`}
                      maxLength={8}
                    />
                  </div>
                </div>

                {/* 自治体検出結果 */}
                {municipality && (
                  <div className="flex items-center gap-2 mt-3 bg-emerald-500/10 border border-emerald-400/30 rounded-xl px-4 py-2.5">
                    <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="text-emerald-300 text-xs font-bold">
                        {municipality.prefecture} {municipality.name} の給付金情報で検索します
                      </p>
                    </div>
                  </div>
                )}

                {/* エリア未対応メッセージ */}
                {isValidPostalCode(form.postalCode) && !municipality && (
                  <div className="flex items-center gap-2 mt-3 bg-yellow-500/10 border border-yellow-400/30 rounded-xl px-4 py-2.5">
                    <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-yellow-300 text-xs">
                      現在は世田谷区（154〜158番台）の給付金情報のみ対応しています
                    </p>
                  </div>
                )}

                {postalError && (
                  <p className="mt-2 text-xs text-red-400">{postalError}</p>
                )}
              </div>

              <div className="mt-4">
                <button type="submit"
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-extrabold rounded-2xl shadow-xl transition text-sm">
                  条件を入力する →
                </button>
              </div>
              <p className="text-center text-xs text-slate-500 mt-4">
                ※ 入力内容はブラウザ内のみで処理されます。サーバーへの送信はありません。
              </p>
            </form>
          )}

          {/* ステッパー（STEP 1〜2） */}
          {step > 0 && (
            <>
            <div className="flex gap-2 mb-6">
              {STEPS.map((label, i) => (
                <div key={label} className="flex-1">
                  <div className={`h-1.5 rounded-full mb-1 transition-all ${i < step - 1 ? "bg-emerald-400" : i === step - 1 ? "bg-indigo-400" : "bg-white/10"}`} />
                  <p className={`text-center text-xs ${i === step - 1 ? "text-indigo-300 font-bold" : "text-slate-600"}`}>
                    {i + 1}. {label}
                  </p>
                </div>
              ))}
            </div>

          {/* フォームカード */}
          <form onSubmit={handleSubmit}>
            <div className="glass rounded-3xl p-6 md:p-8 shadow-2xl space-y-5">

              {/* ===== STEP 1: 世帯・収入 ===== */}
              {step === 1 && (
                <>
                  <Row label="年齢帯">
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        ["under20", "20歳未満", "👶"],
                        ["20to64",  "20〜64歳", "🧑"],
                        ["over65",  "65歳以上", "👴"],
                      ] as [AgeRange, string, string][]).map(([v, l, ico]) => (
                        <ToggleBtn key={v} active={form.ageRange === v}
                          onClick={() => set({ ageRange: v })}>
                          <span className="text-xl block mb-0.5">{ico}</span>{l}
                        </ToggleBtn>
                      ))}
                    </div>
                  </Row>

                  <Row label="家族構成">
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        ["single",        "単身",    "🧑"],
                        ["couple",        "夫婦",    "👫"],
                        ["with_children", "子供あり", "👨‍👩‍👧"],
                      ] as [FamilyType, string, string][]).map(([v, l, ico]) => (
                        <ToggleBtn key={v} active={form.familyType === v}
                          onClick={() => {
                            set({ familyType: v, childSchool: v === "with_children" ? "ninkatsu" : "na" });
                          }}>
                          <span className="text-xl block mb-0.5">{ico}</span>{l}
                        </ToggleBtn>
                      ))}
                    </div>
                  </Row>

                  <Row label="年収（世帯収入）">
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        ["under300", "〜300万円"],
                        ["under600", "〜600万円"],
                        ["under800", "〜800万円"],
                        ["over800",  "800万円以上"],
                      ] as [IncomeRange, string][]).map(([v, l]) => (
                        <ToggleBtn key={v} active={form.incomeRange === v}
                          onClick={() => set({ incomeRange: v })}>
                          {l}
                        </ToggleBtn>
                      ))}
                    </div>
                  </Row>

                  <Row label="住民税の課税状況">
                    <div className="grid grid-cols-1 gap-2">
                      {([
                        ["taxed",     "課税（通常通り課税されている）"],
                        ["equalOnly", "均等割のみ課税（所得割は非課税）"],
                        ["exempt",    "非課税（住民税が非課税）"],
                      ] as [TaxStatus, string][]).map(([v, l]) => (
                        <ToggleBtn key={v} active={form.taxStatus === v}
                          onClick={() => set({ taxStatus: v })} left>
                          {l}
                        </ToggleBtn>
                      ))}
                    </div>
                  </Row>

                  <Row label="最近の収入変化">
                    <div className="grid grid-cols-1 gap-2">
                      {([
                        ["stable",  "変化なし（安定している）"],
                        ["reduced", "最近、収入が減少した"],
                        ["quit",    "離職・廃業した"],
                      ] as [IncomeChange, string][]).map(([v, l]) => (
                        <ToggleBtn key={v} active={form.incomeChange === v}
                          onClick={() => set({ incomeChange: v })} left>
                          {l}
                        </ToggleBtn>
                      ))}
                    </div>
                  </Row>
                </>
              )}

              {/* ===== STEP 2: 住居・状況 ===== */}
              {step === 2 && (
                <>
                  <Row label="住居の種類">
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        ["rent", "🏠", "賃貸", "アパート・マンション"],
                        ["own",  "🏡", "持ち家", "一戸建て・分譲"],
                      ] as [HousingType, string, string, string][]).map(([v, ico, l, sub]) => (
                        <button key={v} type="button" onClick={() => set({ housingType: v })}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition text-left ${
                            form.housingType === v
                              ? "border-sky-400 bg-sky-500/20 text-white"
                              : "border-white/10 bg-white/5 text-slate-400 hover:border-sky-400/40"
                          }`}>
                          <span className="text-2xl">{ico}</span>
                          <div>
                            <p className="text-sm font-bold">{l}</p>
                            <p className="text-xs opacity-60">{sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </Row>

                  <Row label="障害・難病の有無">
                    <div className="grid grid-cols-1 gap-2">
                      {([
                        ["none",           "なし"],
                        ["body12",         "身体障害者手帳 1〜2級"],
                        ["body3",          "身体障害者手帳 3級"],
                        ["intellectual13", "愛の手帳 1〜3度"],
                        ["intellectual4",  "愛の手帳 4度"],
                        ["mental1",        "精神障害者保健福祉手帳 1級"],
                        ["nanbyo",         "指定難病・医療券所持"],
                        ["severe_complex", "重度心身障害（重複障害・重心手当対象）"],
                      ] as [DisabilityType, string][]).map(([v, l]) => (
                        <ToggleBtn key={v} active={form.disability === v}
                          onClick={() => set({ disability: v })} left>
                          {l}
                        </ToggleBtn>
                      ))}
                    </div>
                  </Row>

                  {form.familyType === "with_children" && (
                    <Row label="お子さんの通園先">
                      <div className="grid grid-cols-1 gap-2">
                        {([
                          ["ninkatsu",        "認可保育施設（認可保育園・認定こども園等）"],
                          ["private_yochien", "私立幼稚園（新制度未移行）"],
                          ["other",           "その他（認可外・学童等）"],
                          ["na",              "通園していない・対象外"],
                        ] as [ChildSchool, string][]).map(([v, l]) => (
                          <ToggleBtn key={v} active={form.childSchool === v}
                            onClick={() => set({ childSchool: v })} left>
                            {l}
                          </ToggleBtn>
                        ))}
                      </div>
                    </Row>
                  )}
                </>
              )}
            </div>

            {/* ナビゲーション */}
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => setStep((s) => s - 1)}
                className="flex-1 py-3.5 glass text-white font-bold rounded-2xl border border-white/20 transition hover:bg-white/10 text-sm">
                ← 戻る
              </button>
              {step < STEPS.length ? (
                <button type="button" onClick={() => setStep((s) => s + 1)}
                  className="flex-1 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-extrabold rounded-2xl shadow-xl transition text-sm">
                  次へ →
                </button>
              ) : (
                <button type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-gray-900 font-extrabold rounded-2xl shadow-xl transition text-base flex items-center justify-center gap-2">
                  給付金を診断する →
                </button>
              )}
            </div>

            <p className="text-center text-xs text-slate-500 mt-4">
              ※ 入力内容はブラウザ内のみで処理されます。サーバーへの送信はありません。
            </p>
          </form>
          </>
          )}
        </div>
      </main>
    </div>
  );
}

// ---- 共通UIパーツ ----

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-300 mb-2">{label}</label>
      {children}
    </div>
  );
}

function ToggleBtn({ active, onClick, children, left }: {
  active: boolean; onClick: () => void;
  children: React.ReactNode; left?: boolean;
}) {
  return (
    <button type="button" onClick={onClick}
      className={`flex ${left ? "items-center text-left" : "flex-col items-center"} px-3 py-3 rounded-xl border-2 text-sm font-medium transition ${
        active
          ? "border-indigo-400 bg-indigo-500/20 text-white"
          : "border-white/10 bg-white/5 text-slate-400 hover:border-indigo-400/40"
      }`}>
      {children}
    </button>
  );
}
