import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const Player = () => {
    const { currentSong, isPlaying, togglePlay } = usePlayer();

    if (!currentSong) {
        return (
            <div
                className="glass"
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '90px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 32px',
                    zIndex: 100,
                    borderTop: '1px solid var(--glass-border)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                    <div style={{ width: '56px', height: '56px', background: '#333', borderRadius: '8px', marginRight: '16px' }}></div>
                    <div>
                        <h4 style={{ fontSize: '0.9rem' }}>Select a song</h4>
                        <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Unknown Artist</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#555', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={20} color="#999" />
                    </div>
                </div>
                <div style={{ width: '30%' }}></div>
            </div>
        );
    }

    return (
        <div
            className="glass"
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '90px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 32px',
                zIndex: 100,
                borderTop: '1px solid var(--glass-border)'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                <div style={{ width: '56px', height: '56px', background: '#333', borderRadius: '8px', marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.5rem' }}>🎵</span>
                </div>
                <div>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{currentSong.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#a1a1aa', margin: 0 }}>{currentSong.artist}</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '8px' }}>
                    <SkipBack size={20} color="#a1a1aa" cursor="pointer" />
                    <div
                        onClick={togglePlay}
                        style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        {isPlaying ? (
                            <Pause size={20} fill="black" stroke="none" />
                        ) : (
                            <Play size={20} fill="black" stroke="none" style={{ marginLeft: '2px' }} />
                        )}
                    </div>
                    <SkipForward size={20} color="#a1a1aa" cursor="pointer" />
                </div>
                <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '2px', position: 'relative' }}>
                    <div style={{ width: isPlaying ? '60%' : '0%', height: '100%', background: 'white', borderRadius: '2px', transition: 'width 0.2s' }}></div>
                </div>
            </div>

            <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                <Volume2 size={20} color="#a1a1aa" />
            </div>
        </div>
    );
};

export default Player;
