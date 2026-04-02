"use client";

import { getOAuthLoginUrl } from "@/lib/api";
import { AccountStatusResponse, PlatformName } from "@/lib/types";

const platforms: Array<{
  key: PlatformName;
  label: string;
  description: string;
}> = [
  { key: "facebook", label: "Facebook", description: "Pages, engagement, and Instagram-linked publishing flows." },
  { key: "instagram", label: "Instagram", description: "Feed, reels, and visual storytelling entrypoint." },
  { key: "linkedin", label: "LinkedIn", description: "Professional updates, link posts, and network publishing." },
  { key: "twitter", label: "Twitter / X", description: "Fast updates, threads, and real-time campaign messaging." },
  { key: "youtube", label: "YouTube", description: "Long-form video publishing with channel-connected posting." },
];

export function PlatformCards({
  accountStatus,
}: {
  accountStatus: AccountStatusResponse;
}) {
  return (
    <div className="grid three">
      {platforms.map((platform) => {
        const state = accountStatus[platform.key];
        const isConnected = state.connected;

        return (
          <article
            key={platform.key}
            className={`platform-card${isConnected ? " connected" : ""}`}
          >
            <div className="platform-head">
              <div>
                <h3 style={{ margin: 0 }}>{platform.label}</h3>
                <p className="meta" style={{ margin: "8px 0 0" }}>
                  {platform.description}
                </p>
              </div>
              <span className={`pill${isConnected ? " connected" : ""}`}>
                {isConnected ? "Connected" : "Not connected"}
              </span>
            </div>

            <div className="meta">
              Active accounts: <strong>{state.active_accounts}</strong>
            </div>

            <div className="cta-row">
              <a className="btn primary" href={getOAuthLoginUrl(platform.key)}>
                {isConnected ? "Reconnect" : "Connect"}
              </a>
            </div>
          </article>
        );
      })}
    </div>
  );
}
