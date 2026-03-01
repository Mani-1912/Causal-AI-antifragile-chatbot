import React from 'react'
import DiseaseResult from '../components/Disease/DiseaseResult.jsx'
import Navbar        from '../components/Common/Navbar.jsx'

export default function ResultPage({ data, onBack, onHome }) {
  return (
    <div className="h-screen bg-[#0D1B2A] flex flex-col">
      <Navbar onHome={onHome} onBack={onBack} title="Your Results" />
      <div className="flex-1 overflow-auto">
        <DiseaseResult data={data} />
      </div>
    </div>
  )
}
