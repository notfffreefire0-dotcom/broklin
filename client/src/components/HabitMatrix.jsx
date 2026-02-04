
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function HabitMatrix() {
    // Generate last 365 days mock data
    const generateData = () => {
        const data = [];
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            // Random intensity 0-4
            const intensity = Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0;
            data.push({ date, intensity });
        }
        return data.reverse();
    };

    const [data] = useState(generateData());

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
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Activity size={20} color="var(--accent-fuchsia)" /> Habit Matrix
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {data.map((day, idx) => (
                    <motion.div
                        key={idx}
                        title={day.date.toDateString()}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.002 }}
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
