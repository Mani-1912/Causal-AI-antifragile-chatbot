import React, { useState } from 'react'
import { searchHospitals } from '../../services/api.js'

export default function HospitalMap({ disease }) {
  const [hospitals, setHospitals] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [city,      setCity]      = useState('')
  const [searched,  setSearched]  = useState(false)

  const searchByGPS = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser.')
      return
    }
    setLoading(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await searchHospitals({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            disease,
          })
          setHospitals(res.data.data.hospitals || [])
          setSearched(true)
        } catch {
          setError('Could not fetch hospitals. Try city name instead.')
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError('Location access denied. Please enter your city name.')
        setLoading(false)
      }
    )
  }

  const searchByCity = async () => {
    if (!city.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await searchHospitals({ location: city.trim(), disease })
      setHospitals(res.data.data.hospitals || [])
      setSearched(true)
    } catch {
      setError('City not found or no hospitals nearby.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-[#00B4D8] font-semibold mb-2">🏥 Nearby Hospitals</h3>
      <p className="text-[#8EAAB9] text-sm mb-4">
        Find clinics and hospitals near you (powered by OpenStreetMap).
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <button
          onClick={searchByGPS}
          disabled={loading}
          className="flex items-center gap-2 bg-[#0077B6] hover:bg-[#005f8e] text-white
                     text-sm px-4 py-2.5 rounded-xl transition-all disabled:opacity-50"
        >
          📍 Use My Location
        </button>
        <div className="flex gap-2 flex-1">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchByCity()}
            placeholder="Enter city name…"
            className="flex-1 bg-[#1B2A3B] border border-[#0077B6]/30 text-white text-sm
                       rounded-xl px-4 py-2.5 outline-none focus:border-[#00B4D8] transition-all"
          />
          <button
            onClick={searchByCity}
            disabled={!city.trim() || loading}
            className="bg-[#00B4D8] hover:bg-[#0077B6] text-white text-sm px-4 py-2.5
                       rounded-xl transition-all disabled:opacity-50"
          >
            Search
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-[#8EAAB9] text-sm py-8 justify-center">
          <div className="w-5 h-5 border-2 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
          Searching nearby hospitals…
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {searched && !loading && hospitals.length === 0 && (
        <p className="text-[#8EAAB9] text-sm text-center py-6">
          No hospitals found within 5 km. Try a different city name.
        </p>
      )}

      {hospitals.length > 0 && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {hospitals.map((h, i) => (
            <div key={i} className="bg-[#1B2A3B] rounded-xl p-4 flex justify-between items-start gap-3">
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{h.name}</p>
                {h.address && <p className="text-[#8EAAB9] text-xs mt-1">{h.address}</p>}
                {h.phone   && <p className="text-[#00B4D8] text-xs mt-1">📞 {h.phone}</p>}
                <span className="text-xs text-[#8EAAB9] capitalize">{h.type}</span>
              </div>
              <div className="shrink-0 glass rounded-lg px-3 py-1.5 text-center">
                <p className="text-[#00B4D8] font-bold text-sm">{h.distance} km</p>
                <p className="text-[#8EAAB9] text-xs">away</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
