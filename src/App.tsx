import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './hooks/useApp';
import { Header } from './components/Header';
import { SetupModal } from './components/SetupModal';
import { FormPanel } from './components/FormPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { Toast } from './components/Toast';
import './App.css';

function AppContent() {
  const { cfg, loadCSV } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');

  useEffect(() => {
    if (!cfg) {
      setShowModal(true);
    } else {
      loadCSV();
    }
  }, [cfg, loadCSV]);

  return (
    <>
      <SetupModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <div className="app">
        <Header onSettingsClick={() => setShowModal(true)} />

        <nav className="tab-nav">
          <button
            className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            ＋ New Build
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            ◈ History
          </button>
        </nav>

        {activeTab === 'form' ? (
          <FormPanel onBuildSaved={() => setActiveTab('history')} />
        ) : (
          <HistoryPanel />
        )}
      </div>

      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
