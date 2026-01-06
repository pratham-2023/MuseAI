import React, { useState } from 'react';
import { Heart, Plus, Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const SongCard = ({ song }) => {
    const { playSong, currentSong, isPlaying } = usePlayer();
    const [liked, setLiked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const isCurrentSong = currentSong?.id === song.id;

    const handleLike = async (e) => {
        e.stopPropagation();
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert("Please login to like songs!");
            return;
        }

        const newLikedState = !liked;
        setLiked(newLikedState);

        try {
            await fetch('http://localhost:5000/rate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.user_id,
                    song_id: song.id,
                    rating: newLikedState ? 5 : 0
                })
            });
        } catch (error) {
            console.error("Failed to rate song");
        }
    };

    const addToPlaylist = async (e) => {
        e.stopPropagation();
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return alert("Login required");

        const playlistId = prompt("Enter Playlist ID to add to (Check Library for IDs):");
        if (!playlistId) return;

        try {
            await fetch(`http://localhost:5000/playlists/${playlistId}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ song_id: song.id })
            });
            alert("Added to playlist!");
        } catch (error) {
            alert("Failed to add");
        }
    };

    return (
        <div
            className="glass-panel"
            style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minWidth: '180px',
                border: isCurrentSong ? '1px solid var(--accent)' : '1px solid var(--glass-border)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => playSong(song)}
        >
            {/* Album Art */}
            <div
                style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)'
                }}
            >
                {/* Music Icon */}
                <div style={{
                    fontSize: '3rem',
                    opacity: 0.4,
                    filter: 'brightness(1.2)'
                }}>🎵</div>

                {/* Play Button Overlay */}
                {isHovered && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'fadeIn 0.2s ease'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'var(--accent)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 20px var(--accent-glow)',
                            transform: isHovered ? 'scale(1)' : 'scale(0.8)',
                            transition: 'transform 0.2s'
                        }}>
                            <Play size={20} fill="white" stroke="none" style={{ marginLeft: '2px' }} />
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    display: 'flex',
                    gap: '0.5rem',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.2s'
                }}>
                    <button
                        onClick={addToPlaylist}
                        title="Add to Playlist"
                        style={{
                            background: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(8px)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Plus size={16} color="white" />
                    </button>
                    <button
                        onClick={handleLike}
                        style={{
                            background: liked ? 'rgba(239, 68, 68, 0.9)' : 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(8px)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Heart
                            size={16}
                            fill={liked ? "white" : "none"}
                            color="white"
                        />
                    </button>
                </div>

                {/* Now Playing Indicator */}
                {isCurrentSong && isPlaying && (
                    <div style={{
                        position: 'absolute',
                        bottom: '0.5rem',
                        left: '0.5rem',
                        display: 'flex',
                        gap: '2px',
                        alignItems: 'flex-end'
                    }}>
                        {[0, 1, 2].map(i => (
                            <div
                                key={i}
                                style={{
                                    width: '3px',
                                    height: '12px',
                                    background: 'var(--accent)',
                                    borderRadius: '2px',
                                    animation: `pulse 0.8s ease-in-out ${i * 0.1}s infinite alternate`
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Song Info */}
            <div style={{ flex: 1 }}>
                <h4 style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: '0.25rem',
                    color: isCurrentSong ? 'var(--accent)' : 'var(--text-primary)'
                }}>
                    {song.title}
                </h4>
                <p style={{
                    margin: 0,
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {song.artist}
                </p>
            </div>
        </div>
    );
};

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    from { height: 4px; }
    to { height: 12px; }
  }
`;
document.head.appendChild(style);

export default SongCard;
