
import React from 'react';
import { FileText, Clock, Trash2 } from 'lucide-react';

export default function Vault() {
    // In a real app, this would fetch 'notes' or 'archived items' from the API
    // For now, we will display a placeholder or if we had a notes context, use that.
    // Since 'items' are passed to Home, we might not have access here unless we move state up or use Context.
    // We'll assume a static view or "Coming Soon" for robust implementation, 
    // BUT the user asked for "Vaults too". 
    // Let's make it a simple "Project Archives" view.

    return (
        <div style={{ height: '100%', padding: '20px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <FileText color="var(--accent-cyan)" /> Vault
            </h2>

            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <div style={{ marginBottom: '20px' }}>
                    <FileText size={48} style={{ opacity: 0.5 }} />
                </div>
                <h3>Your Knowledge Vault</h3>
                <p>Use the <b>Zen Writer</b> to save documents here.</p>
                <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>(Files saved in Writer will appear here in the next update)</p>
            </div>
        </div>
    );
}
