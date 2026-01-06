import React, { useEffect, useState } from 'react';
import { Plus, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Library = () => {
    const [playlists, setPlaylists] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;
        try {
            const res = await fetch(`http://localhost:5000/playlists?user_id=${user.user_id}`);
            const data = await res.json();
            setPlaylists(data);
        } catch (error) {
            console.error("Failed to fetch playlists");
        }
    };

    const createPlaylist = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!newPlaylistName.trim()) return;

        try {
            await fetch('http://localhost:5000/playlists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newPlaylistName,
                    user_id: user.user_id
                })
            });
            setShowModal(false);
            setNewPlaylistName('');
            fetchPlaylists();
        } catch (error) {
            console.error("Failed to create playlist");
        }
    };

    return (
        <div className="fade-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '3rem' }}>Your Library</h1>
                <button
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={20} /> Create Playlist
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
                {playlists.map(playlist => (
                    <div
                        key={playlist.id}
                        className="glass-panel"
                        style={{ padding: '24px', cursor: 'pointer', transition: '0.3s' }}
                        onClick={() => navigate(`/playlist/${playlist.id}`)}
                    >
                        <div style={{
                            width: '100%', aspectRatio: '1/1', background: '#333',
                            borderRadius: '12px', marginBottom: '16px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Music size={40} color="var(--text-secondary)" />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{playlist.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{playlist.song_count} songs</p>
                    </div>
                ))}
            </div>

            {/* Basic Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="glass-panel" style={{ padding: '32px', width: '400px' }}>
                        <h2>New Playlist</h2>
                        <input
                            type="text"
                            placeholder="My Awesome Playlist"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            style={{
                                width: '100%', padding: '12px', margin: '16px 0',
                                background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '8px'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={createPlaylist}>Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Library;
