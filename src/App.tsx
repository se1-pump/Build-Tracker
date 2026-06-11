import { useState, useEffect } from "react";
import { AppProvider, useApp } from "./hooks/useApp";
import { Header } from "./components/Header";
import { SetupModal } from "./components/SetupModal";
import { FormPanel } from "./components/FormPanel";
import { HistoryPanel } from "./components/HistoryPanel";
import { Toast } from "./components/Toast";
import "./App.css";

function AppContent() {
  const { cfg, loadCSV } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("buildtrack_theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    if (!cfg) {
      setShowModal(true);
    } else {
      loadCSV();
    }
  }, [cfg, loadCSV]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("buildtrack_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <>
      <SetupModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <div className="app">
        <Header
          onSettingsClick={() => setShowModal(true)}
          theme={theme}
          onThemeToggle={toggleTheme}
        />

        <nav className="tab-nav">
          <button
            className={`tab-btn ${activeTab === "form" ? "active" : ""}`}
            onClick={() => setActiveTab("form")}
          >
            ＋ New Build
          </button>
          <button
            className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            ◈ History
          </button>
        </nav>

        {activeTab === "form" ? (
          <FormPanel onBuildSaved={() => setActiveTab("history")} />
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
