import CMSForm from '@/components/cms/cms-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import { FilePlus, ArrowLeft } from 'lucide-react'

const CMSCreatePage = async () => {

  return (
    <div className="p-6">

      <Card
        className="
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
              <FilePlus size={18} className="text-emerald-700 dark:text-emerald-300" />
            </div>

            <div>
              <CardTitle className="text-lg text-emerald-900 dark:text-emerald-100">
                Add Page
              </CardTitle>

              <CardDescription>
                Create a new website page
              </CardDescription>
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
            <ArrowLeft size={16} />
            <Link href="/admin/cms">Back</Link>
          </Button>

        </CardHeader>

        <CardContent className="p-6">
          <CMSForm update={false} />
        </CardContent>

      </Card>

    </div>
  )
}

export default CMSCreatePage