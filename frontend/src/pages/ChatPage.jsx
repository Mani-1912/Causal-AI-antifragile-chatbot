import React, { useEffect, useRef } from 'react'
import ChatWindow   from '../components/Chat/ChatWindow.jsx'
import Navbar       from '../components/Common/Navbar.jsx'
import useChatStore from '../store/chatStore.js'
import { startChat } from '../services/api.js'

export default function ChatPage({ onResult, onHome }) {
  const { addMessage, setSessionId, setState, reset } = useChatStore()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    reset()
    startChat()
      .then(res => {
        const d = res.data.data
        setSessionId(d.session_id)
        addMessage('assistant', d.message)
        setState('CHATTING')
      })
      .catch(() => {
        addMessage('assistant', "Hello! I'm Arogya 🌿 Tell me how you're feeling today.")
        setState('CHATTING')
      })
  }, [])

  return (
    <div className="h-screen bg-[#0D1B2A] flex flex-col">
      <Navbar onHome={onHome} title="Chat with Arogya" />
      <div className="flex-1 overflow-hidden">
        <ChatWindow onResult={onResult} />
      </div>
    </div>
  )
}
