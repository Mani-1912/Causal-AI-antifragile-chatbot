import React from 'react'

export default function Loader({ text = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-[#1B2A3B]" />
        <div className="absolute inset-0 rounded-full border-4 border-t-[#00B4D8] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-xl">🌿</div>
      </div>
      <p className="text-[#8EAAB9] text-sm">{text}</p>
    </div>
  )
}
