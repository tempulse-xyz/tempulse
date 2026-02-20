import { HoldersTable } from "@/components/holders-table";
import { ActivityFeed } from "@/components/activity-feed";
import { StatCard } from "@/components/stat-card";
import { TokenVolumeChart } from "@/components/token-volume-chart";
import {
    getToken,
    getTokenHolders,
    getTokenTransfers,
    getTokenDailyVolume,
} from "@/lib/api";
import { formatTokenAmount, truncateAddress } from "@/lib/format";

interface TokenDetailPageProps {
    params: Promise<{ address: string }>;
}

const MOCK_TOKEN = {
    address: "0x20c0000000000000000000000000000000000001",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    currency: "USD",
    total_supply: "1500000000000",
    created_at_block: 100,
    created_at_tx: "0x123abc",
};

const MOCK_HOLDERS = [
    { address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", token_address: "0x20c0000000000000000000000000000000000001", balance: "500000000000", updated_at_block: 1000 },
    { address: "0x742d35cc6634c0532925a3b844bc9e7595f2bd38", token_address: "0x20c0000000000000000000000000000000000001", balance: "350000000000", updated_at_block: 999 },
    { address: "0xabc4567890abcdef1234567890abcdef12345678", token_address: "0x20c0000000000000000000000000000000000001", balance: "200000000000", updated_at_block: 998 },
    { address: "0xdef4567890abcdef1234567890abcdef12345678", token_address: "0x20c0000000000000000000000000000000000001", balance: "150000000000", updated_at_block: 997 },
    { address: "0x1234567890abcdef1234567890abcdef12345678", token_address: "0x20c0000000000000000000000000000000000001", balance: "100000000000", updated_at_block: 996 },
];

const MOCK_TRANSFERS = [
    { id: 1, token_address: "0x20c0000000000000000000000000000000000001", from_address: "0x0000000000000000000000000000000000000000", to_address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", amount: "5000000000", memo: null, event_type: "mint", transaction_hash: "0xabc123", block_number: 1000500, log_index: 0, created_at: new Date().toISOString() },
    { id: 2, token_address: "0x20c0000000000000000000000000000000000001", from_address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", to_address: "0x742d35cc6634c0532925a3b844bc9e7595f2bd38", amount: "1250000000", memo: null, event_type: "transfer", transaction_hash: "0xdef456", block_number: 1000498, log_index: 1, created_at: new Date().toISOString() },
];

// Generate mock daily volume for token detail
function generateMockTokenDaily() {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const base = 800_000_000 + Math.floor(Math.random() * 400_000_000);
        const trend = Math.sin(i / 4) * 200_000_000;
        data.push({
            date: d.toISOString().split("T")[0],
            volume: Math.floor(base + trend).toString(),
            transfer_count: 5 + Math.floor(Math.random() * 15),
        });
    }
    return data;
}

export default async function TokenDetailPage({ params }: TokenDetailPageProps) {
    const { address } = await params;

    let token, holders, transfers, dailyVolume;
    try {
        [token, holders, transfers, dailyVolume] = await Promise.all([
            getToken(address),
            getTokenHolders(address, 20),
            getTokenTransfers(address, 20),
            getTokenDailyVolume(address, 30),
        ]);
    } catch {
        token = MOCK_TOKEN;
        holders = MOCK_HOLDERS;
        transfers = MOCK_TRANSFERS;
        dailyVolume = generateMockTokenDaily();
    }

    // Calculate payment velocity: volume / supply ratio
    const totalSupplyNum = Number(token.total_supply) || 1;
    const transferVolume = transfers.reduce(
        (sum, t) => sum + Number(t.amount),
        0
    );
    const velocity = transferVolume / totalSupplyNum;

    // Count unique active addresses from recent transfers
    const activeAddresses = new Set<string>();
    transfers.forEach((tx) => {
        if (tx.from_address !== "0x0000000000000000000000000000000000000000") {
            activeAddresses.add(tx.from_address);
        }
        if (tx.to_address !== "0x0000000000000000000000000000000000000000") {
            activeAddresses.add(tx.to_address);
        }
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Token Header */}
            <div className="mb-8 animate-fade-in">
                <div className="flex items-center gap-2 text-sm text-muted mb-3">
                    <a href="/" className="hover:text-foreground transition-colors">Dashboard</a>
                    <span>/</span>
                    <a href="/tokens" className="hover:text-foreground transition-colors">Tokens</a>
                    <span>/</span>
                    <span className="text-foreground">{token.symbol || "Token"}</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center shadow-lg shadow-accent/20">
                        <span className="text-2xl font-bold text-white">
                            {token.symbol ? token.symbol[0] : "?"}
                        </span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            {token.name || "Unknown Token"}
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent/10 text-accent-secondary border border-accent/20">
                                {token.symbol}
                            </span>
                        </h1>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted">
                            <span className="font-mono">{truncateAddress(token.address, 10)}</span>
                            <span>•</span>
                            <span>Currency: {token.currency || "—"}</span>
                            <span>•</span>
                            <span>Created at block {token.created_at_block.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats — payment-focused */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    label="Transfer Volume"
                    value={formatTokenAmount(transferVolume.toString(), token.decimals)}
                    subtitle="From recent transactions"
                    delay={1}
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 17l9.2-9.2M17 17V7H7" />
                        </svg>
                    }
                />
                <StatCard
                    label="Total Payments"
                    value={transfers.length.toString()}
                    subtitle="Recent transactions"
                    delay={2}
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    }
                />
                <StatCard
                    label="Active Addresses"
                    value={activeAddresses.size.toString()}
                    subtitle="Unique senders & receivers"
                    delay={3}
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                        </svg>
                    }
                />
                <StatCard
                    label="Payment Velocity"
                    value={`${velocity.toFixed(2)}x`}
                    subtitle="Volume / Supply ratio"
                    delay={4}
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                    }
                />
            </div>

            {/* Volume + Activity Charts — full width */}
            <div className="mb-8">
                <TokenVolumeChart
                    data={dailyVolume}
                    symbol={token.symbol || "Token"}
                    decimals={token.decimals}
                />
            </div>

            {/* Holders + Transfers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <HoldersTable
                        holders={holders}
                        totalSupply={token.total_supply}
                        decimals={token.decimals}
                    />
                </div>
                <div>
                    <ActivityFeed transfers={transfers} showToken={false} />
                </div>
            </div>
        </div>
    );
}
