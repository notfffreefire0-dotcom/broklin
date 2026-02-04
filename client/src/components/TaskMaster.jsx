
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, X } from 'lucide-react';

export default function TaskMaster() {
    const [tasks, setTasks] = useState([]);

    // Fetch Tasks
    useEffect(() => {
        const fetchTasks = async () => {
            const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch(`${BASE_URL}/api/tasks`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setTasks(data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchTasks();
    }, []);


    const addTask = async (status) => {
        const text = prompt("New Task:");
        if (!text) return;

        // 1. Optimistic Update
        const tempId = 'temp-' + Date.now();
        const newTaskOptimistic = { id: tempId, content: text, status, isTemp: true };
        setTasks(prev => [...prev, newTaskOptimistic]);

        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${BASE_URL}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: text, status })
            });

            if (!res.ok) throw new Error("Failed to add task");

            const savedTask = await res.json();

            // 2. Replace Temp with Real
            setTasks(prev => prev.map(t => t.id === tempId ? savedTask : t));

        } catch (err) {
            console.error(err);
            alert("Failed to save task. Network error?");
            // Rollback
            setTasks(prev => prev.filter(t => t.id !== tempId));
        }
    };

    const moveTask = async (id, newStatus) => {
        // Optimistic Update
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));

        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        await fetch(`${BASE_URL}/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
    };

    const deleteTask = async (id) => {
        if (!confirm("Remove this task?")) return;

        // Optimistic Update
        setTasks(prev => prev.filter(t => t.id !== id));

        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        await fetch(`${BASE_URL}/api/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    };

    const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

    const Column = ({ title, status, color }) => (
        <div style={{
            flex: 1,
            minWidth: '250px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            padding: '15px',
            border: '1px solid var(--border-glass)',
            display: 'flex', flexDirection: 'column'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: color, fontWeight: 'bold' }}>
                <span>{title} <span style={{ opacity: 0.5, marginLeft: '5px' }}>{getTasksByStatus(status).length}</span></span>
                <MoreHorizontal size={16} style={{ opacity: 0.5 }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {getTasksByStatus(status).map(item => (
                    <motion.div
                        layoutId={item.id}
                        key={item.id}
                        className="glass-panel"

                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: item.isTemp ? 0.5 : 1, y: 0 }}
                        style={{
                            padding: '15px',
                            background: 'rgba(255,255,255,0.05)',
                            fontSize: '14px',
                            position: 'relative',
                            border: item.isTemp ? '1px dashed rgba(255,255,255,0.2)' : 'none'
                        }}
                    >
                        {item.content}

                        <button
                            onClick={() => deleteTask(item.id)}
                            style={{
                                position: 'absolute', top: '5px', right: '5px',
                                background: 'none', border: 'none', color: '#ff4d4d',
                                cursor: 'pointer', opacity: 0.6
                            }}
                        >
                            <X size={14} />
                        </button>

                        <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                            {status !== 'todo' && <button className="task-action-btn" onClick={() => moveTask(item.id, 'todo')}>← Todo</button>}
                            {status !== 'inProgress' && <button className="task-action-btn" onClick={() => moveTask(item.id, 'inProgress')}>In Prog</button>}
                            {status !== 'done' && <button className="task-action-btn" onClick={() => moveTask(item.id, 'done')}>Done →</button>}
                        </div>
                    </motion.div>
                ))}

                <button
                    className="btn btn-glass"
                    style={{ marginTop: 'auto', borderStyle: 'dashed', opacity: 0.7, justifyContent: 'center' }}
                    onClick={() => addTask(status)}
                >
                    <Plus size={14} /> Add Task
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ height: '100%', display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
            <Column title="To Do" status="todo" color="var(--accent-fuchsia)" />
            <Column title="In Progress" status="inProgress" color="var(--accent-cyan)" />
            <Column title="Done" status="done" color="var(--accent-violet)" />
        </div>
    );
}
