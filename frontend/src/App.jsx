import React, { useState } from 'react'
import Home       from './pages/Home.jsx'
import ChatPage   from './pages/ChatPage.jsx'
import ResultPage from './pages/ResultPage.jsx'

export default function App() {
  const [page, setPage]     = useState('home')  
  const [result, setResult] = useState(null)

  const goToChat   = ()       => setPage('chat')
  const goToResult = (data)   => { setResult(data); setPage('result') }
  const goToHome   = ()       => { setPage('home'); setResult(null) }
  const goBackChat = ()       => setPage('chat')

  if (page === 'result') return <ResultPage data={result} onBack={goBackChat} onHome={goToHome} />
  if (page === 'chat')   return <ChatPage   onResult={goToResult} onHome={goToHome} />
  return                        <Home       onStart={goToChat} />
}