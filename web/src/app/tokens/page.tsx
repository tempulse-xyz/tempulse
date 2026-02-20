import { TokenTable } from "@/components/token-table";
import { getTokens } from "@/lib/api";

const MOCK_TOKENS = [
    {
        address: "0x20c0000000000000000000000000000000000001",
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
        currency: "USD",
        total_supply: "1500000000000",
        created_at_block: 100,
        created_at_tx: "0x123",
    },
    {
        address: "0x20c0000000000000000000000000000000000002",
        name: "Tether USD",
        symbol: "USDT",
        decimals: 6,
        currency: "USD",
        total_supply: "800000000000",
        created_at_block: 200,
        created_at_tx: "0x456",
    },
    {
        address: "0x20c0000000000000000000000000000000000003",
        name: "Euro Coin",
        symbol: "EURC",
        decimals: 6,
        currency: "EUR",
        total_supply: "350000000000",
        created_at_block: 300,
        created_at_tx: "0x789",
    },
];

export default async function TokensPage() {
    let tokens;
    try {
        tokens = await getTokens();
    } catch {
        tokens = MOCK_TOKENS;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">All Tokens</h1>
                <p className="text-muted">
                    Browse all TIP-20 stablecoins indexed on Tempo
                </p>
            </div>
            <TokenTable tokens={tokens} />
        </div>
    );
}
