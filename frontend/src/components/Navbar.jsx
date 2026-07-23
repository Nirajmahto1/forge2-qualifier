import React from 'react';
import { Layout, Users, Plus, Cpu, RefreshCw, Database } from 'lucide-react';

export default function Navbar({ boards, activeBoard, onSelectBoard, onCreateBoard, onOpenMembers, isLiveConnected, onRetrySync }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-logo">
          <Layout className="logo-icon" />
        </div>
        <div className="brand-title">
          <h1>Forge Kanban</h1>
          <span className="brand-badge">Forge 2 Qualifier</span>
        </div>
      </div>

      <div className="navbar-controls">
        <div className="board-selector">
          <label htmlFor="board-select" className="sr-only">Select Board</label>
          <select 
            id="board-select"
            value={activeBoard?.id || ''} 
            onChange={(e) => onSelectBoard(Number(e.target.value))}
            className="board-select"
          >
            {boards.map(board => (
              <option key={board.id} value={board.id}>{board.name}</option>
            ))}
          </select>
          <button onClick={onCreateBoard} className="btn-secondary btn-icon-only" title="New Board">
            <Plus size={18} />
          </button>
        </div>

        <button onClick={onOpenMembers} className="btn-secondary">
          <Users size={16} />
          <span>Members</span>
        </button>

        {isLiveConnected ? (
          <div className="agent-status-pill live-db-pill" title="Connected to Live Render SQLite API">
            <Database size={14} className="agent-icon" />
            <span className="pulse-dot green-dot"></span>
            <span className="status-text">Live DB</span>
          </div>
        ) : (
          <button onClick={onRetrySync} className="btn-secondary sync-db-btn" title="Click to sync with Live Render Database">
            <RefreshCw size={14} className="spin-icon" />
            <span>Sync Live DB</span>
          </button>
        )}

        <div className="agent-status-pill" title="Hermes & OpenClaw Connected">
          <Cpu size={14} className="agent-icon" />
          <span className="pulse-dot"></span>
          <span className="status-text">Agents Active</span>
        </div>
      </div>
    </header>
  );
}
