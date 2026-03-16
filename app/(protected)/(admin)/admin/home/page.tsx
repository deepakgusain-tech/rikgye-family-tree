import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/actions/user-action"
import { prisma } from "@/lib/db/prisma-helper"
import { Users } from "lucide-react"
import React from "react"

import FamilyMembers from "./family-member"
const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

const page = async () => {
  const currentUser = await getCurrentUser()

  let members: any = [];

  if (currentUser?.data) {
    members = await prisma.familyMember.findMany({
      where: {
        userId: currentUser.data.id
      }
    })
  }

  return (
    <section className="min-h-screen">

      <div className="w-full h-1"></div>

      <div className="max-w-6xl mx-auto p-8">

        <div className="flex items-center gap-3 mb-10 text-green-800">
          <Users size={20} className="text-emerald-600" />
          <span className="font-bold text-xl tracking-wide">
            Family Hierarchy Builder
          </span>
          <span className="flex-1 h-[1px] bg-green-200"></span>
        </div>

        <div className="grid md:grid-cols-2 gap-16 w-full">

          <div className="flex flex-col justify-center space-y-6">

            <h2 className="text-emerald-600 font-semibold tracking-wide uppercase">
              Building Family Tree
            </h2>

            <h1 className="text-4xl md:text-5xl font-bold text-green-900 leading-tight">
              Who are they?
            </h1>

            <p className="text-green-800/80 text-lg leading-relaxed">
              Make your family tree live with{" "}
              <span className="font-semibold text-emerald-700">
                Rikhye Family Tree
              </span>.
              Do not leave it as just a memory hanging. Build it together with
              your family and let your history grow like a tree that stretches
              into infinity.
            </p>

            <div className="flex items-center gap-3 text-green-600">
              <span className="h-[2px] w-16 bg-green-400 rounded"></span>
              <Users size={18} />
              <span className="h-[2px] w-16 bg-green-400 rounded"></span>
            </div>

          </div>

          <Card className="backdrop-blur-md bg-white/70 border-green-200 shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300">

            <CardHeader className="space-y-1">
              <h2 className="text-2xl font-semibold text-green-900 flex items-center gap-2">
                <Users size={20} className="text-emerald-600" />
                My Family Tree
              </h2>

              <p className="text-green-700/80">
                List of the trees you manage
              </p>
            </CardHeader>

            <CardContent className="border-t border-green-200 mt-4 pt-6 text-center">

              <div className="flex flex-col items-center gap-3 text-green-700">

                {
                  members ? <FamilyMembers data={members as any} /> :
                    <>
                      <Users size={40} className="text-emerald-600 opacity-80" />

                      <p className="font-medium">No Result Found</p>

                      <p className="text-sm text-green-700/70">
                        Start by creating your first family tree.
                      </p>
                    </>
                }

              </div>

            </CardContent>

          </Card>

        </div>
      </div>
    </section>
  )
}

export default page