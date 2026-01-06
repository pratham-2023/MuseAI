import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                // Check if user is admin
                if (data.role === 'admin') {
                    login(data);
                    navigate('/admin');
                } else {
                    setError('Access Denied: Admins only');
                }
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh'
        }}>
            <div className="glass-panel" style={{
                padding: '3rem',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                border: '1px solid rgba(255, 99, 71, 0.3)', // Reddish tint for admin
                boxShadow: '0 8px 32px 0 rgba(255, 99, 71, 0.1)'
            }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#ff6347' }}>Admin Portal</h1>
                <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Restricted Access</p>

                {error && <div style={{ color: '#ef4444', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Admin Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            outline: 'none'
                        }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Admin Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            outline: 'none'
                        }}
                        required
                    />

                    <button type="submit" className="btn-primary" style={{
                        marginTop: '1rem',
                        background: 'linear-gradient(135deg, #ff6347 0%, #d84315 100%)'
                    }}>
                        Enter Dashboard
                    </button>

                    <button type="button" onClick={() => navigate('/')} style={{
                        marginTop: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}>
                        Back to User Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
