"use client";

interface StatCardProps {
    label: string;
    value: string;
    subtitle?: string;
    icon: React.ReactNode;
    delay?: number;
}

export function StatCard({ label, value, subtitle, icon, delay = 0 }: StatCardProps) {
    const delayClass = delay > 0 ? `animate-fade-in-delay-${delay}` : "";

    return (
        <div
            className={`glow-card bg-card border border-border rounded-2xl p-6 hover:bg-card-hover transition-all duration-300 hover:border-accent/30 animate-fade-in ${delayClass}`}
        >
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted font-medium">{label}</span>
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    {icon}
                </div>
            </div>
            <div className="text-3xl font-bold tracking-tight">{value}</div>
            {subtitle && (
                <div className="text-sm text-muted mt-1">{subtitle}</div>
            )}
        </div>
    );
}
