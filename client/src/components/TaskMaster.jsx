
import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Plus, MoreHorizontal } from 'lucide-react';

// Mock Data (In reality, this would come from props/database)
const initialTaskData = {
    todo: [
        { id: '1', content: 'Design System Update' },
        { id: '2', content: 'Client Meeting Prep' }
    ],
    inProgress: [
        { id: '3', content: 'Auth Integration' }
    ],
    done: [
        { id: '4', content: 'Project Setup' }
    ]
};

export default function TaskMaster() {
    // Simple state for now; would use dnd-kit or react-beautiful-dnd for full robustness
    // For this MVP, we'll do simple list rendering and "mock" movement via buttons or just static lists for the visual check
    // Actually, let's make it interactive with basic state moving
    const [columns, setColumns] = useState(initialTaskData);

    const moveTask = (taskId, sourceCol, destCol) => {
        const task = columns[sourceCol].find(t => t.id === taskId);
        const newSource = columns[sourceCol].filter(t => t.id !== taskId);
        const newDest = [...columns[destCol], task];

        setColumns({
            ...columns,
            [sourceCol]: newSource,
            [destCol]: newDest
        });
    };

    const Column = ({ title, colId, items, color }) => (
        <div style={{
            flex: 1,
            minWidth: '250px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            padding: '15px',
            border: '1px solid var(--border-glass)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: color, fontWeight: 'bold' }}>
                <span>{title} <span style={{ opacity: 0.5, marginLeft: '5px' }}>{items.length}</span></span>
                <MoreHorizontal size={16} style={{ opacity: 0.5 }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '200px' }}>
                {items.map(item => (
                    <motion.div
                        layoutId={item.id}
                        key={item.id}
                        className="glass-panel"
                        style={{
                            padding: '15px',
                            background: 'rgba(255,255,255,0.05)',
                            cursor: 'grab',
                            fontSize: '14px'
                        }}
                        whileHover={{ y: -2, background: 'rgba(255,255,255,0.08)' }}
                    >
                        {item.content}


                        {/* Simple controls to move items */}
                        <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                            {colId !== 'todo' && <button className="task-action-btn" onClick={() => moveTask(item.id, colId, 'todo')}>← Todo</button>}
                            {colId !== 'inProgress' && <button className="task-action-btn" onClick={() => moveTask(item.id, colId, 'inProgress')}>In Prog</button>}
                            {colId !== 'done' && <button className="task-action-btn" onClick={() => moveTask(item.id, colId, 'done')}>Done →</button>}
                        </div>
                    </motion.div>
                ))}

                <button
                    className="btn btn-glass"
                    style={{ marginTop: 'auto', borderStyle: 'dashed', opacity: 0.7, justifyContent: 'center' }}
                    onClick={() => {
                        const text = prompt("Task name:");
                        if (text) {
                            setColumns(prev => ({
                                ...prev,
                                [colId]: [...prev[colId], { id: Date.now().toString(), content: text }]
                            }))
                        }
                    }}
                >
                    <Plus size={14} /> Add Task
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ height: '100%', display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
            <Column title="To Do" colId="todo" items={columns.todo} color="var(--accent-fuchsia)" />
            <Column title="In Progress" colId="inProgress" items={columns.inProgress} color="var(--accent-cyan)" />
            <Column title="Done" colId="done" items={columns.done} color="var(--accent-violet)" />
        </div>
    );
}
