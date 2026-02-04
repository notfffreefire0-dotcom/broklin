
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Shield, Globe } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div style={{ height: '100vh', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>

            {/* Background Effects */}
            <div style={{
                position: 'absolute', top: '-20%', left: '-10%', width: '50vw', height: '50vw',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent 70%)',
                filter: 'blur(100px)', zIndex: -1
            }} />
            <div style={{
                position: 'absolute', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw',
                background: 'radial-gradient(circle, rgba(217, 70, 239, 0.3), transparent 70%)',
                filter: 'blur(100px)', zIndex: -1
            }} />

            {/* Navbar */}
            <nav style={{ padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles color="var(--accent-fuchsia)" /> Broklin
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => navigate('/login')} className="btn btn-glass" style={{ padding: '10px 24px' }}>Log In</button>
                    <button onClick={() => navigate('/register')} className="btn btn-primary" style={{ padding: '10px 24px' }}>Get Started</button>
                </div>
            </nav>

            {/* Hero Section */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ fontSize: '5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-0.02em' }}
                >
                    Target Your <br />
                    <span style={{
                        background: 'linear-gradient(to right, #c084fc, #e879f9, #22d3ee)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>Digital Brain</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '40px' }}
                >
                    Organize your life, specific notes, and daily tasks in one unified, spatial workspace. Built for high-performance humans.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    style={{ display: 'flex', gap: '20px' }}
                >
                    <button
                        onClick={() => navigate('/register')}
                        className="btn btn-primary"
                        style={{ padding: '16px 40px', fontSize: '1.1rem', height: '60px' }}
                    >
                        Join the Future <ArrowRight size={20} />
                    </button>
                </motion.div>

                {/* Feature Grid */}
                <div style={{ display: 'flex', gap: '30px', marginTop: '80px' }}>
                    <div className="glass-panel" style={{ padding: '20px', width: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <Zap color="var(--accent-fuchsia)" size={32} />
                        <h3>Fast</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Instant sync and load times.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '20px', width: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <Shield color="var(--accent-violet)" size={32} />
                        <h3>Secure</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your data is yours alone.</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '20px', width: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <Globe color="var(--accent-cyan)" size={32} />
                        <h3>Global</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Access from anywhere.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
