import { Chart } from "@/components/dashboard/chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IconSitemap } from "@tabler/icons-react";
import { User2Icon, Users2 } from "lucide-react";

export default function Page() {
  return (
    <div className=" space-y-6 bg-gradient-to-b from-green-50 to-emerald-100 p-4 rounded-xl min-h-screen">
     <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white">
  <CardContent className="flex flex-col gap-1 py-7 px-6">

    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
      Hello, Admin
    </h1>

    <p className="text-sm md:text-base opacity-90">
      Welcome back! again to your dashboard your dashboard today.
    </p>

  </CardContent>
 
  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
</Card>

      <section className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
        <Card className="shadow-md hover:shadow-lg transition bg-white/80 backdrop-blur">
          <CardContent className="flex justify-between items-center p-6">
            <span className="text-muted-foreground">Families</span>
            <span className="text-2xl font-bold text-green-600">0</span>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition bg-white/80 backdrop-blur">
          <CardContent className="flex justify-between items-center p-6">
            <span className="text-muted-foreground">Users</span>
            <span className="text-2xl font-bold text-green-600">0</span>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition bg-white/80 backdrop-blur">
          <CardContent className="flex justify-between items-center p-6">
            <span className="text-muted-foreground">Members</span>
            <span className="text-2xl font-bold text-green-600">0</span>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition bg-white/80 backdrop-blur">
          <CardContent className="flex justify-between items-center p-6">
            <span className="text-muted-foreground">Images</span>
            <span className="text-2xl font-bold text-green-600">0</span>
          </CardContent>
        </Card>
      </section>

      <section className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <Card className="shadow-md bg-white/90 backdrop-blur">
          <CardHeader className="font-semibold text-green-700">
            Activity Chart
          </CardHeader>
          <CardContent className="h-[320px] w-full overflow-hidden">
            <Chart />
          </CardContent>
        </Card>

        <Card className="shadow-md bg-white/90 backdrop-blur">
          <CardHeader className="font-semibold text-green-700">
            Growth Chart
          </CardHeader>
          <CardContent className="h-[320px] w-full ">
            <Chart />
          </CardContent>
        </Card>
      </section>

      <section className="grid md:grid-cols-3 grid-cols-1 gap-4">
        <Card className="shadow-md bg-white/90 backdrop-blur">
          <CardHeader className="flex items-center gap-2 border-b pb-2 text-green-700">
            <User2Icon size={18} />
            <span className="font-semibold">New Users (24h)</span>
          </CardHeader>
          <CardContent className="py-6 text-sm text-muted-foreground">
            No data found
          </CardContent>
        </Card>

        <Card className="shadow-md bg-white/90 backdrop-blur">
          <CardHeader className="flex items-center gap-2 border-b pb-2 text-green-700">
            <IconSitemap size={18} />
            <span className="font-semibold">Latest Families</span>
          </CardHeader>
          <CardContent className="py-6 text-sm text-muted-foreground">
            No data found
          </CardContent>
        </Card>

        <Card className="shadow-md bg-white/90 backdrop-blur">
          <CardHeader className="flex items-center gap-2 border-b pb-2 text-green-700">
            <Users2 size={18} />
            <span className="font-semibold">Latest Members</span>
          </CardHeader>
          <CardContent className="py-6 text-sm text-muted-foreground">
            No data found
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
