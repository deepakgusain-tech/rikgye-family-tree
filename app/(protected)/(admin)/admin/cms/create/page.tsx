import CMSForm from '@/components/cms/cms-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'

const CMSCreatePage = async () => {


    return (
        <Card>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <h1>Add Page</h1>
                    <Button variant="default" className='bg-blue-500 hover:bg-blue-600'>
                        <Link href="/admin/cms">Back</Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <CMSForm update={false} />
            </CardContent>
        </Card>
    )
}

export default CMSCreatePage