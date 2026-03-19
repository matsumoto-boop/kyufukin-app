"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DiagnosisForm, FamilyType, IncomeRange, HousingType } from "./types";

const initialForm: DiagnosisForm = {
  postalCode: "",
  familyType: "single",
  incomeRange: "under300",
  housingType: "rent",
};

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState<DiagnosisForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof DiagnosisForm, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof DiagnosisForm, string>> = {};
    if (!/^\d{3}-?\d{4}$/.test(form.postalCode)) {
      newErrors.postalCode = "郵便番号を正しく入力してください（例：123-4567）";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const params = new URLSearchParams({
      postalCode: form.postalCode,
      familyType: form.familyType,
      incomeRange: form.incomeRange,
      housingType: form.housingType,
    });
    router.push(`/result?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">給付金診断</h1>
          <p className="mt-2 text-gray-500 text-sm">あなたが受け取れる給付金を無料で診断します</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 郵便番号 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                郵便番号
              </label>
              <input
                type="text"
                placeholder="123-4567"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.postalCode ? "border-red-400 bg-red-50" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 text-sm transition`}
              />
              {errors.postalCode && (
                <p className="mt-1.5 text-xs text-red-500">{errors.postalCode}</p>
              )}
            </div>

            {/* 家族構成 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                家族構成
              </label>
              <select
                value={form.familyType}
                onChange={(e) => setForm({ ...form, familyType: e.target.value as FamilyType })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 text-sm bg-white transition appearance-none cursor-pointer"
              >
                <option value="single">単身</option>
                <option value="couple">夫婦</option>
                <option value="with_children">子供あり</option>
              </select>
            </div>

            {/* 年収 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                年収
              </label>
              <select
                value={form.incomeRange}
                onChange={(e) => setForm({ ...form, incomeRange: e.target.value as IncomeRange })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 text-sm bg-white transition appearance-none cursor-pointer"
              >
                <option value="under300">〜300万円</option>
                <option value="under600">〜600万円</option>
                <option value="under800">〜800万円</option>
                <option value="over800">800万円以上</option>
              </select>
            </div>

            {/* 住居 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                住居
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["rent", "own"] as HousingType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, housingType: type })}
                    className={`py-3 rounded-xl border-2 text-sm font-medium transition ${
                      form.housingType === type
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-600 hover:border-indigo-300"
                    }`}
                  >
                    {type === "rent" ? "🏠 賃貸" : "🏡 持ち家"}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition text-base mt-2"
            >
              診断する →
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          ※ 表示される給付金額は目安です。実際の受給には審査が必要です。
        </p>
      </div>
    </main>
  );
}
