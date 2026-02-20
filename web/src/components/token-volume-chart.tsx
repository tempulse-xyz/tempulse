"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

export interface TokenTimeSeriesPoint {
    date: string;
    volume: string;
    transfer_count: number;
}

interface TokenVolumeChartProps {
    data: TokenTimeSeriesPoint[];
    symbol: string;
    decimals?: number;
}

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

export function TokenVolumeChart({
    data,
    symbol,
    decimals = 6,
}: TokenVolumeChartProps) {
    const chartData = [...data]
        .reverse()
        .map((d) => ({
            date: d.date,
            volume: formatVolume(d.volume, decimals),
            transactions: d.transfer_count,
        }));

    return (
        <div className="bg-card border border-border rounded-2xl p-6 animate-fade-in">
            <h2 className="text-lg font-semibold mb-6">
                {symbol} Daily Activity
            </h2>

            {chartData.length > 0 ? (
                <div className="space-y-6">
                    {/* Volume Area Chart */}
                    <div>
                        <p className="text-sm text-muted mb-3">Transfer Volume ($)</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="tokenVolumeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
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
                                    stroke="#34d399"
                                    strokeWidth={2}
                                    fill="url(#tokenVolumeGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Activity Line Chart */}
                    <div>
                        <p className="text-sm text-muted mb-3">Daily Transactions</p>
                        <ResponsiveContainer width="100%" height={160}>
                            <LineChart data={chartData}>
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
                                <Line
                                    type="monotone"
                                    dataKey="transactions"
                                    stroke="#818cf8"
                                    strokeWidth={2}
                                    dot={{ fill: "#818cf8", r: 3, strokeWidth: 0 }}
                                    activeDot={{ r: 5, fill: "#818cf8" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <div className="h-[360px] flex items-center justify-center text-muted">
                    <div className="text-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-30">
                            <path d="M3 3v18h18" />
                            <path d="M7 16l4-4 4 4 6-6" />
                        </svg>
                        <p>No activity data for {symbol} yet</p>
                    </div>
                </div>
            )}
        </div>
    );
}
