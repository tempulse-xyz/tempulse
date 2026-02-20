"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { useState } from "react";

export interface TimeSeriesPoint {
    date: string;
    volume: string;
    transfer_count: number;
}

interface VolumeChartProps {
    dailyData: TimeSeriesPoint[];
    monthlyData: TimeSeriesPoint[];
    decimals?: number;
}

type Period = "daily" | "monthly";

function formatVolume(raw: string, decimals: number): number {
    return Number(raw) / Math.pow(10, decimals);
}

function formatYAxis(value: number): string {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
}

function formatTooltipValue(value: number): string {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function VolumeChart({
    dailyData,
    monthlyData,
    decimals = 6,
}: VolumeChartProps) {
    const [period, setPeriod] = useState<Period>("daily");

    const rawData = period === "daily" ? dailyData : monthlyData;

    // Transform and reverse so oldest is first (left side of chart)
    const chartData = [...rawData]
        .reverse()
        .map((d) => ({
            date: d.date,
            volume: formatVolume(d.volume, decimals),
            transactions: d.transfer_count,
        }));

    return (
        <div className="bg-card border border-border rounded-2xl p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Payment Volume</h2>
                <div className="flex bg-background rounded-lg p-0.5 border border-border">
                    <button
                        onClick={() => setPeriod("daily")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${period === "daily"
                            ? "bg-accent text-white shadow"
                            : "text-muted hover:text-foreground"
                            }`}
                    >
                        Daily
                    </button>
                    <button
                        onClick={() => setPeriod("monthly")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${period === "monthly"
                            ? "bg-accent text-white shadow"
                            : "text-muted hover:text-foreground"
                            }`}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            {chartData.length > 0 ? (
                <div className="space-y-6">
                    {/* Volume Area Chart */}
                    <div>
                        <p className="text-sm text-muted mb-3">Transfer Volume ($)</p>
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e2233" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: "#6b7194", fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={{ stroke: "#1e2233" }}
                                />
                                <YAxis
                                    tickFormatter={formatYAxis}
                                    tick={{ fill: "#6b7194", fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={65}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#12141f",
                                        border: "1px solid #1e2233",
                                        borderRadius: "12px",
                                        color: "#e4e6ef",
                                        fontSize: "13px",
                                    }}
                                    formatter={(value: number | undefined) => [formatTooltipValue(value ?? 0), "Volume"]}
                                    labelStyle={{ color: "#6b7194" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="volume"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    fill="url(#volumeGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Transactions Bar Chart */}
                    <div>
                        <p className="text-sm text-muted mb-3">Transaction Count</p>
                        <ResponsiveContainer width="100%" height={160}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e2233" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: "#6b7194", fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={{ stroke: "#1e2233" }}
                                />
                                <YAxis
                                    tick={{ fill: "#6b7194", fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={40}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#12141f",
                                        border: "1px solid #1e2233",
                                        borderRadius: "12px",
                                        color: "#e4e6ef",
                                        fontSize: "13px",
                                    }}
                                    formatter={(value: number | undefined) => [value ?? 0, "Transactions"]}
                                    labelStyle={{ color: "#6b7194" }}
                                />
                                <Bar
                                    dataKey="transactions"
                                    fill="#818cf8"
                                    radius={[4, 4, 0, 0]}
                                    opacity={0.8}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <div className="h-[400px] flex items-center justify-center text-muted">
                    <div className="text-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-30">
                            <path d="M3 3v18h18" />
                            <path d="M7 16l4-4 4 4 6-6" />
                        </svg>
                        <p>No volume data available yet</p>
                        <p className="text-xs mt-1">Start indexing to see charts</p>
                    </div>
                </div>
            )}
        </div>
    );
}
