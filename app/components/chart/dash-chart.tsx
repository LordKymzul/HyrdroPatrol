"use client";


import { TDataHour } from "@/app/lib/types";
import {
    BarChart as DashChart, ResponsiveContainer, XAxis,
    YAxis, Bar, LineChart, CartesianGrid, LineProps,
    Line, Legend, Tooltip, Area, AreaChart
} from "recharts";


export default function DashLineChart({ datahour }: {
    datahour: TDataHour[]
}) {
    return (
        <ResponsiveContainer width={'100%'} height={300}>
            <AreaChart data={datahour}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ADD8E6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ADD8E6" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D8BFD8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#D8BFD8" stopOpacity={0} />
                    </linearGradient>

                </defs>
                <XAxis dataKey="dt" />
                <YAxis label={{ value: 'Pressure (m)', angle: -90, position: 'insideLeft' }} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="mean_pressure_tp" stroke="#ADD8E6" fillOpacity={1} fill="url(#colorUv)" />
                <Area type="monotone" dataKey="mean_pressure_azp" stroke="#D8BFD8" fillOpacity={1} fill="url(#colorPv)" />

            </AreaChart>
        </ResponsiveContainer >
    )
}




