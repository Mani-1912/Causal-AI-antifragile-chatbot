import React from 'react'

export default function MessageBubble({ role, content }) {
  const isUser = role === 'user'

  return (
    <div className={`flex bubble-enter ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#0077B6] flex items-center justify-center
                        text-sm shrink-0 mr-2 mt-1">
          🌿
        </div>
      )}

      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-[#0077B6] text-white rounded-br-sm'
            : 'glass text-[#E8F4F8] rounded-bl-sm'
        }`}
      >
        {content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
          part.startsWith('**') ? (
            <strong key={i} className="font-semibold text-[#00B4D8]">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-[#1B2A3B] flex items-center justify-center
                        text-sm shrink-0 ml-2 mt-1 border border-[#00B4D8]/30">
          👤
        </div>
      )}
    </div>
  )
}
