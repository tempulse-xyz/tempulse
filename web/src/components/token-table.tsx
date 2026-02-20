"use client";

import Link from "next/link";
import { Token } from "@/lib/api";
import { formatTokenAmount, formatCompact, truncateAddress } from "@/lib/format";

interface TokenTableProps {
    tokens: Token[];
}

export function TokenTable({ tokens }: TokenTableProps) {
    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold">Stablecoins</h2>
                <span className="text-sm text-muted">{tokens.length} tokens</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-muted border-b border-border">
                            <th className="px-6 py-3 font-medium">Token</th>
                            <th className="px-6 py-3 font-medium">Currency</th>
                            <th className="px-6 py-3 font-medium text-right">Total Supply</th>
                            <th className="px-6 py-3 font-medium text-right">Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tokens.map((token, i) => (
                            <Link
                                key={token.address}
                                href={`/tokens/${token.address}`}
                                className="contents"
                            >
                                <tr
                                    className="border-b border-border/50 hover:bg-card-hover transition-colors cursor-pointer group"
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/20 to-accent-secondary/20 flex items-center justify-center border border-accent/20">
                                                <span className="text-sm font-bold text-accent-secondary">
                                                    {token.symbol ? token.symbol[0] : "?"}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-semibold group-hover:text-accent-secondary transition-colors">
                                                    {token.symbol || "Unknown"}
                                                </div>
                                                <div className="text-sm text-muted">
                                                    {token.name || "—"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent-secondary border border-accent/20">
                                            {token.currency || "—"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-sm">
                                        {formatTokenAmount(token.total_supply, token.decimals)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-mono text-sm text-muted">
                                            {truncateAddress(token.address)}
                                        </span>
                                    </td>
                                </tr>
                            </Link>
                        ))}
                        {tokens.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-muted">
                                    <div className="flex flex-col items-center gap-2">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M8 15h8M9 9h.01M15 9h.01" />
                                        </svg>
                                        <p>No tokens indexed yet</p>
                                        <p className="text-xs">Start the indexer to discover TIP-20 tokens</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
