


import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{
            height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-app)', color: 'white'
        }}>
            <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Sparkles color="var(--accent-violet)" /> Broklin
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Login to your second brain</p>
                </div>

                {error && <div style={{ color: '#ff4d4d', background: 'rgba(255, 77, 77, 0.1)', padding: '10px', borderRadius: '8px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: 'var(--text-secondary)' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="glass-input" // Assuming basic input styles exist or standard input
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: 'var(--text-secondary)' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center' }}>
                        Enter Brain
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
                    <div style={{ height: '1px', background: 'var(--border-glass)', flex: 1 }}></div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>OR</span>
                    <div style={{ height: '1px', background: 'var(--border-glass)', flex: 1 }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                await loginWithGoogle(credentialResponse.credential);
                                navigate('/');
                            } catch (err) {
                                setError("Google Login Failed");
                            }
                        }}
                        onError={() => {
                            setError('Login Failed');
                        }}
                        theme="filled_black"
                        shape="pill"
                    />
                </div>

                <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    New here? <Link to="/register" style={{ color: 'var(--accent-cyan)' }}>Create Account</Link>
                </p>
            </div>
        </div>
    );
}
