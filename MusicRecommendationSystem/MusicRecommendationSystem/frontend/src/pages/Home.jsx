import React, { useEffect, useState } from 'react';
import SongCard from '../components/SongCard';

const Home = () => {
    const [songs, setSongs] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const songsRes = await fetch('http://localhost:5000/songs');
                const songsData = await songsRes.json();
                setSongs(songsData);

                let recUrl = 'http://localhost:5000/recommend';
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && user.user_id) {
                    recUrl += `?user_id=${user.user_id}`;
                }

                const recRes = await fetch(recUrl);
                const recData = await recRes.json();
                setRecommendations(recData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60vh',
                fontSize: '1.1rem',
                color: 'var(--text-secondary)'
            }}>
                Loading your music...
            </div>
        );
    }

    return (
        <div className="fade-in">
            {/* Hero Section */}
            <header style={{ marginBottom: '4rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--accent)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>
                        Welcome Back
                    </span>
                </div>
                <h1 style={{ marginBottom: '0.75rem' }}>Good Evening</h1>
                <p style={{
                    fontSize: '1.125rem',
                    color: 'var(--text-secondary)',
                    maxWidth: '600px'
                }}>
                    Discover music tailored to your mood and preferences.
                </p>
            </header>

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
                <section style={{ marginBottom: '4rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1.5rem'
                    }}>
                        <h2>Your Recommendations</h2>
                        <span style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-muted)',
                            fontWeight: '500'
                        }}>
                            Based on your likes
                        </span>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {recommendations.map(song => (
                            <SongCard key={song.id} song={song} />
                        ))}
                    </div>
                </section>
            )}

            {/* All Songs Section */}
            <section>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2>Trending Now</h2>
                    <p style={{
                        fontSize: '0.95rem',
                        color: 'var(--text-secondary)',
                        marginTop: '0.5rem'
                    }}>
                        Popular tracks everyone's listening to
                    </p>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {songs.map(song => (
                        <SongCard key={song.id} song={song} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
