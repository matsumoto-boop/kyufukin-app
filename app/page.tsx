import Link from "next/link";

const painPoints = [
  "どんな給付金があるか知らない",
  "申請方法が複雑で諦めた",
  "自分が対象かどうか分からない",
  "窓口に行く時間がない",
];

const features = [
  {
    gradient: "from-violet-500 to-indigo-600",
    bg: "from-violet-50 to-indigo-50",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "60秒で診断完了",
    desc: "4項目を入力するだけ。難しい知識は一切不要。スマホからでもサクッと診断できます。",
    badge: "最速",
  },
  {
    gradient: "from-emerald-500 to-teal-600",
    bg: "from-emerald-50 to-teal-50",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "見落としをゼロに",
    desc: "国・自治体・各種制度を横断チェック。知らずに損していた給付金も一括で発見します。",
    badge: "網羅的",
  },
  {
    gradient: "from-orange-500 to-rose-500",
    bg: "from-orange-50 to-rose-50",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "申請書PDFを即出力",
    desc: "診断結果をそのまま申請書PDFとしてダウンロード。窓口にそのまま持参できます。",
    badge: "便利",
  },
  {
    gradient: "from-sky-500 to-blue-600",
    bg: "from-sky-50 to-blue-50",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "完全無料・登録不要",
    desc: "会員登録・メールアドレス・個人情報の入力は一切不要。安心して使えます。",
    badge: "無料",
  },
];

const stats = [
  { value: "7", unit: "種類", label: "対象給付金数" },
  { value: "26", unit: "万円〜", label: "最大受給可能額" },
  { value: "60", unit: "秒", label: "診断にかかる時間" },
  { value: "0", unit: "円", label: "ご利用料金" },
];

