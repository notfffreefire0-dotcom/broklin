
import React from 'react';
import { LayoutGrid, Archive, Settings, PenTool } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();



    const navItems = [
        { id: '/', label: 'Dashboard', icon: <LayoutGrid size={20} /> },
        { id: '/writer', label: 'Zen Writer', icon: <PenTool size={20} /> },
        { id: '/vault', label: 'Vault', icon: <Archive size={20} /> },
        { id: '/settings', label: 'Settings', icon: <Settings size={20} /> }
    ];

    return (
        <aside className="sidebar">

            <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 0' }}>
                <Logo size={32} animated={true} />
                <span style={{ fontSize: '1.2rem', fontWeight: '700', letterSpacing: '0.5px', background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Broklin
                </span>
            </div>
            <nav>
                {navItems.map(item => (
                    <a
                        key={item.id}
                        href="#"
                        className={location.pathname === item.id ? 'active' : ''}
                        onClick={(e) => { e.preventDefault(); navigate(item.id); }}
                    >
                        <span style={{ color: location.pathname === item.id ? 'var(--accent-cyan)' : 'inherit', display: 'flex' }}>{item.icon}</span>
                        {item.label}
                    </a>
                ))}
            </nav>
        </aside>
    );
}
