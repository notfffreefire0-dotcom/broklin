
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';

export default function FocusEngine() {
    const [mode, setMode] = useState('focus'); // focus, shortBreak, longBreak
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const audioRef = useRef(new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg'));

    const modes = {
        focus: { label: 'Focus', time: 25 * 60, color: 'var(--accent-violet)' },
        shortBreak: { label: 'Short Break', time: 5 * 60, color: 'var(--accent-cyan)' },
        longBreak: { label: 'Long Break', time: 15 * 60, color: 'var(--accent-fuchsia)' },
    };

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Timer finished
            setIsActive(false);
            audioRef.current.play();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const switchMode = (newMode) => {
        setMode(newMode);
        setTimeLeft(modes[newMode].time);
        setIsActive(false);
    };

    const toggleTimer = () => setIsActive(!isActive);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const progress = ((modes[mode].time - timeLeft) / modes[mode].time) * 100;

    return (
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                <Zap color={modes[mode].color} /> Focus Engine
            </h2>

            {/* Mode Switcher */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
                {Object.keys(modes).map((m) => (
                    <button
                        key={m}
                        onClick={() => switchMode(m)}
                        className="btn"
                        style={{
                            background: mode === m ? modes[m].color : 'transparent',
                            border: mode === m ? 'none' : '1px solid var(--border-glass)',
                            color: 'white',
                            opacity: mode === m ? 1 : 0.6
                        }}
                    >
                        {modes[m].label}
                    </button>
                ))}
            </div>

            {/* Timer Display */}
            <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 30px' }}>
                {/* SVG Circle Progress */}
                <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="transparent"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                    />
                    <motion.circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="transparent"
                        stroke={modes[mode].color}
                        strokeWidth="8"
                        strokeDasharray="565" // 2 * PI * 90 ≈ 565
                        strokeDashoffset={565 - (565 * progress) / 100}
                        animate={{ strokeDashoffset: 565 - (565 * progress) / 100 }}
                        transition={{ type: "tween", ease: "linear", duration: 1 }}
                    />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '3rem', fontWeight: 'bold' }}>
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button className="btn btn-primary" onClick={toggleTimer} style={{ width: '60px', height: '60px', borderRadius: '50%', padding: 0, justifyContent: 'center' }}>
                    {isActive ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button className="btn btn-glass" onClick={() => switchMode(mode)} style={{ width: '60px', height: '60px', borderRadius: '50%', padding: 0, justifyContent: 'center' }}>
                    <RotateCcw size={24} />
                </button>
            </div>
        </div>
    );
}
