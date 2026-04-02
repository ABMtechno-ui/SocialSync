"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { createPost, fetchAccounts, fetchMedia, uploadMedia } from "@/lib/api";
import { Account, MediaAsset, PlatformName } from "@/lib/types";

const platformKeys: PlatformName[] = [
  "facebook",
  "instagram",
  "linkedin",
  "twitter",
  "youtube",
];

const starterPlatformOptions: Record<PlatformName, Record<string, unknown>> = {
  facebook: { post_as_reel: false },
  instagram: { caption_style: "feed" },
  linkedin: { visibility: "PUBLIC" },
  twitter: { reply_settings: "everyone" },
  youtube: { title: "", privacyStatus: "private" },
};

export function PostComposer() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [selectedMediaIds, setSelectedMediaIds] = useState<number[]>([]);
  const [platformOptionsText, setPlatformOptionsText] = useState(
    JSON.stringify(starterPlatformOptions, null, 2),
  );
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [accountData, mediaData] = await Promise.all([fetchAccounts(), fetchMedia()]);
        const activeAccounts = accountData.filter((account) => account.is_active);
        setAccounts(activeAccounts);
        setMedia(mediaData);
        if (activeAccounts.length) {
          setSelectedAccountId(activeAccounts[0].id);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load form data.");
      }
    }

    void load();
  }, []);

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === selectedAccountId) ?? null,
    [accounts, selectedAccountId],
  );

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fileInput = event.currentTarget.elements.namedItem("mediaFile") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (!file) {
      setError("Choose a file before uploading.");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setMessage(null);

      const formData = new FormData();
      formData.append("file", file);
      if (altText.trim()) {
        formData.append("alt_text", altText.trim());
      }

      const uploaded = await uploadMedia(formData);
      setMedia((current) => [uploaded, ...current]);
      setSelectedMediaIds((current) => [uploaded.id, ...current]);
      setAltText("");
      event.currentTarget.reset();
      setMessage("Media uploaded and ready for the next post.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Media upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedAccountId) {
      setError("Select a connected account before creating a post.");
      return;
    }

    let parsedPlatformOptions: Record<string, unknown> = {};
    try {
      parsedPlatformOptions = JSON.parse(platformOptionsText);
    } catch {
      setError("Platform metadata JSON is not valid.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);

      const result = await createPost({
        social_account_id: selectedAccountId,
        content,
        scheduled_at: scheduledAt || null,
        media_ids: selectedMediaIds,
        platform_options: parsedPlatformOptions,
      });

      setMessage(`Post #${result.post_id} created with status "${result.status}".`);
      setContent("");
      setScheduledAt("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Post creation failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid two">
      <section className="card section">
        <h2 className="section-title">Universal Composer</h2>
        <p className="section-copy">
          Pick one connected account, write your main content, attach uploaded media,
          and send platform-specific metadata as JSON.
        </p>

        {message ? <div className="banner success">{message}</div> : null}
        {error ? <div className="banner error">{error}</div> : null}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="account">Connected account</label>
            <select
              id="account"
              value={selectedAccountId ?? ""}
              onChange={(event) => setSelectedAccountId(Number(event.target.value))}
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.account_name} ({account.platform})
                </option>
              ))}
            </select>
            <div className="inline-note">
              Current platform: {selectedAccount ? selectedAccount.platform : "No account selected"}
            </div>
          </div>

          <div className="field">
            <label htmlFor="content">Universal content</label>
            <textarea
              id="content"
              placeholder="Write the shared message, caption, or publishing notes."
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="scheduledAt">Schedule time</label>
            <input
              id="scheduledAt"
              type="datetime-local"
              value={scheduledAt}
              onChange={(event) => setScheduledAt(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="platformOptions">Platform metadata JSON</label>
            <textarea
              id="platformOptions"
              value={platformOptionsText}
              onChange={(event) => setPlatformOptionsText(event.target.value)}
            />
          </div>

          <div className="field">
            <label>Attach existing media</label>
            <div className="checkbox-grid">
              {media.map((asset) => {
                const checked = selectedMediaIds.includes(asset.id);
                return (
                  <label key={asset.id} className="checkbox-card">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelectedMediaIds((current) => [...current, asset.id]);
                        } else {
                          setSelectedMediaIds((current) => current.filter((item) => item !== asset.id));
                        }
                      }}
                    />
                    <div>
                      <strong>
                        #{asset.id} {asset.file_type}
                      </strong>
                      <div className="meta">{asset.alt_text || asset.file_url}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <button className="btn primary" disabled={submitting} type="submit">
            {submitting ? "Creating..." : "Create Post"}
          </button>
        </form>
      </section>

      <section className="card section">
        <h2 className="section-title">Media Upload</h2>
        <p className="section-copy">
          Upload media to the backend first. New assets appear immediately in the selection list.
        </p>

        <form className="form-grid" onSubmit={handleUpload}>
          <div className="field">
            <label htmlFor="mediaFile">Media file</label>
            <input id="mediaFile" name="mediaFile" type="file" />
          </div>

          <div className="field">
            <label htmlFor="altText">Alt text</label>
            <input
              id="altText"
              type="text"
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              placeholder="Describe the image or video for accessibility."
            />
          </div>

          <button className="btn secondary" disabled={uploading} type="submit">
            {uploading ? "Uploading..." : "Upload Media"}
          </button>
        </form>

        <div style={{ marginTop: 24 }}>
          <h3 style={{ marginTop: 0 }}>Starter metadata ideas</h3>
          <div className="meta">
            {platformKeys.map((platform) => (
              <div key={platform} style={{ marginBottom: 10 }}>
                <strong style={{ textTransform: "capitalize" }}>{platform}</strong>
                <pre
                  style={{
                    margin: "8px 0 0",
                    whiteSpace: "pre-wrap",
                    background: "rgba(255,255,255,0.82)",
                    borderRadius: 16,
                    border: "1px solid var(--line)",
                    padding: 14,
                    overflowX: "auto",
                  }}
                >
                  {JSON.stringify(starterPlatformOptions[platform], null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
