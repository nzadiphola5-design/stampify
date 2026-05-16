'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password
      })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      window.location.href = '/onboarding'
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      })
      if (error) {
        setError('Email ou mot de passe incorrect')
        setLoading(false)
        return
      }
      window.location.href = '/dashboard'
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        
        <div className="text-amber-500 font-bold text-2xl mb-1">Stampify</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isSignUp ? 'Créer un compte' : 'Bienvenue !'}
        </h1>
        <p className="text-gray-500 mb-8">
          {isSignUp ? 'Commencez à fidéliser vos clients.' : 'Connectez-vous à votre compte.'}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="votre@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-amber-400"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-amber-400"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!form.email || !form.password || loading}
          className="w-full mt-6 bg-amber-500 text-white font-semibold py-3 rounded-xl disabled:opacity-40 hover:bg-amber-600 transition"
        >
          {loading ? 'Chargement...' : isSignUp ? 'Créer mon compte →' : 'Se connecter →'}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
          {' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError('') }}
            className="text-amber-500 font-semibold hover:underline"
          >
            {isSignUp ? 'Se connecter' : 'Créer un compte'}
          </button>
        </p>

      </div>
    </main>
  )
}