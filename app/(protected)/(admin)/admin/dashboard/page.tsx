import { Chart } from "@/components/dashboard/chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { IconSitemap } from "@tabler/icons-react";
import { User, User2, User2Icon, UserCheck2, Users2, UsersIcon } from "lucide-react";



export default function Page() {
  return (
    <div className="mt-4 space-y-4">
      <Card>
        <CardContent>
          <h1>Hello, Admin!</h1>
          <p>Welcome back again to your dashboard.</p>
        </CardContent>
      </Card>

      <section className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1  gap-4">
        <Card>
          <CardContent className="flex justify-between items-center">
            <span>Families</span>
            <span>0</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex justify-between items-center">
            <span>Users</span>
            <span>0</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex justify-between items-center">
            <span>Members</span>
            <span>0</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex justify-between items-center">
            <span>Images</span>
            <span>0</span>
          </CardContent>
        </Card>

      </section>

      <section className="grid md:grid-cols-2 grid-cols-1">
        <Chart />
        <Chart />
      </section>

      <section className="grid md:grid-cols-3 grid-cols-1  gap-4">
        <Card className="p-4">
          <CardHeader className="flex border-b">
            <User2Icon />
            <span> New Users (24h)</span>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            no data found
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader className="flex border-b">
            <IconSitemap />
            <span> Latest Families</span>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            no data found
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader className="flex border-b">
            <Users2 />
            <span> Latest Members</span>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            no data found
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
