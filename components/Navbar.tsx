"use client"

import { supabase } from "@/lib/superbase"
import { useRouter } from "next/navigation"

export default function Navbar({ user }: any) {
  const router = useRouter()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">Bookmark Manager</h1>

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm">
            Hello, {user.user_metadata?.full_name || user.email}
          </span>
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
