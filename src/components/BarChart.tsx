"use client"

import { useState } from "react"
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts"
import { ChartTooltip } from "@/components/ui/chart"

interface BarChartProps {
    labels: string[]
    data: number[]
    trendData?: number[]
    title?: string
    barLabel?: string
    trendLabel?: string
    className?: string
    showTrendline?: boolean
    barColor?: string
    trendColor?: string
}

export default function BarChart({
    labels,
    data,
    trendData,
    title = "Sales Performance",
    barLabel = "Sales Volume",
    trendLabel = "Market Share",
    className = "",
    showTrendline = true,
    barColor = "#7ae2e2",
    trendColor = "#8b5cf6",
}: BarChartProps) {
    const [scrollIndex, setScrollIndex] = useState(0)
    const visibleBars = 6
    const maxScroll = Math.max(0, labels.length - visibleBars)

    const chartData = labels.map((label, index) => ({
        name: label,
        [barLabel]: data[index],
        [trendLabel]: trendData?.[index] || 0,
    }))

    const slicedData = chartData.slice(scrollIndex, scrollIndex + visibleBars)

    const maxBarValue = Math.max(...data)
    const maxTrendValue = trendData ? Math.max(...trendData) : 0

    const getYAxisTicks = (maxValue: number) => {
        const roundedMax = Math.ceil(maxValue / 50000) * 50000
        const interval = roundedMax / 5
        const ticks = []
        for (let i = 0; i <= roundedMax; i += interval) {
            ticks.push(i)
        }
        return ticks
    }

    const getTrendAxisTicks = (maxValue: number) => {
        const roundedMax = Math.ceil(maxValue / 5) * 5
        const interval = roundedMax / 5
        const ticks = []
        for (let i = 0; i <= roundedMax; i += interval) {
            ticks.push(i)
        }
        return ticks
    }

    const yAxisTicks = getYAxisTicks(maxBarValue)
    const trendAxisTicks = trendData ? getTrendAxisTicks(maxTrendValue) : []

    const formatValue = (value: number) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}K`
        }
        return value.toString()
    }

    const renderCustomizedLabel = (props: any) => {
        const { x, y, width, height, value } = props
        const formattedValue = formatValue(value)

        if (height < 30) return <g />

        return (
            <text
                x={x + width / 2}
                y={y + height / 2}
                fill="white"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={13}
                fontWeight="600"
            >
                {formattedValue}
            </text>
        )
    }

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        // e.preventDefault()
        const delta = e.deltaY > 0 ? 1 : -1
        setScrollIndex((prev) => Math.max(0, Math.min(prev + delta, maxScroll)))
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex-1">
            <div className="px-6 pt-6 pb-2">
                <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
            </div>

            <div className="" onWheel={handleWheel}>
                <ResponsiveContainer width="100%" height={450}>
                    <ComposedChart
                        data={slicedData}
                        margin={{ top: 15, right: 15, left: 15, bottom: 15 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />

                        <XAxis
                            dataKey="name"
                            tick={{ fill: "#64748b", fontSize: 12 }}
                            axisLine={{ stroke: "#cbd5e1" }}
                            tickLine={{ stroke: "#cbd5e1" }}
                        />

                        <YAxis
                            yAxisId="left"
                            tick={{ fill: "#64748b", fontSize: 12 }}
                            tickFormatter={formatValue}
                            axisLine={{ stroke: "#cbd5e1" }}
                            tickLine={{ stroke: "#cbd5e1" }}
                            ticks={yAxisTicks}
                            label={{
                                value: "Bar Values",
                                angle: -90,
                                position: "insideLeft",
                                style: {
                                    textAnchor: "middle",
                                    fill: "#6b7280",
                                    fontSize: "12px",
                                },
                            }}
                        />

                        {showTrendline && trendData && (
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={{ fill: "#64748b", fontSize: 12 }}
                                axisLine={{ stroke: "#cbd5e1" }}
                                tickLine={{ stroke: "#cbd5e1" }}
                                ticks={trendAxisTicks}
                                label={{
                                    value: "Trendline Values",
                                    angle: 90,
                                    position: "insideRight",
                                    style: {
                                        textAnchor: "middle",
                                        fill: "#6b7280",
                                        fontSize: "12px",
                                    },
                                }}
                            />
                        )}

                        <ChartTooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                                            <p className="font-medium text-slate-900 mb-2">{label}</p>
                                            {payload.map((entry, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 mb-1"
                                                >
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: entry.color }}
                                                    />
                                                    <span className="text-slate-600 text-sm">
                                                        {entry.name}:
                                                    </span>
                                                    <span className="font-semibold text-slate-900 text-sm">
                                                        {entry.name === barLabel
                                                            ? formatValue(entry.value as number)
                                                            : entry.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />

                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            height={50}
                            content={({ payload }) => (
                                <div className="flex justify-center gap-6 mt-4">
                                    {payload?.map((entry, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 text-slate-700 text-sm font-medium"
                                        >
                                            <div
                                                className="w-4 h-4 rounded-sm"
                                                style={{ backgroundColor: entry.color }}
                                            />
                                            <span>{entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        />

                        <Bar
                            yAxisId="left"
                            dataKey={barLabel}
                            name={barLabel}
                            fill={barColor}
                            radius={[5, 5, 0, 0]}
                            label={renderCustomizedLabel}
                            maxBarSize={50}
                        />

                        {showTrendline && trendData && (
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey={trendLabel}
                                name={trendLabel}
                                stroke={trendColor}
                                strokeWidth={2}
                                dot={{ fill: trendColor, strokeWidth: 2, r: 5 }}
                                activeDot={{
                                    r: 7,
                                    stroke: trendColor,
                                    strokeWidth: 2,
                                    fill: "#fff",
                                }}
                            />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
