import React from 'react'

const FEATURES = [
  { icon: '', title: 'Causal AI',        desc: 'XGBoost + causal strength analysis — not just pattern matching' },
  { icon: '', title: 'Natural Chat',     desc: 'LLaMA3-powered conversations that feel warm and human' },
  { icon: '', title: 'Full Advice',      desc: 'Medicines, diet, remedies and exercises per diagnosis' },
  { icon: '', title: 'Find Hospitals',   desc: 'Nearby hospitals via OpenStreetMap — no API key needed' },
  { icon: '', title: 'Self-Learning',    desc: 'Antifragile feedback loop — gets better from corrections' },
  { icon: '', title: '41 Diseases',     desc: '132 symptoms mapped with 100% XGBoost test accuracy' },
]

export default function Home({ onStart }) {
  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-[#0077B6]/30">
        <div className="flex items-center gap-2">
          <span className="text-2xl"></span>
          <span className="text-xl font-bold text-[#00B4D8]">Arogya</span>
        </div>
        <span className="text-sm text-[#90E0EF] glass px-3 py-1 rounded-full">
          AI Health Companion
        </span>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-8">
        <div className="animate-fade-in">
          <div className="text-7xl mb-4">🌿</div>
          <h1 className="text-5xl font-bold mb-3">
            Meet <span className="text-[#00B4D8]">Arogya</span>
          </h1>
          <p className="text-xl text-[#90E0EF] max-w-xl mx-auto leading-relaxed">
            Your intelligent AI health companion. Describe your symptoms naturally —
            Arogya listens, understands, and guides you.
          </p>
        </div>

        <button
          onClick={onStart}
          className="bg-[#00B4D8] hover:bg-[#0077B6] text-white font-semibold
                     px-10 py-4 rounded-2xl text-lg transition-all duration-200
                     shadow-lg shadow-[#00B4D8]/25 hover:shadow-[#00B4D8]/40
                     hover:scale-105 active:scale-95"
        >
          Start Consultation 
        </button>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl w-full mt-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass rounded-xl p-4 text-left hover:border-[#00B4D8]/40 transition-all">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="font-semibold text-[#00B4D8] mb-1">{f.title}</div>
              <div className="text-sm text-[#8EAAB9]">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <footer className="text-center py-4 text-[#8EAAB9] text-sm border-t border-[#0077B6]/20">
        ⚕️ For educational purposes only. Always consult a licensed doctor.
      </footer>
    </div>
  )
}
