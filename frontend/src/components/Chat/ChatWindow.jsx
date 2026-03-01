import React, { useState, useRef, useEffect } from 'react'
import MessageBubble  from './MessageBubble.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import useChatStore   from '../../store/chatStore.js'
import { sendMessage } from '../../services/api.js'

const QUICK_REPLIES = [
  "I have fever and headache",
  "Cough and cold",
  "Stomach pain and nausea",
  "Feeling very tired and weak",
]

export default function ChatWindow({ onResult }) {
  const [input, setInput]       = useState('')
  const bottomRef               = useRef(null)
  const textareaRef             = useRef(null)

  const {
    sessionId, messages, isTyping,
    addMessage, setTyping, setResult, incrementProgress,
  } = useChatStore()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const send = async (text) => {
    const msg = (text || input).trim()
    if (!msg) return

    setInput('')
    addMessage('user', msg)
    setTyping(true)
    incrementProgress()

    try {
      const res  = await sendMessage(sessionId, msg)
      const data = res.data.data

      setTyping(false)
      addMessage('assistant', data.message)

      if (data.state === 'RESULT' && data.payload) {
        setTimeout(() => onResult(data.payload), 800)
      }
    } catch {
      setTyping(false)
      addMessage('assistant', "I had trouble connecting. Please check that the backend is running and try again. 🙏")
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto px-4">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-2">
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} content={m.content} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies — shown only at start */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 pb-2">
          {QUICK_REPLIES.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="text-sm glass text-[#90E0EF] px-3 py-1.5 rounded-full
                         hover:border-[#00B4D8]/60 hover:text-[#00B4D8] transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="pb-4">
        <div className="glass rounded-2xl flex items-end gap-3 p-3">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
            onKeyDown={handleKey}
            placeholder="Describe how you're feeling…"
            className="flex-1 bg-transparent text-white placeholder-[#8EAAB9] resize-none
                       outline-none text-sm leading-relaxed max-h-32"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || isTyping}
            className="bg-[#00B4D8] hover:bg-[#0077B6] disabled:opacity-40
                       text-white rounded-xl p-2.5 transition-all shrink-0"
          >
            <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-[#8EAAB9] mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
