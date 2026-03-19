"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ApplicantInfo } from "../types";
import { loadMypage, saveMypage, EMPTY_APPLICANT } from "../lib/mypage";

export default function MyPage() {
  const [info, setInfo] = useState<ApplicantInfo>(EMPTY_APPLICANT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setInfo(loadMypage());
  }, []);

  const set = (patch: Partial<ApplicantInfo>) => setInfo((f) => ({ ...f, ...patch }));

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    saveMypage(info);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
        <span className="text-white font-bold text-sm">マイページ</span>
      </header>

      <main className="relative z-10 flex-1 flex items-start justify-center px-4 py-6 pb-12">
        <div className="w-full max-w-lg">

          {/* タイトル */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 glass text-indigo-300 text-xs font-semibold px-4 py-2 rounded-full mb-4">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              申請者情報
            </div>
            <h1 className="text-2xl font-extrabold text-white">マイページ</h1>
            <p className="text-slate-400 text-xs mt-1">入力内容は申請書PDFの自動生成に使われます。このデバイスにのみ保存されます。</p>
          </div>

          <form onSubmit={handleSave}>
            <div className="glass rounded-3xl p-6 md:p-8 shadow-2xl space-y-5">

              {/* 氏名 */}
              <Row label="氏名（漢字）">
                <TextInput placeholder="世田谷 太郎" value={info.nameKanji}
                  onChange={(v) => set({ nameKanji: v })} />
              </Row>
              <Row label="氏名（フリガナ）">
                <TextInput placeholder="セタガヤ タロウ" value={info.nameKana}
                  onChange={(v) => set({ nameKana: v })} />
              </Row>
              <Row label="郵便番号">
                <TextInput placeholder="154-0004" value={info.postalCode}
                  onChange={(v) => set({ postalCode: v })} />
              </Row>
              <Row label="住所">
                <TextInput placeholder="世田谷区太子堂1-1-1" value={info.address}
                  onChange={(v) => set({ address: v })} />
              </Row>
              <Row label="電話番号">
                <TextInput placeholder="03-0000-0000" value={info.phone}
                  onChange={(v) => set({ phone: v })} />
              </Row>

              <hr className="border-white/10" />
              <p className="text-slate-400 text-xs font-bold">振込先口座（申請書PDF用）</p>

              <Row label="金融機関名">
                <TextInput placeholder="○○銀行" value={info.bankName}
                  onChange={(v) => set({ bankName: v })} />
              </Row>
              <Row label="支店名">
                <TextInput placeholder="世田谷支店" value={info.bankBranch}
                  onChange={(v) => set({ bankBranch: v })} />
              </Row>
              <Row label="口座種別">
                <div className="grid grid-cols-2 gap-2">
                  {(["futsuu", "toza"] as const).map((t) => (
                    <button key={t} type="button"
                      onClick={() => set({ bankType: t })}
                      className={`py-3 rounded-xl border-2 text-sm font-medium transition ${
                        info.bankType === t
                          ? "border-indigo-400 bg-indigo-500/20 text-white"
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-indigo-400/40"
                      }`}>
                      {t === "futsuu" ? "普通" : "当座"}
                    </button>
                  ))}
                </div>
              </Row>
              <Row label="口座番号">
                <TextInput placeholder="1234567" value={info.bankNumber}
                  onChange={(v) => set({ bankNumber: v })} />
              </Row>
            </div>

            {/* 保存ボタン */}
            <div className="mt-4 space-y-3">
              <button type="submit"
                className={`w-full py-4 font-extrabold rounded-2xl shadow-xl transition text-base flex items-center justify-center gap-2 ${
                  saved
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                    : "bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white"
                }`}>
                {saved ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    保存しました
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    このデバイスに保存する
                  </>
                )}
              </button>

              <Link href="/diagnosis"
                className="w-full py-3.5 glass hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition text-sm flex items-center justify-center gap-2">
                給付金を診断する →
              </Link>
            </div>

            <p className="text-center text-xs text-slate-500 mt-4">
              ※ 入力内容はブラウザのlocalStorageにのみ保存されます。サーバーには送信されません。
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-300 mb-2">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ placeholder, value, onChange }: {
  placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <input type="text" placeholder={placeholder} value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 text-sm transition"
    />
  );
}
