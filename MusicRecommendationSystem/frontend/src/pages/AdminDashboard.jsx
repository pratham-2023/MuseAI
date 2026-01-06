import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [songs, setSongs] = useState([]);
    const [formData, setFormData] = useState({
        title: '', artist: '', genre: '', mood: '', tempo: '', energy: '', filename: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        try {
            const res = await fetch('http://localhost:5000/songs');
            const data = await res.json();
            setSongs(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const res = await fetch(`http://localhost:5000/songs/${id}`, {
                method: 'DELETE',
                headers: { 'X-User-ID': user.user_id }
            });
            if (res.ok) {
                setMessage('Song deleted');
                fetchSongs();
            } else {
                setMessage('Failed to delete');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/songs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': user.user_id
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setMessage('Song added successfully');
                setFormData({ title: '', artist: '', genre: '', mood: '', tempo: '', energy: '', filename: '' });
                fetchSongs();
            } else {
                setMessage('Failed to add song');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const [showAll, setShowAll] = useState(false);
    const displayedSongs = showAll ? songs : songs.slice(0, 5);

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Admin Dashboard</h1>
            {message && <div style={{ marginBottom: '1rem', color: 'var(--accent)' }}>{message}</div>}

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2>Add New Song</h2>
                <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={inputStyle} />
                    <input placeholder="Artist" value={formData.artist} onChange={e => setFormData({ ...formData, artist: e.target.value })} required style={inputStyle} />
                    <input placeholder="Genre" value={formData.genre} onChange={e => setFormData({ ...formData, genre: e.target.value })} required style={inputStyle} />
                    <input placeholder="Mood" value={formData.mood} onChange={e => setFormData({ ...formData, mood: e.target.value })} style={inputStyle} />
                    <input placeholder="Tempo" type="number" value={formData.tempo} onChange={e => setFormData({ ...formData, tempo: e.target.value })} style={inputStyle} />
                    <input placeholder="Energy" type="number" step="0.1" value={formData.energy} onChange={e => setFormData({ ...formData, energy: e.target.value })} style={inputStyle} />
                    <input placeholder="Filename (e.g. /static/songs/song.mp3)" value={formData.filename} onChange={e => setFormData({ ...formData, filename: e.target.value })} style={{ ...inputStyle, gridColumn: '1 / -1' }} />
                    <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1' }}>Add Song</button>
                </form>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2>Existing Songs ({songs.length})</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {displayedSongs.map(song => (
                        <SongItem key={song.id} song={song} onDelete={handleDelete} />
                    ))}
                </div>
                {songs.length > 5 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        style={{
                            width: '100%',
                            marginTop: '1rem',
                            padding: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    >
                        {showAll ? 'Show Less' : `View All Songs (${songs.length})`}
                    </button>
                )}
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
                <h2>User Feedback</h2>
                <FeedbackList />
            </div>
        </div>
    );
};

import { MoreVertical, Trash2, Edit } from 'lucide-react';

const SongItem = ({ song, onDelete }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '600', color: 'white' }}>{song.title}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{song.artist} • {song.genre}</span>
            </div>

            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <MoreVertical size={20} />
                </button>

                {showDropdown && (
                    <div style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        zIndex: 10,
                        background: '#1a1a1a',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        minWidth: '150px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        marginTop: '0.5rem'
                    }}>
                        <button
                            onClick={() => { console.log('Edit', song.id); setShowDropdown(false); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                width: '100%', padding: '8px',
                                background: 'transparent', border: 'none',
                                color: 'white', cursor: 'pointer', textAlign: 'left',
                                borderRadius: '4px',
                                fontSize: '0.9rem'
                            }}
                            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={e => e.target.style.background = 'transparent'}
                        >
                            <Edit size={16} /> Edit
                        </button>
                        <button
                            onClick={() => { onDelete(song.id); setShowDropdown(false); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                width: '100%', padding: '8px',
                                background: 'transparent', border: 'none',
                                color: '#ef4444', cursor: 'pointer', textAlign: 'left',
                                borderRadius: '4px',
                                fontSize: '0.9rem'
                            }}
                            onMouseEnter={e => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                            onMouseLeave={e => e.target.style.background = 'transparent'}
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Click outside listener could be added here for robustness, 
                but for now a simple toggle is sufficient. */}
            {showDropdown && (
                <div
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </div>
    );
};

const FeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    // We can access localStorage directly or pass user from parent.
    // Accessing context here is also fine if it's within Provider.
    // For simplicity and to match Sidebar/others, let's try direct prop or just stick to localStorage with safety.
    // But let's verify if `user` exists in localStorage.

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        const userId = userStr ? JSON.parse(userStr).user_id : null;

        if (userId) {
            fetch('http://localhost:5000/feedback', {
                headers: { 'X-User-ID': userId }
            })
                .then(res => res.json())
                .then(data => setFeedbacks(Array.isArray(data) ? data : []))
                .catch(err => console.error(err));
        }
    }, []);

    return (
        <div style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
        }}>
            {feedbacks.map(f => (
                <div key={f.id} className="feedback-card" style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: '0.9rem'
                            }}>
                                {f.name ? f.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <span style={{ fontWeight: '600', fontSize: '1.05rem' }}>{f.name || 'Anonymous'}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '2px' }}>
                            {[...Array(5)].map((_, i) => (
                                <span key={i} style={{
                                    color: i < f.rating ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                                    fontSize: '1rem'
                                }}>★</span>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(0,0,0,0.2)',
                        padding: '1rem',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        color: 'rgba(255,255,255,0.9)',
                        lineHeight: '1.5',
                        borderLeft: '3px solid var(--accent)'
                    }}>
                        "{f.message}"
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <small style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                            {new Date(f.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </small>
                    </div>
                </div>
            ))}
            {feedbacks.length === 0 && (
                <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '3rem',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic'
                }}>
                    No feedback received yet.
                </div>
            )}
        </div>
    );
};

const inputStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid var(--glass-border)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white'
};

export default AdminDashboard;
