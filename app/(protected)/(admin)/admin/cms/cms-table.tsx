"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { deleteUser, getUsers } from '@/lib/actions/user-action';
import { CMS, User } from '@/types'
import { EditIcon, Trash } from 'lucide-react';
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner';
import ClientDate from '@/components/ui/client-date';
import { deletePage, getPages } from '@/lib/actions/cms-action';

const CMSTable = ({ data }: { data: CMS[] }) => {

  const [pages, setPages] = useState<CMS[]>(data)

  const deletePageHandler = async (id: any) => {
    let res = await deletePage(id);

    if (!res?.success) {
      toast.error("Error", {
        description: res?.message
      })
    } else {
      toast.success("Success", {
        description: res?.message
      })

      const response = await getPages()
      setPages(response as CMS[])
    }
  }

  return (
    <Table className='w-full'>
      <TableHeader>
        <TableRow>
          <TableHead>Page Icon</TableHead>
          <TableHead>Page Title</TableHead>
          <TableHead>Page Content</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>CreatedAt</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pages.map((page) => (
          <TableRow key={page.id}>

            {/* Image column — intentionally blank */}
            <TableCell>
              {page.pageIcon && <img src={page.pageIcon} alt="" height="100" width="100" />}
            </TableCell>

            <TableCell>{page.pageTitle}</TableCell>
            <TableCell>{page.pageContent}</TableCell>

            <TableCell>
              {page.status === "ACTIVE" ? (
                <Badge className="bg-green-500">ACTIVE</Badge>
              ) : (
                <Badge variant="destructive">INACTIVE</Badge>
              )}
            </TableCell>

            <TableCell>
              <ClientDate date={page.createdAt} />
            </TableCell>

            <TableCell>
              <div className="flex gap-2">
                <Button asChild size="icon" className="bg-orange-500 hover:bg-orange-600">
                  <Link href={`/admin/cms/edit/${page.id}`}>
                    <EditIcon size={16} />
                  </Link>
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => deletePageHandler(page.id)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </TableCell>

          </TableRow>
        ))}
      </TableBody>

    </Table>
  )
}

export default CMSTable