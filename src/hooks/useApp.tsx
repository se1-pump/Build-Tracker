import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Build, Config, SyncStatus } from '../types';
import { parseCSV, buildsToCSV } from '../utils';
import {
  loadCSVFromGitHub,
  saveCSVToGitHub,
} from '../services/githubService';

interface AppContextType {
  // Config
  cfg: Config | null;
  setCfg: (cfg: Config) => void;

  // Builds
  builds: Build[];
  setBuilds: (builds: Build[]) => void;

  // GitHub state
  fileSHA: string | null;
  setFileSHA: (sha: string | null) => void;
  syncStatus: SyncStatus;
  setSyncStatus: (status: SyncStatus) => void;

  // Check states
  checkStates: Record<number, boolean>;
  setCheckStates: (states: Record<number, boolean>) => void;
  toggleCheck: (index: number) => void;

  // Toast
  showToast: (msg: string, isError?: boolean) => void;
  toastMsg: string;
  toastIsError: boolean;

  // Operations
  loadCSV: () => Promise<void>;
  saveBuild: (build: Build) => Promise<void>;
  deleteBuild: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cfg, setCfg] = useState<Config | null>(() => {
    const saved = localStorage.getItem('buildtrack_cfg');
    return saved ? JSON.parse(saved) : null;
  });

  const [builds, setBuilds] = useState<Build[]>([]);
  const [fileSHA, setFileSHA] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline');
  const [checkStates, setCheckStates] = useState<Record<number, boolean>>(
    Object.fromEntries(Array.from({ length: 10 }, (_, i) => [i, false]))
  );
  const [toastMsg, setToastMsg] = useState('');
  const [toastIsError, setToastIsError] = useState(false);

  const showToast = (msg: string, isError = false) => {
    setToastMsg(msg);
    setToastIsError(isError);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const toggleCheck = (index: number) => {
    setCheckStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const loadCSV = async () => {
    if (!cfg) return;
    setSyncStatus('syncing');
    try {
      const result = await loadCSVFromGitHub(cfg);
      if (!result) {
        setBuilds([]);
        setFileSHA(null);
      } else {
        setBuilds(parseCSV(result.content));
        setFileSHA(result.sha);
      }
      setSyncStatus('synced');
    } catch (e) {
      setSyncStatus('offline');
      showToast('Could not load CSV from GitHub.', true);
    }
  };

  const saveBuild = async (build: Build) => {
    if (!cfg) {
      showToast('Not connected to GitHub.', true);
      return;
    }

    setSyncStatus('syncing');
    try {
      const newBuilds = [build, ...builds];
      const content = buildsToCSV(newBuilds);
      const newSHA = await saveCSVToGitHub(
        cfg,
        content,
        fileSHA,
        `chore: add build ${build.version} [${build.date}]`
      );
      setBuilds(newBuilds);
      setFileSHA(newSHA);
      setSyncStatus('synced');
      showToast(`✓ Build ${build.version} saved to GitHub`);
    } catch (e) {
      setSyncStatus('offline');
      showToast(
        e instanceof Error ? e.message : 'Save failed.',
        true
      );
    }
  };

  const deleteBuild = async (id: string) => {
    if (!cfg) {
      showToast('Not connected to GitHub.', true);
      return;
    }

    setSyncStatus('syncing');
    try {
      const newBuilds = builds.filter((b) => b.id !== id);
      const content = buildsToCSV(newBuilds);
      const newSHA = await saveCSVToGitHub(
        cfg,
        content,
        fileSHA,
        `chore: delete build ${id}`
      );
      setBuilds(newBuilds);
      setFileSHA(newSHA);
      setSyncStatus('synced');
      showToast('Build deleted.');
    } catch (e) {
      setSyncStatus('offline');
      showToast('Delete failed.', true);
    }
  };

  return (
    <AppContext.Provider
      value={{
        cfg,
        setCfg,
        builds,
        setBuilds,
        fileSHA,
        setFileSHA,
        syncStatus,
        setSyncStatus,
        checkStates,
        setCheckStates,
        toggleCheck,
        showToast,
        toastMsg,
        toastIsError,
        loadCSV,
        saveBuild,
        deleteBuild,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
