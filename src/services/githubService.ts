import type { Config } from '../types';

export async function ghFetch(
  url: string,
  token: string,
  opts: RequestInit = {}
): Promise<Response> {
  return fetch(url, {
    ...opts,
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
}

export async function loadCSVFromGitHub(
  cfg: Config
): Promise<{ content: string; sha: string } | null> {
  try {
    const r = await ghFetch(
      `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${cfg.file}?ref=${cfg.branch}`,
      cfg.token
    );
    if (r.status === 404) {
      return null;
    }
    if (!r.ok) throw new Error('Failed to load CSV');
    const data = (await r.json()) as { sha: string; content: string };
    const text = atob(data.content.replace(/\n/g, ''));
    return { content: text, sha: data.sha };
  } catch (e) {
    throw new Error('Could not load CSV from GitHub.');
  }
}

export async function saveCSVToGitHub(
  cfg: Config,
  content: string,
  fileSHA: string | null,
  message: string
): Promise<string> {
  const encodedContent = btoa(unescape(encodeURIComponent(content)));
  const body = {
    message,
    content: encodedContent,
    branch: cfg.branch,
    ...(fileSHA && { sha: fileSHA }),
  };

  const r = await ghFetch(
    `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${cfg.file}`,
    cfg.token,
    { method: 'PUT', body: JSON.stringify(body) }
  );

  if (!r.ok) {
    const d = (await r.json()) as { message: string };
    throw new Error(d.message || 'GitHub write failed');
  }

  const data = (await r.json()) as { content: { sha: string } };
  return data.content.sha;
}

export async function verifyGitHubAccess(
  owner: string,
  repo: string,
  token: string
): Promise<boolean> {
  try {
    const r = await ghFetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      token
    );
    return r.ok;
  } catch {
    return false;
  }
}
