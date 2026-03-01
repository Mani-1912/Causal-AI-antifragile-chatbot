import React from 'react'

export default function MedicineCard({ medicines = [] }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-[#00B4D8] font-semibold mb-1">💊 Common Medicines</h3>
      <p className="text-xs text-[#8EAAB9] mb-4">
        These are general OTC options. Always consult a doctor before taking any medication.
      </p>
      {medicines.length === 0 ? (
        <p className="text-[#8EAAB9] text-sm">No medicine info available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {medicines.map((m, i) => (
            <div key={i} className="flex gap-3 bg-[#1B2A3B] rounded-xl p-3 border border-[#0077B6]/20">
              <span className="text-[#00B4D8] shrink-0">💊</span>
              <p className="text-sm text-[#E8F4F8]">{m}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-3">
        <p className="text-yellow-300 text-xs">
          ⚠️ Disclaimer: This is not a prescription. Always verify with a licensed pharmacist or doctor.
        </p>
      </div>
    </div>
  )
}
