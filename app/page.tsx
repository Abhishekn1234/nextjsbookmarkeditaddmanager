"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/superbase"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        setUser(data.session.user)
      }

      setLoading(false)
    }

    checkUser()
  }, [])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/bookmarks",
      },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Checking session...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">

      <nav className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold text-blue-600">
          Bookmark Manager
        </h1>

        {user ? (
          <button
            onClick={() => router.push("/bookmarks")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Login
          </button>
        )}
      </nav>

   
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6">

        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Save & Manage Your
          <span className="text-blue-600"> Bookmarks</span>
        </h2>

        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Organize your favorite links in one place.  
          Secure Google login, edit instantly, pagination, and responsive design.
        </p>

        {user ? (
          <button
            onClick={() => router.push("/bookmarks")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition shadow-lg"
          >
            Open My Bookmarks
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-black text-white px-8 py-3 rounded-lg text-lg hover:bg-gray-800 transition shadow-lg"
          >
            Login with Google
          </button>
        )}

      </main>

  
      <footer className="text-center py-6 text-sm text-gray-500">
        Built with Next.js + Supabase 🚀
      </footer>
    </div>
  )
}
