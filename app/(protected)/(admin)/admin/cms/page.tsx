import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'

import { CMS } from '@/types'
import UserTable from './cms-table'
import { getPages } from '@/lib/actions/cms-action'
import CMSTable from './cms-table'

const UserPage = async () => {
    const pages = await getPages();

    return (
        <Card>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <h1>Pages</h1>
                    <Button variant="default" className='bg-blue-500 hover:bg-blue-600'>
                        <Link href="cms/create">Add Page</Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className='w-full'>
                <CMSTable data={pages as CMS[]} />
            </CardContent>
        </Card>
    )
}

export default UserPage