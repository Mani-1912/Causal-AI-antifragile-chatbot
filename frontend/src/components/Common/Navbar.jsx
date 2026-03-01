import React from 'react'

export default function Navbar({ title = 'Arogya', onHome, onBack }) {
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b border-[#0077B6]/30 glass shrink-0">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="text-[#8EAAB9] hover:text-white transition-colors p-1"
          >
            ←
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <span className="font-bold text-[#00B4D8] text-lg">Arogya</span>
          {title !== 'Arogya' && (
            <span className="text-[#8EAAB9] text-sm hidden sm:inline">· {title}</span>
          )}
        </div>
      </div>

      {onHome && (
        <button
          onClick={onHome}
          className="text-sm glass text-[#90E0EF] px-4 py-1.5 rounded-full
                     hover:border-[#00B4D8]/50 hover:text-white transition-all"
        >
          Home
        </button>
      )}
    </nav>
  )
}
