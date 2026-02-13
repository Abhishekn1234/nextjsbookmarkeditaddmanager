"use client"

import { useState } from "react"
import { supabase } from "@/lib/superbase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const loginWithGoogle = async () => {
    setLoading(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://nextjsbookmarkeditaddmanager.vercel.app/bookmarks",
      },
    })

    if (error) {
      console.log("Login error:", error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
        
      
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back 👋
          </h1>
          <p className="text-gray-500 mt-2">
            Sign in to manage your bookmarks
          </p>
        </div>

       
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            disabled
            className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

  
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            disabled
            className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

    
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

       
        <button
          onClick={loginWithGoogle}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-3 border border-gray-300 py-2.5 rounded-lg shadow-sm transition 
            ${loading 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:bg-gray-50"
            }`}
        >
 
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.68 1.22 9.17 3.61l6.85-6.85C35.64 2.41 30.21 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.19C12.57 13.27 17.83 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.5 24c0-1.57-.14-3.09-.41-4.56H24v9.13h12.7c-.55 2.96-2.21 5.48-4.71 7.19l7.31 5.68C43.9 37.47 46.5 31.27 46.5 24z"
            />
            <path
              fill="#FBBC05"
              d="M10.67 28.63a14.49 14.49 0 0 1 0-9.26l-7.98-6.19A23.95 23.95 0 0 0 0 24c0 3.86.92 7.52 2.69 10.82l7.98-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.21 0 11.64-2.05 15.52-5.56l-7.31-5.68c-2.03 1.36-4.63 2.17-8.21 2.17-6.17 0-11.43-3.77-13.33-9.13l-7.98 6.19C6.73 42.52 14.82 48 24 48z"
            />
          </svg>

          {loading ? "Redirecting..." : "Continue with Google"}
        </button>

       
        <p className="text-center text-xs text-gray-400">
          Email/password login is disabled.  
          Please use Google authentication.
        </p>
      </div>
    </div>
  )
}

