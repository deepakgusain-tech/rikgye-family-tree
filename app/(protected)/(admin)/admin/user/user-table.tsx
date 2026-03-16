"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { deleteUser, getUsers } from '@/lib/actions/user-action';
import { User } from '@/types'
import { EditIcon, Trash } from 'lucide-react';
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner';
import ClientDate from '@/components/ui/client-date';

const UserTable = ({ data }: { data: User[] }) => {

  const [users, setUsers] = useState<User[]>(data)

  const deleteUserHandler = async (id: any) => {
    let res = await deleteUser(id);

    if (!res?.success) {
      toast.error("Error", {
        description: res?.message
      })
    } else {
      toast.success("Success", {
        description: res?.message
      })

      const response = await getUsers()
      setUsers(response as User[])
    }
  }

  return (
    <div className="w-full overflow-x-auto">

      <Table className='w-full'>

        <TableHeader className="bg-emerald-50 dark:bg-emerald-900/30">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-200">
              Image
            </TableHead>
            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-200">
              First Name
            </TableHead>
            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-200">
              Last Name
            </TableHead>
            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-200">
              Email
            </TableHead>
            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-200">
              Status
            </TableHead>
            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-200">
              CreatedAt
            </TableHead>
            <TableHead className="font-semibold text-emerald-900 dark:text-emerald-200">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20 transition-colors"
            >

              <TableCell>
                {/* {user.avatar && <img src={user.avatar} alt="" height="100" width="100" />} */}
              </TableCell>

              <TableCell className="font-medium">
                {user.firstName}
              </TableCell>

              <TableCell>
                {user.lastName}
              </TableCell>

              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>

              <TableCell>
                {user.status === "ACTIVE" ? (
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
                <ClientDate date={user.createdAt} />
              </TableCell>

              <TableCell>
                <div className="flex gap-2">

                  <Button
                    asChild
                    size="icon"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Link href={`/admin/user/edit/${user.id}`}>
                      <EditIcon size={16} />
                    </Link>
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => deleteUserHandler(user.id)}
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

export default UserTable