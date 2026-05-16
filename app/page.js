'use client'
import { useState } from 'react'
import { supabase } from './lib/supabase'

export default function Home() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: '',
    city: '',
    mode: '',
    goal: 10,
    reward_description: ''
  })

  const types = [
    'Coiffeur / Barbier',
    'Salon d\'esthétique',
    'Épicerie / Dépanneur',
    'Café / Restaurant',
    'Mécanicien / Garage',
    'Boutique',
    'Autre'
  ]

  const handleSubmit = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('businesses')
      .insert([form])
      .select()
    
    if (error) {
      alert('Erreur : ' + error.message)
      setLoading(false)
      return
    }
    
    setStep(4)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        
        {step === 1 && (
          <div>
            <div className="text-amber-500 font-bold text-2xl mb-1">Stampify</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue ! 👋</h1>
            <p className="text-gray-500 mb-8">Créez votre programme de fidélité en 3 étapes.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de votre commerce
                </label>
                <input
                  type="text"
                  placeholder="Ex: Coiffure Bella"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-amber-400"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de commerce
                </label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-amber-400"
                  value={form.type}
                  onChange={e => setForm({...form, type: e.target.value})}
                >
                  <option value="">Choisissez...</option>
                  {types.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  placeholder="Ex: Montréal"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-amber-400"
                  value={form.city}
                  onChange={e => setForm({...form, city: e.target.value})}
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!form.name || !form.type || !form.city}
              className="w-full mt-6 bg-amber-500 text-white font-semibold py-3 rounded-xl disabled:opacity-40 hover:bg-amber-600 transition"
            >
              Continuer →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-amber-500 font-bold text-2xl mb-1">Stampify</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre programme</h1>
            <p className="text-gray-500 mb-8">Comment voulez-vous récompenser vos clients ?</p>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setForm({...form, mode: 'tampons'})}
                className={`w-full text-left border-2 rounded-xl p-4 transition ${
                  form.mode === 'tampons' 
                    ? 'border-amber-400 bg-amber-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">🎫 Tampons</div>
                <div className="text-sm text-gray-500 mt-1">1 visite = 1 tampon. Simple et visuel.</div>
                <div className="text-xs text-gray-400 mt-1">Idéal : coiffeur, café, esthétique</div>
              </button>

              <button
                onClick={() => setForm({...form, mode: 'points'})}
                className={`w-full text-left border-2 rounded-xl p-4 transition ${
                  form.mode === 'points' 
                    ? 'border-amber-400 bg-amber-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">⭐ Points</div>
                <div className="text-sm text-gray-500 mt-1">1$ dépensé = 10 points. Idéal si montants variés.</div>
                <div className="text-xs text-gray-400 mt-1">Idéal : épicerie, mécanique, boutique</div>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
              >
                ← Retour
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.mode}
                className="flex-1 bg-amber-500 text-white font-semibold py-3 rounded-xl disabled:opacity-40 hover:bg-amber-600 transition"
              >
                Continuer →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-amber-500 font-bold text-2xl mb-1">Stampify</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre récompense</h1>
            <p className="text-gray-500 mb-8">Qu'est-ce que vos clients vont gagner ?</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {form.mode === 'tampons' ? 'Nombre de tampons pour la récompense' : 'Nombre de points pour la récompense'}
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-amber-400"
                  value={form.goal}
                  onChange={e => setForm({...form, goal: parseInt(e.target.value)})}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {form.mode === 'tampons' ? 'Recommandé : 10 tampons' : 'Recommandé : 500 points (1$ = 10 pts)'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description de la récompense
                </label>
                <input
                  type="text"
                  placeholder={form.mode === 'tampons' ? 'Ex: 1 coupe gratuite' : 'Ex: 5$ de rabais'}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-amber-400"
                  value={form.reward_description}
                  onChange={e => setForm({...form, reward_description: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
              >
                ← Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.reward_description || loading}
                className="flex-1 bg-amber-500 text-white font-semibold py-3 rounded-xl disabled:opacity-40 hover:bg-amber-600 transition"
              >
                {loading ? 'Création...' : 'Créer mon programme 🎉'}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <div className="text-amber-500 font-bold text-2xl mb-2">Stampify</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">C'est parti !</h1>
            <p className="text-gray-500 mb-2">
              Votre programme <strong>{form.mode === 'tampons' ? 'Tampons' : 'Points'}</strong> est créé pour
            </p>
            <p className="text-xl font-bold text-amber-500 mb-6">{form.name}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left mb-6">
              <p className="text-sm text-amber-800 font-medium">Votre récompense :</p>
              <p className="text-amber-700 mt-1">
                {form.mode === 'tampons' 
                  ? `Après ${form.goal} tampons → ${form.reward_description}`
                  : `Après ${form.goal} points → ${form.reward_description}`
                }
              </p>
            </div>
            <p className="text-sm text-gray-400">Dashboard commerçant — bientôt disponible</p>
          </div>
        )}

        <div className="flex justify-center gap-2 mt-8">
          {[1,2,3].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${
              step >= i ? 'bg-amber-400 w-8' : 'bg-gray-200 w-4'
            }`} />
          ))}
        </div>

      </div>
    </main>
  )
}