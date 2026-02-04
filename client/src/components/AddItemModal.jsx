
import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

export default function AddItemModal({ onClose, onSave }) {
    const [type, setType] = useState('career_note');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ type, title, content, url });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Sparkles size={20} color="var(--accent-violet)" /> Add to Brain
                    </h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, width: 'auto' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>TYPE</label>
                    <select value={type} onChange={e => setType(e.target.value)}>
                        <option value="career_note">Note / Idea</option>
                        <option value="bookmark">Bookmark</option>
                        <option value="movie">Movie</option>
                        <option value="game">Game</option>
                    </select>

                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>TITLE</label>
                    <input
                        type="text"
                        placeholder="What's this about?"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        autoFocus
                    />

                    {type === 'bookmark' && (
                        <>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>URL</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                required
                            />
                        </>
                    )}

                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>DETAILS</label>
                    <textarea
                        placeholder="Add some context..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        style={{ height: '100px', resize: 'none' }}
                    />

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="button" className="btn btn-glass" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
