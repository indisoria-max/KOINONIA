'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  id: string
  first_name: string
  last_name: string
  city: string
  bio: string
  avatar_url: string
}

export default function BuscarPage() {
  const [city, setCity] = useState('')
  const [results, setResults] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const buscar = async () => {
      setLoading(true)
      const supabase = createClient()
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'anfitrion')

      if (city) {
        query = query.ilike('city', `%${city}%`)
      }

      const { data } = await query
      setResults(data || [])
      setLoading(false)
    }

    buscar()
  }, [city])

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4">🔍 Buscar anfitriones</h1>

      <input
        type="text"
        placeholder="🏙️ Buscar por ciudad..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full border border-gray-200 rounded-2xl p-3 mb-6 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {loading && (
        <p className="text-center text-gray-400 mt-8">Buscando...</p>
      )}

      <div className="flex flex-col gap-4">
        {results.map((profile) => (
          <div key={profile.id} className="bg-white rounded-2xl shadow p-4 flex gap-4 items-center">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="foto"
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl flex-shrink-0">
                👤
              </div>
            )}
            <div>
              <p className="font-bold text-gray-800">
                {profile.first_name} {profile.last_name}
              </p>
              <p className="text-sm text-gray-500">📍 {profile.city}</p>
              <p className="text-sm text-gray-400 line-clamp-2 mt-1">{profile.bio}</p>
            </div>
          </div>
        ))}

        {!loading && results.length === 0 && (
          <p className="text-center text-gray-400 mt-8">
            No se encontraron anfitriones 😔
          </p>
        )}
      </div>
    </div>
  )
}