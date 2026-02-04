
import React, { useState } from 'react';
import { Save, Download } from 'lucide-react';

export default function ZenWriter({ initialContent = '', onSave }) {
    const [content, setContent] = useState(initialContent);

    // Auto-resize textarea
    const handleInput = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
        setContent(e.target.value);
    };

    const downloadTxt = () => {
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/markdown' });
        element.href = URL.createObjectURL(file);
        element.download = `zen-note-${Date.now()}.md`;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-glass" onClick={downloadTxt} title="Download Markdown"><Download size={16} /></button>
                    <button className="btn btn-glass" onClick={() => onSave(content)} title="Save"><Save size={16} /></button>
                </div>
            </div>

            {/* Editor Area */}
            <textarea
                value={content}
                onChange={handleInput}
                placeholder="Start writing... (Drag & Drop files)"
                style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    resize: 'none',
                    outline: 'none',
                    padding: '20px',
                    fontFamily: "'Outfit', sans-serif"
                }}
            />
        </div>
    );
}
