import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

import { CMS } from "@/types"
import { getPages } from "@/lib/actions/cms-action"
import CMSTable from "./cms-table"

import { FileText, Plus } from "lucide-react"

const UserPage = async () => {
  const pages = await getPages()

  return (
    <div className="p-6">

      <Card
        className=" gap-0
        border border-emerald-200
        bg-white
        shadow-sm
        dark:bg-emerald-950/40
        dark:border-emerald-800
        "
      >
 
        <CardHeader className="flex flex-row items-center justify-between border-b border-emerald-100 dark:border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-emerald-100 dark:bg-emerald-900">
              <FileText className="text-emerald-700 dark:text-emerald-300" size={18} />
            </div>
            <div>
              <CardTitle className="text-lg text-emerald-900 dark:text-emerald-100">
                Pages
              </CardTitle>
              
            </div>
          </div>
          <Button
            className="
            bg-emerald-600
            hover:bg-emerald-700
            text-white
            flex items-center gap-2
            "
          >
            <Plus size={16} />
            <Link href="cms/create">Add Page</Link>
          </Button>
        </CardHeader>

        <CardContent className="p-0">

          <div className="w-full overflow-x-auto">
            <CMSTable data={pages as CMS[]} />
          </div>

        </CardContent>

      </Card>

    </div>
  )
}

export default UserPage