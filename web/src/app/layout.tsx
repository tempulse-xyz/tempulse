import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tempulse — Tempo Stablecoin Analytics",
  description:
    "Real-time analytics dashboard for TIP-20 stablecoins on the Tempo blockchain. Track TVL, volume, holders, and transfers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen`}
      >
        <div className="flex flex-col min-h-screen">
          <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <a href="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold tracking-tight group-hover:text-accent-secondary transition-colors">
                  Tempulse
                </span>
              </a>
              <nav className="flex items-center gap-6 text-sm text-muted">
                <a href="/" className="hover:text-foreground transition-colors">Dashboard</a>
                <a href="/tokens" className="hover:text-foreground transition-colors">Tokens</a>
                <a href="/activity" className="hover:text-foreground transition-colors">Activity</a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-sm text-muted">
              <span>Tempulse — Tempo Stablecoin Analytics</span>
              <span>Powered by Tempo Blockchain</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
