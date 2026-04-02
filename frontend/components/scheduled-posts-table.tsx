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

export function ScheduledPostsTable({
  posts,
  accounts,
}: {
  posts: Post[];
  accounts: Account[];
}) {
  const accountMap = new Map(accounts.map((account) => [account.id, account]));

  if (!posts.length) {
    return (
      <div className="empty">
        No scheduled posts yet. Create one from the universal composer.
      </div>
    );
  }

  return (
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
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => {
            const account = accountMap.get(post.social_account_id);

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
                  {post.error_message ? (
                    <div className="meta" style={{ color: "var(--danger)", marginTop: 8 }}>
                      {post.error_message}
                    </div>
                  ) : null}
                </td>
                <td>{formatDate(post.scheduled_at)}</td>
                <td>
                  <span className={`status ${post.status}`}>{post.status}</span>
                </td>
                <td>
                  {post.retry_count} / {post.max_retries}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
