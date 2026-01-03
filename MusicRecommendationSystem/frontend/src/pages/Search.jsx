import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import SongCard from '../components/SongCard';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim()) {
                performSearch();
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const performSearch = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Search</h1>

                <div className="glass" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px 24px',
                    borderRadius: '99px',
                    maxWidth: '600px'
                }}>
                    <SearchIcon color="var(--text-secondary)" size={24} style={{ marginRight: '16px' }} />
                    <input
                        type="text"
                        placeholder="What do you want to listen to?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '1.1rem',
                            width: '100%',
                            outline: 'none'
                        }}
                    />
                </div>
            </header>

            {loading && <p style={{ color: 'var(--text-secondary)' }}>Searching...</p>}

            {!loading && results.length > 0 && (
                <section>
                    <h2 style={{ marginBottom: '1.5rem' }}>Top Results</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px' }}>
                        {results.map(song => (
                            <SongCard key={song.id} song={song} />
                        ))}
                    </div>
                </section>
            )}

            {!loading && query && results.length === 0 && (
                <p style={{ color: 'var(--text-secondary)' }}>No results found for "{query}"</p>
            )}

            {!query && (
                <section>
                    <h3 style={{ color: 'var(--text-secondary)', marginTop: '2rem' }}>Browse Genres</h3>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
                        {['Pop', 'Rock', 'Jazz', 'Classical', 'Hip Hop'].map(genre => (
                            <div key={genre} className="glass-panel" style={{
                                padding: '24px 48px',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '1.2rem',
                                background: `linear-gradient(135deg, ${getRandomColor()}, transparent)`
                            }}
                                onClick={() => setQuery(genre)}
                            >
                                {genre}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

// Helper for vivid background colors
const getRandomColor = () => {
    const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
    return colors[Math.floor(Math.random() * colors.length)] + '40'; // 40 is hex opacity
}

export default Search;
