
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './components/Home';

import AddItemModal from './components/AddItemModal';
import ZenWriter from './components/ZenWriter';
import Vault from './components/Vault';
import Settings from './components/Settings';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() { // AppContent renamed to App, and now includes BrowserRouter and AuthProvider
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth(); // useAuth is now directly in App


  // Fetch Items
  const fetchItems = async () => {
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Fetch items error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchItems();
  }, [user]);

  // Save New Item
  const handleSaveItem = async (newItem) => {
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    try {
      const token = localStorage.getItem('token');
      await fetch(`${BASE_URL}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newItem)
      });
      fetchItems();
    } catch (err) {
      alert("Failed to save");
    }
  };

  // Delete Item
  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!confirm("Delete this from your brain?")) return;

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    try {
      const token = localStorage.getItem('token');
      await fetch(`${BASE_URL}/api/items/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleSync = async () => {
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const token = localStorage.getItem('token');
    await fetch(`${BASE_URL}/api/sync`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    alert("☁️ Google Drive Sync Triggered!");
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout onAdd={() => setIsModalOpen(true)} onSync={handleSync} />
          </ProtectedRoute>
        }>
          <Route index element={
            <Home
              items={items}
              loading={loading}
              handleDelete={handleDelete}
              fetchItems={fetchItems}
            />
          } />
          <Route path="writer" element={<ZenWriter onSave={(content) => handleSaveItem({ type: 'career_note', title: 'Zen Note', content })} />} />

          <Route path="vault" element={<Vault />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>

      {isModalOpen && (
        <AddItemModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveItem}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
