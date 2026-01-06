import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SongCard from '../components/SongCard';

const PlaylistView = () => {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const res = await fetch(`http://localhost:5000/playlists/${id}`);
                const data = await res.json();
                setPlaylist(data);
            } catch (error) {
                console.error("Failed to fetch playlist");
            }
        };
        fetchPlaylist();
    }, [id]);

    if (!playlist) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div className="fade-in">
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{playlist.name}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>{playlist.songs.length} Songs</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px' }}>
                {playlist.songs.map(song => (
                    <SongCard key={song.id} song={song} />
                ))}
                {playlist.songs.length === 0 && (
                    <p style={{ color: 'var(--text-secondary)' }}>This playlist is empty. Go add some tunes!</p>
                )}
            </div>
        </div>
    );
};

export default PlaylistView;
