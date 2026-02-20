"use client";

import { Transfer } from "@/lib/api";
import {
    formatTokenAmount,
    truncateAddress,
    timeAgo,
    eventTypeColor,
    eventTypeLabel,
} from "@/lib/format";

interface ActivityFeedProps {
    transfers: Transfer[];
    showToken?: boolean;
}

export function ActivityFeed({ transfers, showToken = true }: ActivityFeedProps) {
    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-positive animate-pulse" />
                    <span className="text-sm text-muted">Live</span>
                </div>
            </div>
            <div className="divide-y divide-border/50">
                {transfers.map((tx, i) => (
                    <div
                        key={`${tx.transaction_hash}-${tx.log_index}`}
                        className="px-6 py-4 hover:bg-card-hover transition-colors"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                {/* Event type icon */}
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tx.event_type === "mint"
                                            ? "bg-positive/10"
                                            : tx.event_type === "burn"
                                                ? "bg-negative/10"
                                                : "bg-accent/10"
                                        }`}
                                >
                                    {tx.event_type === "mint" ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-positive">
                                            <path d="M12 5v14m-7-7h14" />
                                        </svg>
                                    ) : tx.event_type === "burn" ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-negative">
                                            <path d="M5 12h14" />
                                        </svg>
                                    ) : (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent-secondary">
                                            <path d="M5 12h14m-4-4 4 4-4 4" />
                                        </svg>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-semibold uppercase ${eventTypeColor(tx.event_type)}`}>
                                            {eventTypeLabel(tx.event_type)}
                                        </span>
                                        {showToken && (
                                            <span className="text-xs text-muted font-mono">
                                                {truncateAddress(tx.token_address, 4)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-muted mt-0.5 flex items-center gap-1 truncate">
                                        <span className="font-mono">{truncateAddress(tx.from_address, 4)}</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 opacity-40">
                                            <path d="M5 12h14m-4-4 4 4-4 4" />
                                        </svg>
                                        <span className="font-mono">{truncateAddress(tx.to_address, 4)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="font-semibold font-mono text-sm">
                                    {formatTokenAmount(tx.amount)}
                                </div>
                                <div className="text-xs text-muted mt-0.5">
                                    Block {tx.block_number.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {transfers.length === 0 && (
                    <div className="px-6 py-12 text-center text-muted">
                        <p>No activity recorded yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
