'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const signUp = async () => {
    const { error } =
      await supabase.auth.signUp({
        email,
        password,
      })

    if (error) {
      alert(error.message)
      return
    }

    alert(
      'Account created successfully'
    )
  }

  const login = async () => {
    const { error } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      )

    if (error) {
      alert(error.message)
      return
    }

    router.push('/')
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="uppercase tracking-[0.35em] text-white/40 text-sm mb-4">
            PRIVATE MEDIA DELIVERY
          </p>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Provider Access
          </h1>

          <p className="text-white/50 text-lg leading-relaxed">
            Securely manage galleries,
            previews, and protected
            client downloads.
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_80px_rgba(255,255,255,0.03)]">
          <div className="space-y-5">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key ===
                  'Enter'
                ) {
                  const passwordInput =
                    document.getElementById(
                      'password-input'
                    )

                  passwordInput?.focus()
                }
              }}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-lg outline-none focus:border-white/30 focus:bg-white/[0.03] transition"
            />

            <input
              id="password-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key ===
                  'Enter'
                ) {
                  login()
                }
              }}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-lg outline-none focus:border-white/30 focus:bg-white/[0.03] transition"
            />
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={login}
              className="w-full bg-white text-black hover:opacity-90 rounded-2xl py-4 text-lg font-medium hover:scale-[1.01] transition duration-300"
            >
              Login
            </button>

            <button
              onClick={signUp}
              className="w-full border border-white/10 bg-white/[0.02] rounded-2xl py-4 text-lg hover:bg-white/[0.05] transition"
            >
              Create Account
            </button>
          </div>
        </div>

        <p className="text-center text-white/30 text-sm mt-8">
          Built for photographers,
          creators, and premium client
          delivery workflows.
        </p>
      </div>
    </main>
  )
}