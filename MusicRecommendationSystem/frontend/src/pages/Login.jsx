import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
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
                login(data);
                navigate('/');
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
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Welcome Back</h1>

                {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Username"
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
                        placeholder="Password"
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

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                        Log In
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent)' }}>Sign up</Link>
                </p>

                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <Link to="/admin/login" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>
                        Login as Admin
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
