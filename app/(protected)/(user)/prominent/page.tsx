"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

type Member = {
  id: string
  name: string
  role: string
  bio: string
  image: string
}

const ITEMS_PER_PAGE = 3

const ProminentPage = () => {

  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const router = useRouter()

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/member")
      const data = await res.json()
      setMembers(data)
    } catch (error) {
      console.error("Error fetching members")
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(members.length / ITEMS_PER_PAGE)

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  const currentMembers = members.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen text-neutral-900">
 
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10">

        <div className="flex items-center justify-between mb-8">

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-emerald-900">
            The Family Archive
          </h1>

          <button
            onClick={() => router.push("/add-member")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-md text-sm font-medium transition"
          >
            + Add Member
          </button>

        </div>

        <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">
          A curated collection celebrating achievements, leadership, and legacy
          across generations.
        </p>

      </section>
 
      <section className="max-w-6xl mx-auto px-6 pb-16">

        {loading ? (

          <p className="text-center text-neutral-500">
            Loading members...
          </p>

        ) : members.length === 0 ? (

          <div className="text-center text-neutral-500">
            No members added yet.
          </div>

        ) : (

          <>
            <div className="grid md:grid-cols-3 gap-8">
              {currentMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="group rounded-lg border border-emerald-100 bg-white hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div>
                    <div className="relative w-full h-[320px] overflow-hidden rounded-t-lg">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-emerald-900">
                        {member.name}
                      </h3>
                      <p className="text-sm text-emerald-600 mt-1">
                        {member.role}
                      </p>
                      <p className="text-sm text-neutral-600 mt-3 whitespace-pre-line">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 flex justify-end">

                    <span className="bg-emerald-600 text-white text-xs px-4 py-1 rounded-full font-medium">
                      #{String(startIndex + index + 1).padStart(2, "0")}
                    </span>

                  </div>

                </div>

              ))}

            </div>
            <div className="flex justify-center items-center gap-3 mt-12">

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md border border-emerald-200 text-sm disabled:opacity-40 hover:bg-emerald-50 transition"
              >
                Prev
              </button>


              {Array.from({ length: totalPages }, (_, i) => (

                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-md border text-sm transition ${
                    currentPage === i + 1
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-emerald-200 hover:bg-emerald-50"
                  }`}
                >
                  {i + 1}
                </button>

              ))}


              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md border border-emerald-200 text-sm disabled:opacity-40 hover:bg-emerald-50 transition"
              >
                Next
              </button>

            </div>

          </>
        )}

      </section>

    </div>
  )
}

export default ProminentPage