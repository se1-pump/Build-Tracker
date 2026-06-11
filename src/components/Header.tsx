import { useApp } from "../hooks/useApp";

interface HeaderProps {
  onSettingsClick: () => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
}

export function Header({ onSettingsClick, theme, onThemeToggle }: HeaderProps) {
  const { cfg, syncStatus } = useApp();

  const statusConfig = {
    synced: { label: "SYNCED", dotColor: "#10b981" },
    syncing: { label: "SYNCING…", dotColor: "#f59e0b" },
    offline: { label: "ERROR", dotColor: "#ef4444" },
  };

  const status = statusConfig[syncStatus];
  const repoUrl = cfg
    ? `https://github.com/${cfg.owner}/${cfg.repo}/blob/${cfg.branch}/${cfg.file}`
    : "#";
  const repoText = cfg ? `${cfg.owner}/${cfg.repo}/${cfg.file}` : "—";

  return (
    <header>
      <div className="logo">
        <div className="logo-icon">⚡</div>
        <div className="logo-text">
          <h1>BuildTrack</h1>
          <span>Version History Manager</span>
        </div>
      </div>
      <div className="header-right">
        <div className="repo-pill">
          📄{" "}
          <a href={repoUrl} target="_blank">
            {repoText}
          </a>
        </div>
        <div className={`status-badge ${syncStatus}`}>
          <span className="status-dot"></span>
          <span>{status.label}</span>
        </div>
        <button className="btn-settings" onClick={onThemeToggle}>
          {theme === "dark" ? "☀ Light" : "🌙 Dark"}
        </button>
        <button className="btn-settings" onClick={onSettingsClick}>
          ⚙ Settings
        </button>
      </div>
    </header>
  );
}
