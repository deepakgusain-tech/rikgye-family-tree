"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CMS } from '@/types'
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
    <div className="w-full">

      <Table className="w-full">

        <TableHeader className="bg-emerald-50 dark:bg-emerald-900/30 border-b border-emerald-200 dark:border-emerald-800">
          <TableRow className="hover:bg-transparent">

            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-200">
              Page Icon
            </TableHead>

            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-200">
              Page Title
            </TableHead>

            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-200">
              Page Content
            </TableHead>

            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-200">
              Status
            </TableHead>

            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-200">
              CreatedAt
            </TableHead>

            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-200 text-right">
              Action
            </TableHead>

          </TableRow>
        </TableHeader>

        <TableBody>

          {pages.map((page) => (
            <TableRow
              key={page.id}
              className="hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20 transition-colors"
            >

              <TableCell>
                {page.pageIcon && (
                  <img
                    src={page.pageIcon}
                    alt=""
                    className="h-8 w-8 rounded-md border border-emerald-200 object-cover"
                  />
                )}
              </TableCell>

              <TableCell className="font-medium text-foreground">
                {page.pageTitle}
              </TableCell>

              <TableCell className="text-muted-foreground max-w-[400px] truncate">
                {page.pageContent}
              </TableCell>

              <TableCell>
                {page.status === "ACTIVE" ? (
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">
                    ACTIVE
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    INACTIVE
                  </Badge>
                )}
              </TableCell>

              <TableCell>
                <ClientDate date={page.createdAt} />
              </TableCell>

              <TableCell>
                <div className="flex justify-end gap-2">

                  <Button
                    asChild
                    size="icon"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
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

    </div>
  )
}

export default CMSTable