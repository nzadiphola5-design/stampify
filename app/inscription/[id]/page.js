'use client'
import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Inscription({ params: paramsPromise }) {
  const params = React.use(paramsPromise)
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    customer_name: '',
    phone: ''
  })

  useEffect(() => {
    loadBusiness()
  }, [])

  const loadBusiness = async () => {
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', params.id)
      .single()
    
    setBusiness(data)
    setLoading(false)
  }

  const handleSubmit = async () => {
    setSubmitting(true)

    const { error } = await supabase
      .from('loyalty_cards')
      .insert([{
        business_id: params.id,
        customer_name: form.customer_name,
        phone: form.phone,
        current_stamps: 0,
        current_points: 0
      }])

    if (error) {
      alert('Erreur : ' + error.message)
      setSubmitting(false)
      return
    }

    setStep(2)
    setSubmitting(false)
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
        <p className="text-gray-500">Commerce introuvable.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">

        {step === 1 && (
          <div>
            <div className="text-amber-500 font-bold text-2xl mb-1">Stampify</div>
            <div className="bg-amber-50 rounded-xl p-4 mb-6 text-center">
              <p className="text-sm text-amber-700 font-medium">Programme de fidélité</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{business.name}</p>
              <p className="text-sm text-gray-500 mt-2">
                {business.mode === 'tampons'
                  ? `${business.goal} tampons = ${business.reward_description}`
                  : `${business.goal} points = ${business.reward_description}`
                }
              </p>
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-6">
              Rejoignez le programme ! 🎉
            </h1>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre prénom
                </label>
                <input
                  type="text"
                  placeholder="Ex: Marie"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-amber-400"
                  value={form.customer_name}
                  onChange={e => setForm({...form, customer_name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre numéro de téléphone
                </label>
                <input
                  type="tel"
                  placeholder="Ex: 514-555-1234"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-amber-400"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!form.customer_name || !form.phone || submitting}
              className="w-full mt-6 bg-amber-500 text-white font-semibold py-3 rounded-xl disabled:opacity-40 hover:bg-amber-600 transition"
            >
              {submitting ? 'Inscription...' : 'Rejoindre le programme →'}
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              Vos informations sont confidentielles et ne seront jamais partagées.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <div className="text-amber-500 font-bold text-2xl mb-2">Stampify</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Bienvenue, {form.customer_name} !
            </h1>
            <p className="text-gray-500 mb-2">
              Vous êtes inscrit au programme de fidélité de
            </p>
            <p className="text-xl font-bold text-amber-500 mb-6">{business.name}</p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800 font-medium mb-3">Votre objectif :</p>
              {business.mode === 'tampons' ? (
                <div className="flex gap-2 flex-wrap justify-center">
                  {Array.from({length: business.goal}).map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-dashed border-amber-300 bg-white" />
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-bold text-amber-500">0 / {business.goal} pts</p>
                  <div className="bg-amber-200 rounded-full h-2 mt-2">
                    <div className="bg-amber-500 rounded-full h-2 w-0" />
                  </div>
                </div>
              )}
              <p className="text-xs text-amber-700 mt-3">
                {business.mode === 'tampons'
                  ? `Complétez ${business.goal} tampons pour : ${business.reward_description}`
                  : `Accumulez ${business.goal} points pour : ${business.reward_description}`
                }
              </p>
            </div>

            <p className="text-sm text-gray-400">
              Montrez cette page à la caisse pour recevoir vos tampons !
            </p>
          </div>
        )}

      </div>
    </main>
  )
}