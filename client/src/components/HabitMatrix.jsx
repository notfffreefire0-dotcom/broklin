
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, PlusCircle } from 'lucide-react';

export default function HabitMatrix() {
    const [heatmapData, setHeatmapData] = useState({});

    const fetchHabits = async () => {
        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${BASE_URL}/api/habits/logs`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const logs = await res.json();
                // Convert array to object { '2023-10-27': 5 }
                const map = {};
                logs.forEach(log => {
                    map[log.date] = log.count;
                });
                setHeatmapData(map);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const logActivity = async () => {
        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');

        // Optimistic update
        const today = new Date().toISOString().split('T')[0];
        setHeatmapData(prev => ({
            ...prev,
            [today]: (prev[today] || 0) + 1
        }));

        await fetch(`${BASE_URL}/api/habits/log`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({})
        });
    };

    // Generate last 365 days
    const days = [];
    const today = new Date();
    for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const count = heatmapData[dateStr] || 0;
        // Limit intensity to 4
        const intensity = count > 4 ? 4 : count;
        days.push({ date, dateStr, intensity });
    }
    const gridData = days.reverse();

    const getColor = (intensity) => {
        switch (intensity) {
            case 0: return 'rgba(255,255,255,0.05)';
            case 1: return 'rgba(16, 185, 129, 0.2)';
            case 2: return 'rgba(16, 185, 129, 0.4)';
            case 3: return 'rgba(16, 185, 129, 0.7)';
            case 4: return 'rgba(16, 185, 129, 1)';
            default: return 'rgba(255,255,255,0.05)';
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '20px', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                    <Activity size={20} color="var(--accent-fuchsia)" /> Habit Matrix
                </h3>
                <button onClick={logActivity} className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'currentcolor', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <PlusCircle size={14} /> Log
                </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {gridData.map((day, idx) => (
                    <motion.div
                        key={idx}
                        title={`${day.dateStr}: ${heatmapData[day.dateStr] || 0} events`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '2px',
                            backgroundColor: getColor(day.intensity)
                        }}
                    />
                ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', fontSize: '12px', color: 'var(--text-secondary)', alignItems: 'center' }}>
                <span>Less</span>
                <div style={{ display: 'flex', gap: '2px' }}>
                    <div style={{ width: '10px', height: '10px', background: getColor(0) }} />
                    <div style={{ width: '10px', height: '10px', background: getColor(2) }} />
                    <div style={{ width: '10px', height: '10px', background: getColor(4) }} />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}
