'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Scan() {
  const [business, setBusiness] = useState(null)
  const [clients, setClients] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

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

  const filtered = clients.filter(c =>
    c.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  const handleScan = async () => {
    if (!selected || !business) return

    let updates = {}
    let newStamps = selected.current_stamps
    let newPoints = selected.current_points
    let rewardEarned = false

    if (business.mode === 'tampons') {
      newStamps = selected.current_stamps + 1
      if (newStamps >= business.goal) {
        rewardEarned = true
        newStamps = 0
      }
      updates = { current_stamps: newStamps }
    } else {
      const pts = Math.round(parseFloat(amount) * 10)
      newPoints = selected.current_points + pts
      if (newPoints >= business.goal) {
        rewardEarned = true
        newPoints = newPoints - business.goal
      }
      updates = { current_points: newPoints }
    }

    await supabase
      .from('loyalty_cards')
      .update(updates)
      .eq('id', selected.id)

    await supabase
      .from('transactions')
      .insert([{
        card_id: selected.id,
        business_id: business.id,
        type: rewardEarned ? 'reward' : 'scan',
        stamps_delta: business.mode === 'tampons' ? 1 : 0,
        points_delta: business.mode === 'points' ? Math.round(parseFloat(amount) * 10) : 0,
        amount: parseFloat(amount) || 0
      }])

    setSelected({
      ...selected,
      current_stamps: newStamps,
      current_points: newPoints
    })
    setSuccess(rewardEarned ? 'reward' : 'scan')
    setAmount('')
    loadData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-amber-500 font-bold text-xl">Chargement...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <a href="/dashboard" className="text-amber-500 font-bold text-xl">Stampify</a>
        <div className="text-gray-700 font-semibold">{business?.name}</div>
        <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">← Dashboard</a>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Scanner un client</h1>

        {!selected ? (
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Cherchez le client par nom ou téléphone :
              </p>
              <input
                type="text"
                placeholder="Ex: Marie ou 514-555..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-amber-400"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {search && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {filtered.length === 0 ? (
                  <p className="text-center text-gray-400 py-6 text-sm">Aucun client trouvé</p>
                ) : (
                  filtered.map(client => (
                    <button
                      key={client.id}
                      onClick={() => { setSelected(client); setSuccess(false) }}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-amber-50 border-b border-gray-50 last:border-0 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                          {client.customer_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900 text-sm">{client.customer_name}</p>
                          <p className="text-xs text-gray-400">{client.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-500 text-sm">
                          {business?.mode === 'tampons'
                            ? `${client.current_stamps} / ${business.goal} tampons`
                            : `${client.current_points} pts`
                          }
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            {success === 'reward' && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-4 text-center">
                <p className="text-3xl mb-2">🎁</p>
                <p className="font-bold text-green-800">Récompense gagnée !</p>
                <p className="text-sm text-green-600 mt-1">
                  {selected.customer_name} a gagné : {business.reward_description}
                </p>
              </div>
            )}

            {success === 'scan' && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4 text-center">
                <p className="text-2xl mb-1">✅</p>
                <p className="font-bold text-green-800 text-sm">
                  {business.mode === 'tampons' ? 'Tampon ajouté !' : 'Points ajoutés !'}
                </p>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                  {selected.customer_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selected.customer_name}</p>
                  <p className="text-sm text-gray-400">{selected.phone}</p>
                </div>
              </div>

              {business.mode === 'tampons' ? (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Progression :</p>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({length: business.goal}).map((_, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs ${
                        i < selected.current_stamps
                          ? 'bg-amber-400 border-amber-400 text-white'
                          : 'border-dashed border-gray-300'
                      }`}>
                        {i < selected.current_stamps ? '✓' : ''}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-amber-600 font-medium mt-2">
                    {selected.current_stamps} / {business.goal} tampons
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Points actuels :</p>
                  <p className="text-2xl font-bold text-amber-500">{selected.current_points} pts</p>
                  <div className="bg-gray-100 rounded-full h-2 mt-2">
                    <div
                      className="bg-amber-400 rounded-full h-2 transition-all"
                      style={{width: `${Math.min((selected.current_points / business.goal) * 100, 100)}%`}}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{business.goal} pts = {business.reward_description}</p>
                </div>
              )}

              {business.mode === 'points' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant de la transaction ($)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 25.00"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-amber-400"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                  {amount && (
                    <p className="text-xs text-amber-600 mt-1">
                      = {Math.round(parseFloat(amount) * 10)} points ajoutés
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={handleScan}
                disabled={business.mode === 'points' && !amount}
                className="w-full bg-amber-500 text-white font-semibold py-3 rounded-xl disabled:opacity-40 hover:bg-amber-600 transition"
              >
                {business.mode === 'tampons' ? '🎫 Ajouter un tampon' : '⭐ Ajouter les points'}
              </button>
            </div>

            <button
              onClick={() => { setSelected(null); setSearch(''); setSuccess(false) }}
              className="w-full border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
            >
              ← Autre client
            </button>
          </div>
        )}
      </div>
    </main>
  )
}