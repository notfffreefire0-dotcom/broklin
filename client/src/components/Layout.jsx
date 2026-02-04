
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Plus, Cloud, Download } from 'lucide-react';

export default function Layout({ onAdd, onSync }) {
    const location = useLocation();

    const getTitle = () => {
        switch (location.pathname) {
            case '/': return 'My Brain';
            case '/vault': return 'Vault';
            case '/settings': return 'Settings';
            default: return 'Dashboard';
        }
    };

    return (
        <div className="layout">
            <Sidebar />
            <main className="main-content">
                <header className="topbar">
                    <h1>{getTitle()}</h1>
                    <div className="actions" style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-glass" onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/export`, '_blank')}>
                            <Download size={16} /> Export
                        </button>
                        <button className="btn btn-glass" onClick={onSync}>
                            <Cloud size={16} /> Sync
                        </button>
                        <button className="btn btn-primary" onClick={onAdd}>
                            <Plus size={18} /> Add Item
                        </button>
                    </div>
                </header>

                <div className="content-grid">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
