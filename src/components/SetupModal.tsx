import { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { verifyGitHubAccess } from '../services/githubService';

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SetupModal({ isOpen, onClose }: SetupModalProps) {
  const { setCfg, loadCSV } = useApp();
  const [owner, setOwner] = useState('se1-pump');
  const [repo, setRepo] = useState('Build-Tracker');
  const [file, setFile] = useState('build_history.csv');
  const [branch, setBranch] = useState('main');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setError('');
    if (!owner.trim() || !repo.trim() || !token.trim()) {
      setError('Username, repo, and token are required.');
      return;
    }

    setLoading(true);
    try {
      const isValid = await verifyGitHubAccess(owner, repo, token);
      if (!isValid) {
        setError(
          'Could not access repo. Check username, repo name, and token scopes.'
        );
        return;
      }

      const cfg = {
        owner,
        repo,
        file,
        branch,
        token,
      };
      localStorage.setItem('buildtrack_cfg', JSON.stringify(cfg));
      setCfg(cfg);
      await loadCSV();
      onClose();
    } catch (e) {
      setError('Network error. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>⚡ Connect to GitHub</h2>
        <p>
          BuildTrack saves your build history directly to a{' '}
          <strong>CSV file in your GitHub repo</strong>.<br />
          Your token is stored only in your browser's <code>localStorage</code>{' '}
          — never sent anywhere except GitHub's API.
        </p>

        <ol className="modal-steps">
          <li>
            Go to{' '}
            <a href="https://github.com/settings/tokens/new" target="_blank">
              github.com/settings/tokens/new
            </a>
          </li>
          <li>
            Name it <code>buildtrack</code>, set expiry as you wish
          </li>
          <li>
            Under <strong>Scopes</strong>, tick <code>repo</code> (full repo
            access)
          </li>
          <li>
            Click <strong>Generate token</strong> and paste it below
          </li>
        </ol>

        <div className="form-group" style={{ marginBottom: '14px' }}>
          <label>GitHub Username</label>
          <input
            type="text"
            placeholder="your-username"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ marginBottom: '14px' }}>
          <label>Repository Name</label>
          <input
            type="text"
            placeholder="my-repo  (must exist on GitHub)"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ marginBottom: '14px' }}>
          <label>CSV filename (path in repo)</label>
          <input
            type="text"
            placeholder="build_history.csv"
            value={file}
            onChange={(e) => setFile(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ marginBottom: '14px' }}>
          <label>Branch</label>
          <input
            type="text"
            placeholder="main"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ marginBottom: '6px' }}>
          <label>Personal Access Token</label>
          <input
            type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
        <div className="modal-err">{error}</div>
        <div className="actions" style={{ marginTop: '20px', paddingTop: 0, borderTop: 'none' }}>
          <button
            className="btn btn-primary btn-full"
            onClick={handleConnect}
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : null}
            {loading ? ' Verifying…' : 'Connect & Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
