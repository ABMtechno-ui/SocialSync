"use client";

import { useEffect, useState } from "react";

import { EditPostModal } from "@/components/edit-post-modal";
import { cancelPost, fetchAccounts, fetchPosts, publishPostNow } from "@/lib/api";
import { Account, Post } from "@/lib/types";

function formatDate(value?: string | null) {
  if (!value) {
    return "Not scheduled";
  }

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyPostId, setBusyPostId] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  async function load() {
    try {
      const [postData, accountData] = await Promise.all([fetchPosts(), fetchAccounts()]);
      setPosts(postData);
      setAccounts(accountData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load posts.");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handlePublishNow(postId: number) {
    try {
      setBusyPostId(postId);
      setError(null);
      await publishPostNow(postId);
      await load();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Unable to publish post.");
    } finally {
      setBusyPostId(null);
    }
  }

  async function handleCancel(postId: number) {
    try {
      setBusyPostId(postId);
      setError(null);
      await cancelPost(postId);
      await load();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Unable to cancel post.");
    } finally {
      setBusyPostId(null);
    }
  }

  return (
    <main className="card section">
      <div className="ops-header">
        <div>
          <h2 className="section-title">Scheduled Posts</h2>
          <p className="section-copy">
            Track queued, scheduled, processing, posted, failed, and cancelled work from one clean
            execution view inside SnapKey CRM.
          </p>
        </div>
      </div>

      {error ? <div className="banner error">{error}</div> : null}

      {posts.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Account</th>
                <th>Platform</th>
                <th>Content</th>
                <th>Scheduled</th>
                <th>Status</th>
                <th>Retries</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
                const account = accounts.find((item) => item.id === post.social_account_id);

                return (
                  <tr key={post.id}>
                    <td>#{post.id}</td>
                    <td>
                      <strong>{account?.account_name ?? "Unknown account"}</strong>
                      <div className="meta">{account?.platform_account_id ?? "N/A"}</div>
                    </td>
                    <td style={{ textTransform: "capitalize" }}>{post.platform}</td>
                    <td>
                      <div>{post.content || "No content"}</div>
                      {post.media_ids.length ? (
                        <div className="helper-text" style={{ marginTop: 8 }}>
                          Attached media: {post.media_ids.join(", ")}
                        </div>
                      ) : null}
                      {post.error_message ? (
                        <div className="meta" style={{ color: "var(--danger)", marginTop: 8 }}>
                          {post.error_message}
                        </div>
                      ) : null}
                    </td>
                    <td>{formatDate(post.scheduled_at)}</td>
                    <td>
                      <span className={`status ${post.status}`}>{post.status}</span>
                      <div className="helper-text" style={{ marginTop: 8 }}>
                        {post.posted_at
                          ? `Completed ${formatDate(post.posted_at)}`
                          : "Awaiting execution"}
                      </div>
                    </td>
                    <td>
                      {post.retry_count} / {post.max_retries}
                    </td>
                    <td>
                      <div className="cta-row">
                        <button
                          className="btn ghost"
                          disabled={
                            busyPostId === post.id ||
                            post.status === "posted" ||
                            post.status === "processing" ||
                            post.status === "cancelled"
                          }
                          onClick={() => setEditingPost(post)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="btn secondary"
                          disabled={
                            busyPostId === post.id ||
                            post.status === "posted" ||
                            post.status === "processing"
                          }
                          onClick={() => void handlePublishNow(post.id)}
                          type="button"
                        >
                          {busyPostId === post.id ? "Working..." : "Publish now"}
                        </button>
                        <button
                          className="btn secondary"
                          disabled={
                            busyPostId === post.id ||
                            post.status === "posted" ||
                            post.status === "cancelled"
                          }
                          onClick={() => void handleCancel(post.id)}
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty">No scheduled posts yet. Create one from the dashboard modal.</div>
      )}
      <EditPostModal onClose={() => setEditingPost(null)} onSaved={load} post={editingPost} />
    </main>
  );
}
