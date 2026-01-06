import React, { useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const Player = () => {
    const {
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        shuffle,
        repeat,
        togglePlay,
        skipNext,
        skipPrevious,
        seek,
        setVolume,
        toggleShuffle,
        toggleRepeat
    } = usePlayer();

    const progressRef = useRef(null);
    const volumeRef = useRef(null);

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleProgressClick = (e) => {
        if (!progressRef.current) return;
        const rect = progressRef.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        seek(percent * duration);
    };

    const handleVolumeChange = (e) => {
        if (!volumeRef.current) return;
        const rect = volumeRef.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        setVolume(Math.max(0, Math.min(1, percent)));
    };

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

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

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
            {/* Left: Song Info */}
            <div style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                <div style={{
                    width: '56px',
                    height: '56px',
                    background: currentSong.artwork_url
                        ? `url(${currentSong.artwork_url}) center/cover`
                        : '#333',
                    borderRadius: '8px',
                    marginRight: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    overflow: 'hidden'
                }}>
                    {!currentSong.artwork_url && <span style={{ fontSize: '1.5rem' }}>🎵</span>}
                </div>
                <div style={{ overflow: 'hidden' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentSong.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#a1a1aa', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentSong.artist}
                    </p>
                </div>
            </div>

            {/* Center: Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                    <Shuffle
                        size={18}
                        color={shuffle ? 'var(--accent)' : '#a1a1aa'}
                        style={{ cursor: 'pointer' }}
                        onClick={toggleShuffle}
                    />
                    <SkipBack
                        size={20}
                        color="#a1a1aa"
                        style={{ cursor: 'pointer' }}
                        onClick={skipPrevious}
                    />
                    <div
                        onClick={togglePlay}
                        style={{
                            width: '40px',
                            height: '40px',
                            background: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.1s',
                        }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {isPlaying ? (
                            <Pause size={20} fill="black" stroke="none" />
                        ) : (
                            <Play size={20} fill="black" stroke="none" style={{ marginLeft: '2px' }} />
                        )}
                    </div>
                    <SkipForward
                        size={20}
                        color="#a1a1aa"
                        style={{ cursor: 'pointer' }}
                        onClick={skipNext}
                    />
                    {repeat === 'off' && (
                        <Repeat
                            size={18}
                            color="#a1a1aa"
                            style={{ cursor: 'pointer' }}
                            onClick={toggleRepeat}
                        />
                    )}
                    {repeat === 'all' && (
                        <Repeat
                            size={18}
                            color="var(--accent)"
                            style={{ cursor: 'pointer' }}
                            onClick={toggleRepeat}
                        />
                    )}
                    {repeat === 'one' && (
                        <Repeat1
                            size={18}
                            color="var(--accent)"
                            style={{ cursor: 'pointer' }}
                            onClick={toggleRepeat}
                        />
                    )}
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#a1a1aa', minWidth: '40px', textAlign: 'right' }}>
                        {formatTime(currentTime)}
                    </span>
                    <div
                        ref={progressRef}
                        onClick={handleProgressClick}
                        style={{
                            flex: 1,
                            height: '4px',
                            background: '#333',
                            borderRadius: '2px',
                            position: 'relative',
                            cursor: 'pointer'
                        }}
                    >
                        <div
                            style={{
                                width: `${progress}%`,
                                height: '100%',
                                background: 'white',
                                borderRadius: '2px',
                                transition: 'width 0.1s linear'
                            }}
                        ></div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#a1a1aa', minWidth: '40px' }}>
                        {formatTime(duration)}
                    </span>
                </div>
            </div>

            {/* Right: Volume */}
            <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
                {volume === 0 ? (
                    <VolumeX
                        size={20}
                        color="#a1a1aa"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setVolume(0.5)}
                    />
                ) : (
                    <Volume2
                        size={20}
                        color="#a1a1aa"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setVolume(0)}
                    />
                )}
                <div
                    ref={volumeRef}
                    onClick={handleVolumeChange}
                    style={{
                        width: '100px',
                        height: '4px',
                        background: '#333',
                        borderRadius: '2px',
                        position: 'relative',
                        cursor: 'pointer'
                    }}
                >
                    <div
                        style={{
                            width: `${volume * 100}%`,
                            height: '100%',
                            background: 'white',
                            borderRadius: '2px'
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Player;
