
import React, { useState, useEffect } from 'react';
import {
    RefreshCcw, Film, Gamepad2, Bookmark, StickyNote, LayoutGrid, Trash2, ExternalLink
} from 'lucide-react';
import FocusEngine from './FocusEngine';
import TaskMaster from './TaskMaster';
import HabitMatrix from './HabitMatrix';

export default function Home({ items, loading, handleDelete, fetchItems }) {
    const [filter, setFilter] = useState('all');

    const filteredItems = items.filter(item => {
        if (filter === 'all') return true;
        return item.type === filter;
    });

    const getIconForType = (type) => {
        switch (type) {
            case 'movie': return <Film size={16} />;
            case 'game': return <Gamepad2 size={16} />;
            case 'bookmark': return <Bookmark size={16} />;
            case 'career_note': return <StickyNote size={16} />;
            default: return <LayoutGrid size={16} />;
        }
    };

    return (
        <div style={{ paddingBottom: '50px' }}>

            {/* Productivity Widgets */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <FocusEngine />
                <TaskMaster />
            </div>

            <HabitMatrix />
            <div style={{ height: '30px' }} />

            <div className="filters" style={{ display: 'flex', gap: '8px', marginBottom: '30px' }}>
                {[
                    { id: 'all', label: 'All', icon: <LayoutGrid size={14} /> },
                    { id: 'bookmark', label: 'Links', icon: <Bookmark size={14} /> },
                    { id: 'movie', label: 'Movies', icon: <Film size={14} /> },
                    { id: 'game', label: 'Games', icon: <Gamepad2 size={14} /> },
                    { id: 'career_note', label: 'Notes', icon: <StickyNote size={14} /> }
                ].map(f => (
                    <button
                        key={f.id}
                        className={`filter-pill ${filter === f.id ? 'active' : ''}`}
                        onClick={() => setFilter(f.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        {f.icon} {f.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-muted)' }}>
                    <RefreshCcw className="spin" size={24} style={{ marginBottom: '10px' }} />
                    <p>Loading your digital brain...</p>
                </div>
            ) : (
                <div className="items-grid">
                    {filteredItems.map(item => (
                        <div key={item.id} className="glass-panel bento-card">
                            <button className="delete-btn" onClick={(e) => handleDelete(item.id, e)}>
                                <Trash2 size={14} />
                            </button>

                            <div className="card-type" style={{
                                color: item.type === 'movie' ? 'var(--accent-fuchsia)' : 'var(--accent-cyan)',
                                display: 'flex', alignItems: 'center', gap: '6px'
                            }}>
                                {getIconForType(item.type)}
                                {item.type.replace('_', ' ').replace('career', '')}
                            </div>

                            <div className="card-title">
                                {item.url ? (
                                    <a href={item.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        {item.title} <ExternalLink size={12} style={{ opacity: 0.5 }} />
                                    </a>
                                ) : (
                                    item.title
                                )}
                            </div>

                            {item.content && (
                                <div className="card-content">
                                    {item.content}
                                </div>
                            )}
                        </div>
                    ))}

                    {filteredItems.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', border: '1px dashed var(--border-glass)', borderRadius: '16px' }}>
                            <p style={{ color: 'var(--text-muted)' }}>No items found in this category.</p>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
