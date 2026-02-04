
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
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
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{
            height: '100vh', display: 'flex',
            background: 'var(--bg-app)', color: 'white'
        }}>

            {/* Left Side - Visual */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '600px', height: '600px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent 70%)',
                    filter: 'blur(80px)', zIndex: 0
                }} />
                <div style={{ zIndex: 1, textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Your digital brain is waiting.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div style={{
                width: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px',
                borderLeft: '1px solid var(--border-glass)', background: 'rgba(20, 20, 20, 0.5)', zIndex: 2
            }}>
                <button onClick={() => navigate('/')} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', gap: '5px', alignItems: 'center', marginBottom: '40px' }}>
                    <ArrowLeft size={16} /> Back to Home
                </button>

                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Sparkles color="var(--accent-violet)" /> Broklin
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Login to continue</p>
                </div>

                {error && <div style={{ color: '#ff4d4d', background: 'rgba(255, 77, 77, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Continue with</label>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    await loginWithGoogle(credentialResponse.credential);
                                    navigate('/dashboard');
                                } catch (err) {
                                    setError("Google Login Failed: " + err.message);
                                }
                            }}
                            onError={() => setError('Login Failed')}
                            theme="filled_black"
                            shape="pill"
                            width="400"
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
                    <div style={{ height: '1px', background: 'var(--border-glass)', flex: 1 }}></div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>OR</span>
                    <div style={{ height: '1px', background: 'var(--border-glass)', flex: 1 }}></div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="glass-input"
                            style={{
                                width: '100%', padding: '12px', borderRadius: '8px',
                                border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.05)', color: 'white',
                                fontSize: '16px'
                            }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '8px',
                                border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.05)', color: 'white',
                                fontSize: '16px'
                            }}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', justifyContent: 'center', marginTop: '10px' }}>
                        Login
                    </button>
                </form>

                <p style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent-fuchsia)', fontWeight: 'bold' }}>Create Account</Link>
                </p>
            </div>
        </div>
    );
}
