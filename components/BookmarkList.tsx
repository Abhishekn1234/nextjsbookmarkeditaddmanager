"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/superbase"
import { toast } from "react-toastify"

const PAGE_SIZE = 5

export default function BookmarkList({ user }: any) {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editUrl, setEditUrl] = useState("")
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const fetchBookmarks = async (currentPage = page) => {
    const from = (currentPage - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, count, error } = await supabase
      .from("bookmarks")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) {
      toast.error(error.message)
      return
    }

    setBookmarks(data || [])
    setTotalCount(count || 0)
  }

  useEffect(() => {
    fetchBookmarks(page)
  }, [user.id, page])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id)

    setBookmarks((prev) => prev.filter((b) => b.id !== id))
    setTotalCount((prev) => prev - 1)

    toast.success("Deleted successfully")
  }

  const startEdit = (bookmark: any) => {
    setEditingId(bookmark.id)
    setEditTitle(bookmark.title)
    setEditUrl(bookmark.url)
  }

  const saveEdit = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .update({ title: editTitle, url: editUrl })
      .eq("id", id)

    if (error) return toast.error(error.message)

    setBookmarks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, title: editTitle, url: editUrl } : b
      )
    )

    setEditingId(null)
    toast.success("Updated successfully")
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
     
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">URL</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookmarks.map((b) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  {editingId === b.id ? (
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    b.title
                  )}
                </td>

                <td className="px-6 py-4">
                  {editingId === b.id ? (
                    <input
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <a
                      href={b.url}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {b.url}
                    </a>
                  )}
                </td>

                <td className="px-6 py-4 text-center space-x-2">
                  {editingId === b.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(b.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(b)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteBookmark(b.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookmarks.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No bookmarks yet
          </div>
        )}
      </div>

   
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-3 py-1 rounded border ${
              page === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
          >
            Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "border hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-3 py-1 rounded border ${
              page === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
