"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/superbase"
import { useRouter } from "next/navigation"
import BookmarkList from "@/components/BookmarkList"
import AddBookmarkModal from "@/components/AddBookmark"
import Navbar from "@/components/Navbar"

export default function BookmarksPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        setUser(data.session.user)
      } else {
        router.replace("/login") 
        return
      }

      setLoading(false)

      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (!session) {
            router.replace("/login")
          } else {
            setUser(session.user)
          }
        }
      )

      return () => {
        listener.subscription.unsubscribe()
      }
    }

    init()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Checking session...
      </div>
    )
  }

  if (!user) return null

  return (
    <>
      <Navbar user={user} />

      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Bookmarks</h1>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Add Bookmark
          </button>
        </div>

        <BookmarkList user={user} />
      </div>

      {showModal && (
        <AddBookmarkModal
          user={user}
          onClose={() => setShowModal(false)}
          onAdded={() => setShowModal(false)}
        />
      )}
    </>
  )
}

