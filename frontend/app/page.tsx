"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { PlatformCards } from "@/components/platform-cards";
import { fetchAccounts, fetchAccountStatus, getApiBaseUrl, getTenantId } from "@/lib/api";
import { Account, AccountStatusResponse } from "@/lib/types";

const emptyStatus: AccountStatusResponse = {
  facebook: { connected: false, active_accounts: 0 },
  instagram: { connected: false, active_accounts: 0 },
  linkedin: { connected: false, active_accounts: 0 },
  twitter: { connected: false, active_accounts: 0 },
  youtube: { connected: false, active_accounts: 0 },
};

export default function DashboardPage() {
  const [status, setStatus] = useState<AccountStatusResponse>(emptyStatus);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [statusData, accountData] = await Promise.all([
          fetchAccountStatus(),
          fetchAccounts(),
        ]);
        setStatus(statusData);
        setAccounts(accountData);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard.");
      }
    }

    void load();
  }, []);

  const stats = useMemo(() => {
    const connectedPlatforms = Object.values(status).filter((item) => item.connected).length;
    const activeAccounts = accounts.filter((account) => account.is_active).length;
    const inactiveAccounts = Math.max(accounts.length - activeAccounts, 0);

    return {
      connectedPlatforms,
      activeAccounts,
      inactiveAccounts,
      totalAccounts: accounts.length,
    };
  }, [accounts, status]);

  return (
    <main className="grid" style={{ gap: 20 }}>
      <section className="card section">
        <h2 className="section-title">Operations Hub</h2>
        <p className="section-copy">
          Your frontend is wired to <strong>{getApiBaseUrl()}</strong> using tenant{" "}
          <strong>{getTenantId()}</strong>. Use this space to verify platform connections before
          moving into the composer.
        </p>

        {error ? <div className="banner error">{error}</div> : null}

        <div className="stat-grid">
          <div className="stat">
            <span>Connected platforms</span>
            <strong>{stats.connectedPlatforms}</strong>
          </div>
          <div className="stat">
            <span>Total accounts</span>
            <strong>{stats.totalAccounts}</strong>
          </div>
          <div className="stat">
            <span>Active accounts</span>
            <strong>{stats.activeAccounts}</strong>
          </div>
          <div className="stat">
            <span>Inactive accounts</span>
            <strong>{stats.inactiveAccounts}</strong>
          </div>
        </div>

        <div className="cta-row" style={{ marginTop: 20 }}>
          <Link className="btn primary" href="/create-post">
            Open composer
          </Link>
          <Link className="btn secondary" href="/posts">
            View scheduled posts
          </Link>
        </div>
      </section>

      <section className="card section">
        <h2 className="section-title">Connect Platforms</h2>
        <p className="section-copy">
          Connect each network from here. The cards highlight once the backend reports at least
          one connected account for that platform.
        </p>
        <PlatformCards accountStatus={status} />
      </section>

      <section className="card section">
        <h2 className="section-title">Connected Accounts</h2>
        <p className="section-copy">
          A quick list of the account records already stored in your backend.
        </p>
        {accounts.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Platform</th>
                  <th>Platform account ID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td>{account.account_name}</td>
                    <td style={{ textTransform: "capitalize" }}>{account.platform}</td>
                    <td>{account.platform_account_id}</td>
                    <td>
                      <span className={`pill${account.is_active ? " connected" : ""}`}>
                        {account.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            No connected accounts yet. Use the cards above to start an OAuth flow.
          </div>
        )}
      </section>
    </main>
  );
}
