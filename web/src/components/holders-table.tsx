"use client";

import { Account } from "@/lib/api";
import { formatTokenAmount, truncateAddress } from "@/lib/format";

interface HoldersTableProps {
    holders: Account[];
    totalSupply: string;
    decimals?: number;
}

export function HoldersTable({
    holders,
    totalSupply,
    decimals = 6,
}: HoldersTableProps) {
    const totalNum = Number(totalSupply) || 1;

    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold">Top Holders</h2>
                <span className="text-sm text-muted">{holders.length} addresses</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-muted border-b border-border">
                            <th className="px-6 py-3 font-medium w-12">#</th>
                            <th className="px-6 py-3 font-medium">Address</th>
                            <th className="px-6 py-3 font-medium text-right">Balance</th>
                            <th className="px-6 py-3 font-medium text-right">Share</th>
                            <th className="px-6 py-3 font-medium w-40">Distribution</th>
                        </tr>
                    </thead>
                    <tbody>
                        {holders.map((holder, i) => {
                            const balance = Number(holder.balance);
                            const pct = (balance / totalNum) * 100;
                            return (
                                <tr
                                    key={holder.address}
                                    className="border-b border-border/50 hover:bg-card-hover transition-colors"
                                >
                                    <td className="px-6 py-3 text-muted text-sm">{i + 1}</td>
                                    <td className="px-6 py-3">
                                        <span className="font-mono text-sm">
                                            {truncateAddress(holder.address, 8)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right font-mono text-sm">
                                        {formatTokenAmount(holder.balance, decimals)}
                                    </td>
                                    <td className="px-6 py-3 text-right text-sm">
                                        <span className="text-accent-secondary font-medium">
                                            {pct.toFixed(2)}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-accent to-accent-secondary transition-all duration-500"
                                                style={{ width: `${Math.min(pct, 100)}%` }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {holders.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-muted">
                                    No holders found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
