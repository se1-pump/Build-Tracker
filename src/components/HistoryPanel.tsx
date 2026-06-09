import { useState, useMemo } from 'react';
import { useApp } from '../hooks/useApp';
import { CHECKS, fmtDate, esc } from '../utils';
import type { Build } from '../types';

export function HistoryPanel() {
  const { builds, deleteBuild } = useApp();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return builds.filter(
      (b) =>
        !q ||
        (b.project || '').toLowerCase().includes(q) ||
        (b.version || '').toLowerCase().includes(q) ||
        (b.commit || '').toLowerCase().includes(q) ||
        (b.features || '').toLowerCase().includes(q) ||
        (b.date || '').includes(q)
    );
  }, [builds, search]);

  const stats = useMemo(() => {
    const total = builds.length;
    const fullPass = builds.filter((b) => {
      const br = b as Record<string, any>;
      const checks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
        (i) => br[`check_${i}`] === true
      );
      return checks.every(Boolean);
    }).length;
    const lastDate = total ? fmtDate(builds[0].date) : '—';
    const avgChecks = total
      ? Math.round(
          builds.reduce(
            (s, b) => {
              const br = b as Record<string, any>;
              const checkCount = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
                (i) => br[`check_${i}`] === true
              ).length;
              return s + checkCount;
            },
            0
          ) / total
        )
      : 0;

    return { total, fullPass, lastDate, avgChecks };
  }, [builds]);

  return (
    <div id="panel-history" className="panel active">
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Builds</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent3)' }}>
            {stats.fullPass}
          </div>
          <div className="stat-label">Full Pass</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--warn)' }}>
            {stats.avgChecks}
          </div>
          <div className="stat-label">Avg Checks</div>
        </div>
        <div className="stat-card">
          <div
            className="stat-value"
            style={{
              color: 'var(--accent2)',
              fontSize: stats.total ? '16px' : '26px',
            }}
          >
            {stats.lastDate}
          </div>
          <div className="stat-label">Last Build</div>
        </div>
      </div>

      <div className="history-controls">
        <input
          className="search-box"
          type="text"
          placeholder="Search version, commit, features…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="build-count">
          {filtered.length} build{filtered.length !== 1 ? 's' : ''}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: 'auto' }}>
          <button className="btn btn-secondary" onClick={() => downloadCSV()}>
            ⬇ CSV
          </button>
          <button className="btn btn-secondary" onClick={() => downloadJSON()}>
            ⬇ JSON
          </button>
        </div>
      </div>

      <div className="build-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <h3>{builds.length === 0 ? 'No builds yet' : 'No results found'}</h3>
            <p>
              {builds.length === 0
                ? 'Save your first build using the "New Build" tab.'
                : 'Try a different search term.'}
            </p>
          </div>
        ) : (
          filtered.map((b) => <BuildCard key={b.id} build={b} onDelete={deleteBuild} />)
        )}
      </div>
    </div>
  );
}

interface BuildCardProps {
  build: Build;
  onDelete: (id: string) => Promise<void>;
}

function BuildCard({ build, onDelete }: BuildCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const br = build as Record<string, any>;
  const cv = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
    (i) => br[`check_${i}`] === true
  );
  const pass = cv.filter(Boolean).length;
  const health =
    pass === 10
      ? { l: `✓ ${pass}/10 Pass`, c: 'pass' }
      : pass >= 7
      ? { l: `⚠ ${pass}/10 Pass`, c: 'partial' }
      : { l: `✗ ${pass}/10 Pass`, c: 'fail' };

  const handleDelete = async () => {
    if (!confirm('Delete this build from the CSV on GitHub?')) return;
    setDeleting(true);
    await onDelete(build.id);
    setDeleting(false);
  };

  return (
    <div className={`build-card ${expanded ? 'expanded' : ''}`}>
      <div className="build-header" onClick={() => setExpanded(!expanded)}>
        <div className="build-meta">
          <span className="version-badge">{esc(build.project || '—')}</span>
          <span className="version-badge">{esc(build.version)}</span>
          <span className="build-date">📅 {fmtDate(build.date)}</span>
          {build.commit && build.commit !== '—' ? (
            <span className="commit-id">
              {esc(String(build.commit).substring(0, 12))}
            </span>
          ) : null}
        </div>
        <div className={`health-indicator ${health.c}`}>{health.l}</div>
        <button className="expand-btn">▾</button>
      </div>
      {expanded && (
        <div className="build-body">
          <div className="build-body-grid">
            <div>
              <div className="build-section-title">Features</div>
              <div className="features-list">{esc(build.features || '—')}</div>
              {build.notes ? (
                <>
                  <div className="build-section-title" style={{ marginTop: '14px' }}>
                    Notes
                  </div>
                  <div className="features-list">{esc(build.notes)}</div>
                </>
              ) : null}
            </div>
            <div>
              <div className="build-section-title">Checklist</div>
              <div className="mini-checklist">
                {CHECKS.map((label, i) => (
                  <div key={i} className={`mini-check ${cv[i] ? 'pass' : 'fail'}`}>
                    <span>{cv[i] ? '✓' : '○'}</span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="build-actions">
            <button className="btn btn-secondary" style={{ fontSize: '11px', padding: '8px 14px' }}>
              ↑ Load
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting}
              style={{ fontSize: '11px', padding: '8px 14px' }}
            >
              {deleting ? 'Deleting...' : '✕ Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function downloadCSV() {
  // TODO: Implement download
}

function downloadJSON() {
  // TODO: Implement download
}
