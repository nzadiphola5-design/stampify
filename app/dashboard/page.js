'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [business, setBusiness] = useState(null)
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: businesses } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (businesses && businesses.length > 0) {
      setBusiness(businesses[0])
      
      const { data: cards } = await supabase
        .from('loyalty_cards')
        .select('*')
        .eq('business_id', businesses[0].id)
      
      setClients(cards || [])
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-amber-500 font-bold text-xl">Chargement...</div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Aucun commerce trouvé.</p>
          <a href="/" className="bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold">
            Créer mon commerce
          </a>
        </div>
      </div>
    )
  }

  const actifs = clients.filter(c => 
    business.mode === 'tampons' 
      ? c.current_stamps > 0 
      : c.current_points > 0
  ).length

  return (
    <main className="min-h-screen bg-gray-50">
      
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="text-amber-500 font-bold text-xl">Stampify</div>
        <div className="text-gray-700 font-semibold">{business.name}</div>
        <div className="bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1 rounded-full">
          {business.mode === 'tampons' ? '🎫 Tampons' : '⭐ Points'}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Total clients</p>
            <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Clients actifs</p>
            <p className="text-3xl font-bold text-amber-500">{actifs}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Objectif</p>
            <p className="text-3xl font-bold text-gray-900">{business.goal}</p>
            <p className="text-xs text-gray-400">
              {business.mode === 'tampons' ? 'tampons' : 'points'}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Récompense</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{business.reward_description}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Vos clients</h2>
            <a 
              href="/scan"
              className="bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-amber-600 transition"
            >
              + Scanner un client
            </a>
          </div>

          {clients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">👥</p>
              <p className="text-gray-500 text-sm">Aucun client encore.</p>
              <p className="text-gray-400 text-xs mt-1">
                Partagez votre lien d'inscription pour commencer !
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {clients.map(client => (
                <div key={client.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                      {client.customer_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{client.customer_name}</p>
                      <p className="text-xs text-gray-400">{client.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {business.mode === 'tampons' ? (
                      <div>
                        <p className="font-bold text-amber-500">{client.current_stamps} / {business.goal}</p>
                        <p className="text-xs text-gray-400">tampons</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-amber-500">{client.current_points} pts</p>
                        <p className="text-xs text-gray-400">/ {business.goal} pts</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-sm font-semibold text-amber-800 mb-2">🔗 Lien d'inscription client</p>
          <p className="text-xs text-amber-700 bg-white rounded-xl px-3 py-2 border border-amber-200 font-mono break-all">
            localhost:3000/inscription/{business.id}
          </p>
          <p className="text-xs text-amber-600 mt-2">Partagez ce lien à vos clients pour qu'ils s'inscrivent.</p>
        </div>

      </div>
    </main>
  )
}