const steps = [
  {
    num: "01",
    color: "from-violet-500 to-indigo-600",
    title: "4項目を入力",
    desc: "郵便番号・家族構成・年収・住居を選ぶだけ。入力時間は約1分です。",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    num: "02",
    color: "from-emerald-500 to-teal-600",
    title: "給付金一覧を確認",
    desc: "条件にマッチした給付金の一覧と、合計受給可能額を即座に表示します。",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    num: "03",
    color: "from-orange-500 to-rose-500",
    title: "PDFで申請書を出力",
    desc: "申請書PDFをワンクリックでダウンロード。そのまま窓口や郵送で提出できます。",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
];

const voices = [
  {
    name: "田中 美咲さん",
    attr: "30代・子育て中・パート勤務",
    avatar: "👩",
    text: "子育て中で給付金があることは知っていましたが、何種類も該当するとは思っていませんでした。診断してみたら合計8万円以上受け取れることが分かって驚きました！",
    amount: "82,000円受給",
  },
  {
    name: "鈴木 健一さん",
    attr: "40代・単身・賃貸住まい",
    avatar: "👨",
    text: "住居確保給付金の存在を全然知りませんでした。窓口に行く前に診断できたので、必要な書類も事前に準備できて本当に助かりました。",
    amount: "70,000円受給",
  },
  {
    name: "山田 花子さん",
    attr: "20代・夫婦・新婚",
    avatar: "👩‍❤️‍👨",
    text: "結婚したばかりで生活費がかかる時期に、夫婦向けの給付金があることをこのアプリで知りました。申請書もすぐ出力できて手続きが楽でした。",
    amount: "25,000円受給",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">

      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 bg-white/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-sm">給付金診断</span>
          </div>
          <Link
            href="/diagnosis"
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition shadow-sm"
          >
            無料診断 →
          </Link>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 overflow-hidden pt-14">

        {/* 背景オーブ */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 opacity-20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600 opacity-20 rounded-full blur-3xl animate-float-slow animation-delay-300" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-600 opacity-10 rounded-full blur-3xl animate-float" />
          {/* グリッドパターン */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* テキスト */}
            <div>
              <div className="inline-flex items-center gap-2 glass text-indigo-300 text-xs font-semibold px-4 py-2 rounded-full mb-8 animate-fade-in">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                無料 · 登録不要 · 今すぐ使える
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6 animate-slide-up">
                受け取れる<br />
                <span className="text-shimmer">給付金</span>を<br />
                見逃していませんか？
              </h1>

              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-10 animate-slide-up animation-delay-200">
                4項目を入力するだけで、あなたが対象となる給付金を一括診断。
                申請書PDFもその場でダウンロードできます。
              </p>

              <div className="flex flex-col sm:flex-row gap-3 animate-slide-up animation-delay-300">
                <Link
                  href="/diagnosis"
                  className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-gray-900 font-extrabold text-lg px-8 py-4 rounded-2xl shadow-2xl transition animate-pulse-glow"
                >
                  無料で診断する
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <p className="text-slate-400 text-xs mt-4 animate-fade-in animation-delay-400">
                所要時間 約60秒 · 個人情報の入力なし
              </p>
            </div>

            {/* フローティングカード */}
            <div className="hidden md:flex flex-col items-center gap-4 animate-fade-in animation-delay-300">
              {/* メインカード */}
              <div className="glass rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-float">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-white font-bold text-sm">診断結果</span>
                  <span className="ml-auto text-xs glass text-emerald-300 px-2 py-0.5 rounded-full">3件該当</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "子育て給付金", amount: "50,000円", color: "text-yellow-300" },
                    { name: "住居確保給付金", amount: "30,000円", color: "text-sky-300" },
                    { name: "低所得者支援", amount: "40,000円", color: "text-violet-300" },
                  ].map((b) => (
                    <div key={b.name} className="flex justify-between items-center glass rounded-xl px-3 py-2">
                      <span className="text-slate-200 text-xs">{b.name}</span>
                      <span className={`font-bold text-sm ${b.color}`}>{b.amount}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-slate-300 text-sm">合計受給額</span>
                  <span className="text-2xl font-extrabold text-yellow-300">120,000円</span>
                </div>
              </div>

              {/* サブカード */}
              <div className="glass rounded-2xl p-4 w-72 shadow-xl animate-float animation-delay-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-rose-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">申請書PDFを出力</p>
                    <p className="text-slate-400 text-xs">給付金申請書.pdf</p>
                  </div>
                  <div className="ml-auto w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* スクロールインジケーター */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <span className="text-slate-400 text-xs">スクロール</span>
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ===== PAIN POINTS ===== */}
      <section className="bg-slate-50 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-indigo-600 font-bold text-sm mb-3 uppercase tracking-widest">こんなお悩みはありませんか？</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            「給付金、難しそう…」と<br className="md:hidden" />思っていませんか？
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 text-left mb-10">
            {painPoints.map((p) => (
              <div key={p} className="flex items-center gap-3 bg-white border border-red-100 rounded-xl px-4 py-3 shadow-sm">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">{p}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 justify-center">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-indigo-300 max-w-24" />
            <p className="text-indigo-600 font-extrabold text-lg">給付金診断アプリが解決します！</p>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-indigo-300 max-w-24" />
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label} className="animate-count-up">
              <p className="text-4xl md:text-5xl font-extrabold text-white">
                {s.value}<span className="text-yellow-300 text-2xl">{s.unit}</span>
              </p>
              <p className="text-indigo-200 text-xs mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-indigo-600 font-bold text-sm mb-3 uppercase tracking-widest">Features</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">選ばれる4つの理由</h2>
            <p className="text-gray-500 mt-3">複雑な手続きをシンプルに。必要な給付金を、すぐに。</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className={`relative card-hover rounded-3xl p-6 bg-gradient-to-br ${f.bg} border border-white shadow-sm overflow-hidden`}
              >
                <span className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 bg-white/80 rounded-full text-gray-600 shadow-sm">
                  {f.badge}
                </span>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} text-white flex items-center justify-center mb-4 shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-indigo-600 font-bold text-sm mb-3 uppercase tracking-widest">How it works</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">たった3ステップ</h2>
            <p className="text-gray-500 mt-3">診断から申請書の出力まで最短60秒</p>
          </div>

          <div className="relative space-y-6">
            {/* 縦線 */}
            <div className="absolute left-7 top-14 bottom-14 w-px bg-gradient-to-b from-indigo-300 via-emerald-300 to-orange-300 hidden sm:block" />

            {steps.map((s) => (
              <div key={s.num} className="flex items-start gap-6 relative">
                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-xl z-10`}>
                  {s.icon}
                </div>
                <div className="flex-1 card-hover bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-400 font-mono">{s.num}</span>
                    <h3 className="text-base font-extrabold text-gray-900">{s.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VOICES ===== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-indigo-600 font-bold text-sm mb-3 uppercase tracking-widest">Voice</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">利用者の声</h2>
            <p className="text-gray-500 mt-3">実際に給付金を受け取った方々のコメントです</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {voices.map((v) => (
              <div key={v.name} className="card-hover gradient-border bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-2xl">
                    {v.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{v.name}</p>
                    <p className="text-gray-400 text-xs">{v.attr}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{v.text}"</p>
                <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl px-3 py-2">
                  <span className="text-indigo-700 font-extrabold text-sm">{v.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-indigo-600 opacity-20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-violet-600 opacity-20 rounded-full blur-3xl animate-float-slow" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <p className="text-indigo-300 font-bold text-sm mb-4 uppercase tracking-widest">今すぐ始める</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            受け取れる給付金を<br />
            <span className="text-shimmer">見逃さないで</span>
          </h2>
          <p className="text-slate-300 text-lg mb-10">
            申請しないと受け取れません。<br />
            まず、あなたの条件で診断してみましょう。
          </p>
          <Link
            href="/diagnosis"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-gray-900 font-extrabold text-xl px-12 py-5 rounded-2xl shadow-2xl transition"
          >
            今すぐ無料診断する
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <div className="flex items-center justify-center gap-6 mt-6 text-slate-400 text-sm">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              完全無料
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              登録不要
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              個人情報なし
            </span>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-950 text-slate-500 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-md flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-slate-400 font-semibold text-sm">給付金診断</span>
          </div>
          <p className="text-xs text-center">
            © 2026 給付金診断アプリ　※ 診断結果は参考情報です。実際の受給には審査が必要です。
          </p>
        </div>
      </footer>

    </div>
  );
}
