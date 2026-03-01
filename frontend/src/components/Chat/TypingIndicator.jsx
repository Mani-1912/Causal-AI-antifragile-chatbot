import React from 'react'

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 bubble-enter">
      <div className="w-8 h-8 rounded-full bg-[#0077B6] flex items-center justify-center text-sm shrink-0">
        🌿
      </div>
      <div className="glass px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  )
}
