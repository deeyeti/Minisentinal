// ============================================
// MiniSentinel — Main Application
// ============================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ShaderBackground } from './components/ShaderBackground';
import { Dashboard } from './pages/Dashboard';
import { LogsExplorer } from './pages/LogsExplorer';
import { AlertsPanel } from './pages/AlertsPanel';
import { RulesConfig } from './pages/RulesConfig';
import './styles/index.css';

function AppContent() {
  return (
    <>
      {/* Shader Background */}
      <ShaderBackground />

      {/* Main Layout */}
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/logs" element={<LogsExplorer />} />
            <Route path="/alerts" element={<AlertsPanel />} />
            <Route path="/rules" element={<RulesConfig />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter basename="/minisentinal">
      <AppContent />
    </BrowserRouter>
  );
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <h1 className="loading-title">MiniSentinel</h1>
        <p className="loading-subtitle">Initializing SIEM Dashboard...</p>
        <div className="loading-bar">
          <div className="loading-progress" />
        </div>
      </div>
      <style>{`
        .loading-screen {
          position: fixed;
          inset: 0;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        
        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        
        .loading-logo {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #00ffff, #00ff88);
          border-radius: 16px;
          color: #000;
          animation: pulse 2s ease-in-out infinite;
        }
        
        .loading-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #00ffff, #00ff88);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .loading-subtitle {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.875rem;
          color: #666;
        }
        
        .loading-bar {
          width: 200px;
          height: 3px;
          background: #1a1a1a;
          border-radius: 3px;
          overflow: hidden;
        }
        
        .loading-progress {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #00ffff, #00ff88);
          animation: loading 0.8s ease-out forwards;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
          50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(0, 255, 255, 0.8); }
        }
        
        @keyframes loading {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export default App;
