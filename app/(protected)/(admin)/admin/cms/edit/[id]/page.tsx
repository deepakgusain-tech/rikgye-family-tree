import CMSForm from '@/components/cms/cms-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import UserForm from '@/components/user/user-form'
import { getPageById } from '@/lib/actions/cms-action'
import { getUserById } from '@/lib/actions/user-action'
import { CMS, User } from '@/types'
import Link from 'next/link'

type Props = {
  params: Promise <{ id: string }>
};

const UserEditPage = async ({ params }: Props) => {
  const { id } = await params;

  const res = await getPageById(id)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1>Edit Page</h1>
          <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/cms">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <CMSForm
          data={res.data as CMS}
          update={true}
        />
      </CardContent>
    </Card>
  )
}

export default UserEditPage
  



