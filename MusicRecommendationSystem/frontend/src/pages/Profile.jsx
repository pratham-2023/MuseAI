import React, { useEffect, useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    if (!user) return null;

    return (
        <div className="fade-in">
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '24px',
                    fontSize: '2.5rem',
                    fontWeight: 'bold'
                }}>
                    {user.username[0].toUpperCase()}
                </div>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{user.username}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Member since 2026</p>
                </div>
            </header>

            <section className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Account Details</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                    <User size={20} />
                    <span>Username: {user.username}</span>
                </div>
            </section>

            <button
                onClick={handleLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                }}
            >
                <LogOut size={18} />
                Sign Out
            </button>
        </div>
    );
};

export default Profile;
