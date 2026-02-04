
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Save } from 'lucide-react';

export default function Settings() {
    const { user, logout } = useAuth();
    // In a real app, we'd update these in the backend
    const [username, setUsername] = useState(user?.username || '');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'deep-space');

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLogout = () => {
        if (confirm("Are you sure you want to log out? Unsaved notes might be lost if not explicitly saved.")) {
            logout();
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', fontSize: '1.8rem' }}>
                <User size={28} color="var(--accent-fuchsia)" />
                Profile & Settings
            </h2>

            <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'var(--gradient-main)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '30px', fontWeight: 'bold'
                }}>
                    {user?.avatar ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : username[0]?.toUpperCase()}
                </div>
                <div>
                    <h3 style={{ margin: 0 }}>{user?.username}</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Productivity Master</p>
                </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Display Name</label>
                <input
                    type="text"
                    value={username}
                    readOnly
                    className="glass-input"
                    style={{
                        width: '100%', padding: '12px',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)',
                        borderRadius: '8px', color: 'var(--text-primary)', cursor: 'not-allowed'
                    }}
                />

                <small style={{ color: 'var(--text-secondary)' }}>Username changes are currently disabled.</small>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Theme</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {['deep-space', 'oceanic', 'sunset', 'midnight'].map(t => (
                        <button
                            key={t}
                            onClick={() => handleThemeChange(t)}
                            className={`btn ${theme === t ? 'btn-primary' : 'btn-glass'}`}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {t.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
                <button
                    onClick={handleLogout}
                    className="btn"
                    style={{
                        width: '100%', background: 'rgba(255, 50, 50, 0.1)', color: '#ff6b6b',
                        border: '1px solid rgba(255, 50, 50, 0.3)', padding: '15px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                    }}
                >
                    <LogOut size={20} />
                    Log Out
                </button>
            </div>
        </div>
    );
}
