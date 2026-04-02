import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "SocialSync",
  description: "Simple dashboard for connected accounts, universal posting, and scheduling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="topbar">
            <div className="brand">
              <h1>SocialSync</h1>
              <p>
                Connect platform accounts, compose once, and track scheduled posts
                from one calm dashboard.
              </p>
            </div>
            <nav className="nav">
              <Link href="/">Dashboard</Link>
              <Link href="/create-post">Create Post</Link>
              <Link href="/posts">Scheduled Posts</Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
