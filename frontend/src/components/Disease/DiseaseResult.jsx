import React, { useState } from 'react'
import RemediesCard  from './RemediesCard.jsx'
import MedicineCard  from './MedicineCard.jsx'
import ExerciseCard  from './ExerciseCard.jsx'
import HospitalMap   from './HospitalMap.jsx'
import { submitFeedback } from '../../services/api.js'

const TABS = [
  { id: 'overview',  label: '📋 Overview' },
  { id: 'remedies',  label: '🌿 Remedies' },
  { id: 'diet',      label: '🥗 Diet' },
  { id: 'medicines', label: '💊 Medicines' },
  { id: 'exercises', label: '🏃 Exercises' },
  { id: 'hospitals', label: '🏥 Hospitals' },
]

const RISK_STYLE = {
  Low:      { bar: 'bg-green-400',  badge: 'text-green-400 border-green-400/40 bg-green-400/10',  dot: '🟢' },
  Moderate: { bar: 'bg-yellow-400', badge: 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10', dot: '🟡' },
  High:     { bar: 'bg-orange-400', badge: 'text-orange-400 border-orange-400/40 bg-orange-400/10', dot: '🟠' },
  Critical: { bar: 'bg-red-400',    badge: 'text-red-400 border-red-400/40 bg-red-400/10',         dot: '🔴' },
}

export default function DiseaseResult({ data }) {
  const [tab,         setTab]         = useState('overview')
  const [correction,  setCorrection]  = useState('')
  const [fbStatus,    setFbStatus]    = useState('idle')  

  if (!data) return null

  const {
    disease, confidence, top3 = [], matched_symptoms = [],
    explanation, description, precautions = [],
    medicines = [], diet = [], exercises = [], home_remedies = [],
    warning, causal = {},
  } = data

  const riskLevel = causal?.risk_level || 'Moderate'
  const riskStyle = RISK_STYLE[riskLevel] || RISK_STYLE.Moderate

  const handleFeedback = async (isCorrect) => {
    setFbStatus('loading')
    try {
      await submitFeedback({
        symptoms:           matched_symptoms,
        predicted_disease:  disease,
        correct:            isCorrect,
        actual_disease:     isCorrect ? null : correction || null,
      })
      setFbStatus('success')
    } catch {
      setFbStatus('error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4 animate-fade-in">

      <div className="glass rounded-2xl p-6">
        <p className="text-[#90E0EF] text-xs tracking-widest uppercase mb-1">Predicted Condition</p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">{disease}</h1>
            {explanation && (
              <p className="text-[#8EAAB9] text-sm leading-relaxed max-w-2xl">{explanation}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="glass rounded-xl px-5 py-3 text-center border border-[#00B4D8]/20">
              <div className="text-3xl font-bold text-[#00B4D8]">{confidence}%</div>
              <div className="text-xs text-[#8EAAB9]">Confidence</div>
            </div>
            <span className={`border rounded-full px-4 py-1 text-sm font-semibold ${riskStyle.badge}`}>
              {riskStyle.dot} {riskLevel} Risk
            </span>
          </div>
        </div>

        <div className="mt-4 h-1.5 bg-[#1B2A3B] rounded-full overflow-hidden">
          <div
            className={`h-full ${riskStyle.bar} rounded-full transition-all duration-1000`}
            style={{ width: `${confidence}%` }}
          />
        </div>

        {matched_symptoms.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {matched_symptoms.map((s) => (
              <span key={s} className="text-xs glass text-[#90E0EF] px-3 py-1 rounded-full border border-[#00B4D8]/20">
                {s.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}

        {top3.length > 1 && (
          <div className="mt-4 pt-4 border-t border-[#0077B6]/20">
            <p className="text-xs text-[#8EAAB9] mb-2">Also considered:</p>
            <div className="flex gap-3 flex-wrap">
              {top3.slice(1).map((d) => (
                <div key={d.disease} className="glass rounded-lg px-3 py-1.5 text-xs flex gap-2">
                  <span className="text-white">{d.disease}</span>
                  <span className="text-[#8EAAB9]">{d.confidence}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

       
        {warning && (
          <div className="mt-4 flex gap-2 bg-red-500/10 border border-red-400/30 rounded-xl p-3">
            <span className="text-red-400 shrink-0">🚨</span>
            <p className="text-red-300 text-sm">{warning}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.id
                ? 'bg-[#00B4D8] text-white shadow-lg shadow-[#00B4D8]/20'
                : 'glass text-[#8EAAB9] hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {tab === 'overview' && (
          <div className="glass rounded-2xl p-6 space-y-5">
            {description && (
              <div>
                <h3 className="text-[#00B4D8] font-semibold mb-2">About this condition</h3>
                <p className="text-[#8EAAB9] text-sm leading-relaxed">{description}</p>
              </div>
            )}
            {precautions.length > 0 && (
              <div>
                <h3 className="text-[#00B4D8] font-semibold mb-3">Precautions</h3>
                <ul className="space-y-2">
                  {precautions.map((p, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[#E8F4F8]">
                      <span className="text-[#00B4D8] shrink-0 mt-0.5">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {causal?.causal_analysis?.length > 0 && (
              <div>
                <h3 className="text-[#00B4D8] font-semibold mb-3">Causal Analysis</h3>
                <div className="space-y-2">
                  {causal.causal_analysis.map((c, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#1B2A3B] rounded-lg px-3 py-2">
                      <span className="text-sm text-white">{c.symptom}</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium ${
                          c.causal_strength === 'High'   ? 'text-red-400'    :
                          c.causal_strength === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                        }`}>{c.causal_strength}</span>
                        <div className="w-20 h-1.5 bg-[#0D1B2A] rounded-full overflow-hidden">
                          <div className="h-full bg-[#00B4D8] rounded-full"
                               style={{ width: `${(c.severity / 7) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'remedies'  && <RemediesCard remedies={home_remedies} />}
        {tab === 'medicines' && <MedicineCard medicines={medicines} />}
        {tab === 'exercises' && <ExerciseCard exercises={exercises} />}

        {tab === 'diet' && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-[#00B4D8] font-semibold mb-4">🥗 Dietary Recommendations</h3>
            {diet.length === 0 ? (
              <p className="text-[#8EAAB9] text-sm">No diet info available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {diet.map((d, i) => (
                  <div key={i} className="flex gap-3 bg-[#1B2A3B] rounded-xl p-3">
                    <span className="text-green-400 shrink-0">🥦</span>
                    <p className="text-sm text-[#E8F4F8]">{d}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'hospitals' && <HospitalMap disease={disease} />}
      </div>

      <div className="glass rounded-2xl p-4 border border-[#0077B6]/30">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🔄</span>
          <h3 className="text-[#00B4D8] font-semibold text-sm">Antifragility Feedback</h3>
          <span className="text-xs text-[#8EAAB9]">— Help Arogya learn and improve</span>
        </div>

        {fbStatus === 'success' ? (
          <div className="flex items-center gap-2 bg-green-500/15 border border-green-400/30 rounded-xl p-3">
            <span className="text-green-400 text-lg">✅</span>
            <div>
              <p className="text-green-400 font-medium text-sm">Thank you! Feedback logged.</p>
              <p className="text-[#8EAAB9] text-xs mt-0.5">Arogya will retrain after 10 corrections to improve accuracy.</p>
            </div>
          </div>
        ) : fbStatus === 'error' ? (
          <p className="text-red-400 text-sm">Could not save feedback. Please try again.</p>
        ) : (
          <>
            <p className="text-[#8EAAB9] text-xs mb-3">Was this prediction correct?</p>
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => handleFeedback(true)}
                disabled={fbStatus === 'loading'}
                className="flex items-center gap-2 bg-green-500/20 border border-green-400/40
                           text-green-400 text-sm px-4 py-2 rounded-xl hover:bg-green-500/30
                           transition-all disabled:opacity-50"
              >
                👍 Yes, Correct!
              </button>

              <div className="flex gap-2 flex-1 min-w-[200px]">
                <input
                  value={correction}
                  onChange={(e) => setCorrection(e.target.value)}
                  placeholder="Actual disease (optional)…"
                  className="flex-1 bg-[#1B2A3B] border border-[#0077B6]/30 text-white text-sm
                             rounded-xl px-3 py-2 outline-none focus:border-[#00B4D8] transition-all"
                />
                <button
                  onClick={() => handleFeedback(false)}
                  disabled={fbStatus === 'loading'}
                  className="flex items-center gap-2 bg-red-500/20 border border-red-400/40
                             text-red-400 text-sm px-4 py-2 rounded-xl hover:bg-red-500/30
                             transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {fbStatus === 'loading' ? '⏳' : '👎'} Wrong
                </button>
              </div>
            </div>
            <p className="text-xs text-[#8EAAB9] mt-2">
              💡 Every wrong prediction logged triggers automatic XGBoost retraining after 10 corrections.
            </p>
          </>
        )}
      </div>

      <p className="text-center text-xs text-[#8EAAB9] pb-4">
        ⚕️ For informational purposes only. Always consult a licensed medical professional.
      </p>
    </div>
  )
}
