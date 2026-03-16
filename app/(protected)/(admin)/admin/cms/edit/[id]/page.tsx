import CMSForm from '@/components/cms/cms-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import UserForm from '@/components/user/user-form'
import { getPageById } from '@/lib/actions/cms-action'
import { getUserById } from '@/lib/actions/user-action'
import { CMS, User } from '@/types'
import Link from 'next/link'
import { FileEdit, ArrowLeft } from 'lucide-react'

type Props = {
  params: Promise<{ id: string }>
};

const UserEditPage = async ({ params }: Props) => {
  const { id } = await params;

  const res = await getPageById(id)

  return (
    <div className="p-6">

      <Card
        className="
        border border-emerald-200
        shadow-sm
        bg-white
        dark:bg-emerald-950/40
        dark:border-emerald-800
        "
      >

        <CardHeader className="flex flex-row items-center justify-between border-b border-emerald-100 dark:border-emerald-800">
 
          <div className="flex items-center gap-3">

            <div className="p-2 rounded-md bg-emerald-100 dark:bg-emerald-900">
              <FileEdit size={18} className="text-emerald-700 dark:text-emerald-300" />
            </div>

            <div>
              <CardTitle className="text-lg text-emerald-900 dark:text-emerald-100">
                Edit Page
              </CardTitle>

              <CardDescription>
                Update page information and content
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

          <CMSForm
            data={res.data as CMS}
            update={true}
          />

        </CardContent>

      </Card>

    </div>
  )
}

export default UserEditPage