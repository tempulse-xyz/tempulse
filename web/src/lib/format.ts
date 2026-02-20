/**
 * Format a raw token amount (with decimals=6) to a human-readable string.
 * e.g., "1000000000" → "1,000.000000"
 */
export function formatTokenAmount(
  raw: string,
  decimals: number = 6,
  maxFractionDigits: number = 2
): string {
  if (!raw || raw === "0") return "0";

  try {
    const num = Number(raw) / Math.pow(10, decimals);
    if (isNaN(num)) return "0";

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxFractionDigits,
    }).format(num);
  } catch {
    return raw;
  }
}

/**
 * Format large numbers compactly: 1234567 → "1.23M"
 */
export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
  return value.toFixed(2);
}

/**
 * Truncate an address for display: 0x1234...abcd
 */
export function truncateAddress(address: string, chars: number = 6): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

/**
 * Format a relative time string: "2 min ago", "1 hr ago", etc.
 */
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Get a color class based on event type.
 */
export function eventTypeColor(type: string): string {
  switch (type) {
    case "mint":
      return "text-positive";
    case "burn":
      return "text-negative";
    default:
      return "text-accent-secondary";
  }
}

/**
 * Get a label for event type.
 */
export function eventTypeLabel(type: string): string {
  switch (type) {
    case "mint":
      return "Mint";
    case "burn":
      return "Burn";
    default:
      return "Transfer";
  }
}
