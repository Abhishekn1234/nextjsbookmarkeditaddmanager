"use client"

import { useState } from "react"
import { supabase } from "@/lib/superbase"
import { toast } from "react-toastify"

interface Props {
  user: any
  onClose: () => void
  onAdded: () => void
}

export default function AddBookmarkModal({ user, onClose, onAdded }: Props) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const addBookmark = async () => {
    if (!title || !url) return toast.error("Fill both fields")
    setLoading(true)

    const { error } = await supabase.from("bookmarks").insert([
      { title, url, user_id: user.id }
    ])
    setLoading(false)

    if (error) return toast.error(error.message)
    toast.success("Bookmark added!")
    setTitle("")
    setUrl("")
    onAdded()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Add Bookmark</h2>
        <input
          className="w-full border rounded p-2 mb-3"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full border rounded p-2 mb-3"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={addBookmark}
          className={`w-full py-2 rounded text-white bg-blue-600 hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Bookmark"}
        </button>
      </div>
    </div>
  )
}
