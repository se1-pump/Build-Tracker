export interface Build {
  id: string;
  date: string;
  project: string;
  version: string;
  commit: string;
  features: string;
  notes: string;
  check_0: boolean;
  check_1: boolean;
  check_2: boolean;
  check_3: boolean;
  check_4: boolean;
  check_5: boolean;
  check_6: boolean;
  check_7: boolean;
  check_8: boolean;
  check_9: boolean;
  savedAt: string;
}

export interface Config {
  owner: string;
  repo: string;
  file: string;
  branch: string;
  token: string;
}

export interface GitHubContent {
  sha: string;
  content: string;
}

export type SyncStatus = 'synced' | 'syncing' | 'offline';
