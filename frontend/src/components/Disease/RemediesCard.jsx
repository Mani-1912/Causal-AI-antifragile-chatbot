import React from 'react'

export default function RemediesCard({ remedies = [] }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-[#00B4D8] font-semibold mb-4">🌿 Home Remedies</h3>
      {remedies.length === 0 ? (
        <p className="text-[#8EAAB9] text-sm">No remedies available.</p>
      ) : (
        <div className="space-y-3">
          {remedies.map((r, i) => (
            <div key={i} className="flex gap-3 bg-[#1B2A3B] rounded-xl p-4">
              <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center
                              text-green-400 text-sm font-bold shrink-0">
                {i + 1}
              </div>
              <p className="text-sm text-[#E8F4F8] leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
