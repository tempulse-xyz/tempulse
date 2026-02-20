const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  currency: string;
  total_supply: string;
  created_at_block: number;
  created_at_tx: string;
}

export interface Transfer {
  id: number;
  token_address: string;
  from_address: string;
  to_address: string;
  amount: string;
  memo: string | null;
  event_type: string;
  transaction_hash: string;
  block_number: number;
  log_index: number;
  created_at: string;
}

export interface Account {
  address: string;
  token_address: string;
  balance: string;
  updated_at_block: number;
}

export interface TokenVolumeEntry {
  token_address: string;
  symbol: string;
  total_volume: string;
  transfer_count: number;
}

export interface VolumeResponse {
  tokens: TokenVolumeEntry[];
}

export interface OverviewResponse {
  total_value_transferred: string;
  total_transactions: number;
  active_addresses: number;
  tracked_tokens: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 10 },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  const json: ApiResponse<T> = await res.json();
  if (!json.success) {
    throw new Error("API returned unsuccessful response");
  }
  return json.data;
}

export async function getTokens(): Promise<Token[]> {
  return apiFetch<Token[]>("/api/v1/tokens");
}

export async function getToken(address: string): Promise<Token> {
  return apiFetch<Token>(`/api/v1/tokens/${address}`);
}

export async function getTokenHolders(
  address: string,
  limit = 50
): Promise<Account[]> {
  return apiFetch<Account[]>(
    `/api/v1/tokens/${address}/holders?limit=${limit}`
  );
}

export async function getTokenTransfers(
  address: string,
  limit = 50
): Promise<Transfer[]> {
  return apiFetch<Transfer[]>(
    `/api/v1/tokens/${address}/transfers?limit=${limit}`
  );
}

export async function getVolume(): Promise<VolumeResponse> {
  return apiFetch<VolumeResponse>("/api/v1/stats/volume");
}

export async function getOverview(): Promise<OverviewResponse> {
  return apiFetch<OverviewResponse>("/api/v1/stats/overview");
}

export async function getRecentActivity(limit = 50): Promise<Transfer[]> {
  return apiFetch<Transfer[]>(`/api/v1/activity/recent?limit=${limit}`);
}

export interface TimeSeriesEntry {
  date: string;
  volume: string;
  transfer_count: number;
}

export async function getDailyVolume(limit = 90): Promise<TimeSeriesEntry[]> {
  return apiFetch<TimeSeriesEntry[]>(`/api/v1/stats/daily?limit=${limit}`);
}

export async function getMonthlyVolume(limit = 24): Promise<TimeSeriesEntry[]> {
  return apiFetch<TimeSeriesEntry[]>(`/api/v1/stats/monthly?limit=${limit}`);
}

export async function getTokenDailyVolume(
  address: string,
  limit = 90
): Promise<TimeSeriesEntry[]> {
  return apiFetch<TimeSeriesEntry[]>(
    `/api/v1/tokens/${address}/volume/daily?limit=${limit}`
  );
}
