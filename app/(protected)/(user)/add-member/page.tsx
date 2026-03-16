"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, UserPlus } from "lucide-react"

export default function AddMember() {

  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)

    const res = await fetch("/api/member", {
      method: "POST",
      body: formData,
    })

    if (res.ok) {
      alert("Member Added Successfully!")
      e.target.reset()
      router.push("/prominent")
    } else {
      alert("Error adding member")
    }

    setLoading(false)
  }

  return (

    <div className="max-w-xl mx-auto mt-16 px-6">

      <Card className="border border-emerald-100 shadow-sm">

        <CardHeader>

          <CardTitle className="text-2xl font-semibold text-emerald-900 flex items-center gap-2">
            <UserPlus size={20} />
            Add Family Member
          </CardTitle>

        </CardHeader>


        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-5"> 
            <div className="space-y-2">

              <label className="text-sm font-medium text-emerald-900">
                Full Name
              </label>

              <Input
                type="text"
                name="name"
                placeholder="Enter full name"
                required
                className="focus-visible:ring-emerald-500"
              />

            </div> 

            <div className="space-y-2">

              <label className="text-sm font-medium text-emerald-900">
                Role / Title
              </label>

              <Input
                type="text"
                name="role"
                placeholder="Enter role or title"
                required
                className="focus-visible:ring-emerald-500"
              />

            </div> 

            <div className="space-y-2">

              <label className="text-sm font-medium text-emerald-900">
                Biography
              </label>

              <Textarea
                name="bio"
                placeholder="Write a short biography..."
                rows={4}
                required
                className="focus-visible:ring-emerald-500"
              />

            </div>
 
            <div className="space-y-2">

              <label className="text-sm font-medium text-emerald-900">
                Profile Image
              </label>

              <Input
                type="file"
                name="image"
                accept="image/png, image/jpeg"
                required
                className="cursor-pointer"
              />

            </div> 

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2"
            >

              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Add Member
                </>
              )}

            </Button>

          </form>

        </CardContent>

      </Card>

    </div>

  )
}