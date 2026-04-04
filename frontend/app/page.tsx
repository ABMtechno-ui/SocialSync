"use client";

import { useEffect, useMemo, useState } from "react";

import { PostComposerModal } from "@/components/post-composer-modal";
import { fetchAccounts, fetchAccountStatus, getApiBaseUrl, getTenantId } from "@/lib/api";
import { Account, AccountStatusResponse, PlatformName } from "@/lib/types";

const platformMeta: Array<{
  key: PlatformName;
  label: string;
  description: string;
  supportedTypes: string;
  unsupportedMessage: string;
  connectLabel: string;
}> = [
  {
    key: "facebook",
    label: "Facebook",
    description: "Manage page publishing, engagement flows, and Meta-linked distribution.",
    supportedTypes: "Facebook Pages are supported. One tenant can connect multiple pages.",
    unsupportedMessage: "Personal Facebook profile posting is not available in this publishing flow.",
    connectLabel: "Connect pages",
  },
  {
    key: "instagram",
    label: "Instagram",
    description: "Handle visual campaigns, reels, and Instagram professional publishing.",
    supportedTypes: "Instagram Business or Creator accounts linked to a Facebook Page are supported.",
    unsupportedMessage: "Personal Instagram accounts are blocked because the Meta publishing API does not allow them.",
    connectLabel: "Connect professional account",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    description: "Deliver professional updates and profile-based social reach.",
    supportedTypes: "LinkedIn personal profiles are supported now. Multiple saved profiles per tenant are allowed.",
    unsupportedMessage: "LinkedIn company page publishing needs a separate organization-admin connection flow.",
    connectLabel: "Connect profile",
  },
  {
    key: "twitter",
    label: "X / Twitter",
    description: "Coordinate fast updates, campaign reactions, and conversational brand posts.",
    supportedTypes: "Personal or brand-managed X accounts can be connected individually.",
    unsupportedMessage: "Each connected X account is stored separately so one tenant can manage multiple accounts.",
    connectLabel: "Connect X account",
  },
  {
    key: "youtube",
    label: "YouTube",
    description: "Prepare video publishing workflows using the connected Google channel.",
    supportedTypes: "YouTube channels from the authenticated Google account are supported.",
    unsupportedMessage: "Channels appear only after Google authorizes a real YouTube channel for that account.",
    connectLabel: "Connect channel",
  },
];

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
  const [composerOpen, setComposerOpen] = useState(false);
  const [oauthBanner, setOauthBanner] = useState<{ tone: "success" | "error"; text: string } | null>(
    null,
  );

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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const currentUrl = new URL(window.location.href);
    const oauthResult = currentUrl.searchParams.get("oauth_result");
    const oauthPlatform = currentUrl.searchParams.get("oauth_platform");
    const oauthMessage = currentUrl.searchParams.get("oauth_message");
    const oauthCount = currentUrl.searchParams.get("oauth_count");

    if (!oauthResult || !oauthMessage) {
      return;
    }

    const platformLabel = oauthPlatform
      ? `${oauthPlatform[0].toUpperCase()}${oauthPlatform.slice(1)}`
      : "Social";

    setOauthBanner({
      tone: oauthResult === "success" ? "success" : "error",
      text:
        oauthResult === "success"
          ? `${platformLabel}: ${oauthMessage}${oauthCount ? ` Added account count: ${oauthCount}.` : ""}`
          : `${platformLabel}: ${oauthMessage}`,
    });

    currentUrl.searchParams.delete("oauth_result");
    currentUrl.searchParams.delete("oauth_platform");
    currentUrl.searchParams.delete("oauth_message");
    currentUrl.searchParams.delete("oauth_count");
    window.history.replaceState({}, "", currentUrl.pathname + currentUrl.search + currentUrl.hash);
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
      <section className="card hero-card">
        <div className="hero-panel">
          <div className="brand-kicker">SnapKey CRM module</div>
          <h2 className="section-title" style={{ fontSize: "2.15rem", marginBottom: 12 }}>
            Social publishing dashboard
          </h2>
          <p className="section-copy">
            Connect channels, prepare campaign content, and push scheduled work into execution from
            one SnapKey workspace. Backend: <strong>{getApiBaseUrl()}</strong>. Tenant:{" "}
            <strong>{getTenantId()}</strong>.
          </p>

          <div className="cta-row" style={{ marginBottom: 22 }}>
            <button className="btn primary" onClick={() => setComposerOpen(true)} type="button">
              Create post
            </button>
            <a className="btn secondary" href="/posts">
              View scheduled posts
            </a>
          </div>

          {error ? <div className="banner error">{error}</div> : null}
          {oauthBanner ? <div className={`banner ${oauthBanner.tone}`}>{oauthBanner.text}</div> : null}

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
        </div>

        <div className="hero-visual">
          <div className="hero-dots" />
          <div className="hero-window">
            <div className="hero-window-grid">
              <div className="hero-row long" />
              <div className="hero-row mid" />
              <div className="hero-row short" />
              <div className="hero-row long" />
            </div>
            <div className="hero-stamp">Campaigns in motion</div>
          </div>
        </div>
      </section>

      <section className="card section">
        <h2 className="section-title">Channel Connections</h2>
        <p className="section-copy">
          Link each social channel from here. Every card shows the allowed account types for that
          platform, blocks unsupported account types with a clear explanation, and lists the page,
          profile, or channel names already attached to this tenant.
        </p>
        <div className="grid three">
          {platformMeta.map((platform) => {
            const state = status[platform.key];
            const isConnected = state.connected;
            const platformAccounts = accounts.filter((account) => account.platform === platform.key);

            return (
              <article
                key={platform.key}
                className={`platform-card${isConnected ? " connected" : ""}`}
              >
                <div className="platform-head">
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-display), sans-serif",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {platform.label}
                    </h3>
                    <p className="meta" style={{ margin: "8px 0 0" }}>
                      {platform.description}
                    </p>
                  </div>
                  <span className={`pill${isConnected ? " connected" : ""}`}>
                    {isConnected ? "Connected" : "Not connected"}
                  </span>
                </div>

                <div className="meta">
                  Active workspace accounts: <strong>{state.active_accounts}</strong>
                </div>

                <div className="meta" style={{ lineHeight: 1.55 }}>
                  <strong style={{ color: "var(--text)" }}>Allowed account types:</strong>{" "}
                  {platform.supportedTypes}
                </div>

                <div className="meta" style={{ lineHeight: 1.55 }}>
                  <strong style={{ color: "var(--text)" }}>Connection note:</strong>{" "}
                  {platform.unsupportedMessage}
                </div>

                {platformAccounts.length ? (
                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      padding: "12px 14px",
                      borderRadius: 16,
                      border: "1px solid var(--line)",
                      background: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    <div className="meta" style={{ color: "var(--text)", fontWeight: 700 }}>
                      Connected account{platformAccounts.length === 1 ? "" : "s"}
                    </div>
                    {platformAccounts.map((account) => (
                      <div
                        key={account.id}
                        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 700,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {account.account_name}
                          </div>
                          <div className="meta" style={{ fontSize: "0.84rem" }}>
                            {account.account_type
                              ? account.account_type.replace(/_/g, " ")
                              : "connected account"}
                          </div>
                        </div>
                        <span className={`pill${account.is_active ? " connected" : ""}`}>
                          {account.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty" style={{ padding: 16, textAlign: "left" }}>
                    No accounts linked yet for {platform.label}. Once connected, page, profile, or
                    channel names will appear here.
                  </div>
                )}

                <div className="cta-row">
                  <a
                    className="btn primary"
                    href={`${getApiBaseUrl()}/api/v1/oauth/${
                      platform.key === "youtube" ? "google" : platform.key
                    }/login?tenant_id=${getTenantId()}`}
                  >
                    {isConnected
                      ? `Add another ${platform.label} account`
                      : platform.connectLabel}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="card section">
        <h2 className="section-title">Workspace Accounts</h2>
        <p className="section-copy">
          A quick operational view of the accounts already stored inside this SnapKey tenant
          workspace.
        </p>
        {accounts.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Platform</th>
                  <th>Account type</th>
                  <th>Platform account ID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td>{account.account_name}</td>
                    <td style={{ textTransform: "capitalize" }}>{account.platform}</td>
                    <td>{account.account_type ? account.account_type.replace(/_/g, " ") : "-"}</td>
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

      <PostComposerModal onClose={() => setComposerOpen(false)} open={composerOpen} />
    </main>
  );
}
