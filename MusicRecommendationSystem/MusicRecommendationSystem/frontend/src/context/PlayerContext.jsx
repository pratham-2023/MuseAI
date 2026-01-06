import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio());

    const playSong = (song) => {
        if (currentSong?.id === song.id) {
            togglePlay();
            return;
        }

        if (song.preview_url) {
            audioRef.current.src = song.preview_url;
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.error("Playback failed", e));
            setCurrentSong(song);
        } else {
            alert("No preview available for this song");
        }
    };

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Cleanup
    useEffect(() => {
        const audio = audioRef.current;

        const handleEnded = () => setIsPlaying(false);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
    }, []);

    return (
        <PlayerContext.Provider value={{ currentSong, isPlaying, playSong, togglePlay }}>
            {children}
        </PlayerContext.Provider>
    );
};
