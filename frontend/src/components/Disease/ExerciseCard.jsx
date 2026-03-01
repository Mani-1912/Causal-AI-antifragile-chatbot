import React from 'react'

export default function ExerciseCard({ exercises = [] }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-[#00B4D8] font-semibold mb-4">🏃 Recommended Exercises</h3>
      {exercises.length === 0 ? (
        <p className="text-[#8EAAB9] text-sm">No exercise info available.</p>
      ) : (
        <div className="space-y-3">
          {exercises.map((e, i) => (
            <div key={i} className="flex gap-3 bg-[#1B2A3B] rounded-xl p-4">
              <span className="text-[#00B4D8] shrink-0 text-lg"></span>
              <div>
                <p className="text-sm text-[#E8F4F8]">{e}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-[#8EAAB9] mt-4">
        ℹ️ Start slowly and stop if you feel discomfort. Rest is equally important during recovery.
      </p>
    </div>
  )
}
