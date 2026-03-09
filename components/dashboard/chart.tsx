"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { set } from "zod"

const monthlyData = [
    { name: "Jan", members: 10 },
    { name: "Feb", members: 20 },
    { name: "Mar", members: 30 },
]

const yearlyData = [
    { name: "2022", members: 120 },
    { name: "2023", members: 180 },
    { name: "2024", members: 260 },
]

export function Chart() {
    const [filter, setFilter] = useState("month")
    const [mounted, setMounted] = useState(false)


    const data = filter === "month" ? monthlyData : yearlyData

    useEffect(() => {
        setMounted(true)
    }, [])

    if(mounted === false) return null

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Members Growth</CardTitle>

                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent>
                <BarChart width={500} height={300} data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="members" />
                </BarChart>
            </CardContent>
        </Card>
    )
}