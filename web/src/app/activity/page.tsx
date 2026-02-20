import { ActivityFeed } from "@/components/activity-feed";
import { getRecentActivity } from "@/lib/api";

const MOCK_TRANSFERS = [
    {
        id: 1,
        token_address: "0x20c0000000000000000000000000000000000001",
        from_address: "0x0000000000000000000000000000000000000000",
        to_address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        amount: "5000000000",
        memo: null,
        event_type: "mint",
        transaction_hash: "0xabc123",
        block_number: 1000500,
        log_index: 0,
        created_at: new Date().toISOString(),
    },
    {
        id: 2,
        token_address: "0x20c0000000000000000000000000000000000001",
        from_address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        to_address: "0x742d35cc6634c0532925a3b844bc9e7595f2bd38",
        amount: "1250000000",
        memo: null,
        event_type: "transfer",
        transaction_hash: "0xdef456",
        block_number: 1000498,
        log_index: 1,
        created_at: new Date().toISOString(),
    },
    {
        id: 3,
        token_address: "0x20c0000000000000000000000000000000000002",
        from_address: "0x742d35cc6634c0532925a3b844bc9e7595f2bd38",
        to_address: "0x0000000000000000000000000000000000000000",
        amount: "200000000",
        memo: null,
        event_type: "burn",
        transaction_hash: "0xghi789",
        block_number: 1000495,
        log_index: 0,
        created_at: new Date().toISOString(),
    },
];

export default async function ActivityPage() {
    let activity;
    try {
        activity = await getRecentActivity(100);
    } catch {
        activity = MOCK_TRANSFERS;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Activity</h1>
                <p className="text-muted">
                    Recent stablecoin transfers, mints, and burns on Tempo
                </p>
            </div>
            <ActivityFeed transfers={activity} />
        </div>
    );
}
