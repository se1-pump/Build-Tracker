import { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { CHECKS, today, toIST } from '../utils';

export function FormPanel({ onBuildSaved }: { onBuildSaved: () => void }) {
  const { checkStates, toggleCheck, saveBuild } = useApp();
  const [date, setDate] = useState(today());
  const [project, setProject] = useState('Stage 123');
  const [version, setVersion] = useState('');
  const [commit, setCommit] = useState('');
  const [features, setFeatures] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const checkedCount = Object.values(checkStates).filter(Boolean).length;

  const handleSave = async () => {
    if (!date || !project || !version.trim()) {
      alert('Build Date, Project, and Version are required.');
      return;
    }

    setSaving(true);
    try {
      const build = {
        id: Date.now().toString(),
        date,
        project,
        version: version.trim(),
        commit: commit.trim() || '—',
        features: features.trim() || '—',
        notes: notes.trim() || '',
        check_0: checkStates[0],
        check_1: checkStates[1],
        check_2: checkStates[2],
        check_3: checkStates[3],
        check_4: checkStates[4],
        check_5: checkStates[5],
        check_6: checkStates[6],
        check_7: checkStates[7],
        check_8: checkStates[8],
        check_9: checkStates[9],
        savedAt: toIST(new Date()),
      };

      await saveBuild(build);
      clearForm();
      onBuildSaved();
    } finally {
      setSaving(false);
    }
  };

  const clearForm = () => {
    setDate(today());
    setProject('Stage 123');
    setVersion('');
    setCommit('');
    setFeatures('');
    setNotes('');
  };

  return (
    <div id="panel-form" className="panel active">
      <div className="card">
        <div className="card-title">
          <span className="dot"></span> Build Information
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Build Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Project</label>
            <select value={project} onChange={(e) => setProject(e.target.value)}>
              <option value="Stage 123">Stage 123</option>
              <option value="Stage 4">Stage 4</option>
              <option value="BMC">BMC</option>
            </select>
          </div>
          <div className="form-group">
            <label>Build Version</label>
            <input
              type="text"
              placeholder="e.g. v2.4.1"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Git Commit ID</label>
            <input
              type="text"
              placeholder="e.g. a3f8b2d or full SHA"
              value={commit}
              onChange={(e) => setCommit(e.target.value)}
            />
          </div>
          <div className="form-group full">
            <label>Features Included in Release</label>
            <textarea
              placeholder="• Feature 1&#10;• Feature 2&#10;• Bug fix #42"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group full">
            <label>Notes / Remarks</label>
            <textarea
              placeholder="Known issues, context…"
              style={{ minHeight: '60px' }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span className="dot"></span> Build Checklist
        </div>
        <div className="checklist-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(checkedCount / 10) * 100}%` }}
            ></div>
          </div>
          <div className="progress-label">
            {checkedCount} / 10
          </div>
        </div>
        <div className="checklist-grid">
          {CHECKS.map((label, i) => (
            <div
              key={i}
              className={`check-item ${checkStates[i] ? 'checked' : ''}`}
              onClick={() => toggleCheck(i)}
            >
              <div className="check-box">{checkStates[i] ? '✓' : ''}</div>
              <div className="check-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="actions">
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <span className="spinner"></span> : null}
          {saving ? ' Saving…' : '💾 Save to GitHub'}
        </button>
        <button className="btn btn-secondary" onClick={clearForm}>
          ↺ Clear
        </button>
      </div>
    </div>
  );
}
