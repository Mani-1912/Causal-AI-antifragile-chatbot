import { create } from 'zustand'

const useChatStore = create((set, get) => ({
  sessionId:  null,
  messages:   [],      
  state:      'IDLE',   
  result:     null,     
  progress:   0,        
  isTyping:   false,

  setSessionId: (id) => set({ sessionId: id }),

  addMessage: (role, content) => set((s) => ({
    messages: [...s.messages, { role, content, id: Date.now() }],
  })),

  setTyping: (v) => set({ isTyping: v }),

  setState: (state) => set({ state }),

  setResult: (payload) => set({ result: payload, state: 'RESULT', progress: 100 }),

  incrementProgress: () => set((s) => ({
    progress: Math.min(s.progress + 15, 90),
  })),

  reset: () => set({
    sessionId: null,
    messages:  [],
    state:     'IDLE',
    result:    null,
    progress:  0,
    isTyping:  false,
  }),
}))

export default useChatStore
