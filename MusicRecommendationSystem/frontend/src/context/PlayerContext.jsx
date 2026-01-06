import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(1);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState('off'); // 'off', 'one', 'all'
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const audioRef = useRef(new Audio());

    const playSong = (song, songQueue = []) => {
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

            // Set up queue if provided
            if (songQueue.length > 0) {
                setQueue(songQueue);
                const index = songQueue.findIndex(s => s.id === song.id);
                setCurrentIndex(index !== -1 ? index : 0);
            }
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

    const skipNext = () => {
        if (queue.length === 0) return;

        let nextIndex;
        if (shuffle) {
            nextIndex = Math.floor(Math.random() * queue.length);
        } else {
            nextIndex = (currentIndex + 1) % queue.length;
        }

        setCurrentIndex(nextIndex);
        playSong(queue[nextIndex], queue);
    };

    const skipPrevious = () => {
        if (queue.length === 0) return;

        // If more than 3 seconds into song, restart it
        if (currentTime > 3) {
            audioRef.current.currentTime = 0;
            return;
        }

        let prevIndex;
        if (shuffle) {
            prevIndex = Math.floor(Math.random() * queue.length);
        } else {
            prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
        }

        setCurrentIndex(prevIndex);
        playSong(queue[prevIndex], queue);
    };

    const seek = (time) => {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const setVolume = (vol) => {
        const clampedVol = Math.max(0, Math.min(1, vol));
        audioRef.current.volume = clampedVol;
        setVolumeState(clampedVol);
    };

    const toggleShuffle = () => {
        setShuffle(!shuffle);
    };

    const toggleRepeat = () => {
        const modes = ['off', 'all', 'one'];
        const currentModeIndex = modes.indexOf(repeat);
        const nextMode = modes[(currentModeIndex + 1) % modes.length];
        setRepeat(nextMode);
    };

    // Event listeners
    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => {
            setIsPlaying(false);

            // Handle repeat modes
            if (repeat === 'one') {
                audio.currentTime = 0;
                audio.play();
                setIsPlaying(true);
            } else if (repeat === 'all' || queue.length > 0) {
                skipNext();
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
    }, [repeat, queue, currentIndex]);

    return (
        <PlayerContext.Provider value={{
            currentSong,
            isPlaying,
            currentTime,
            duration,
            volume,
            shuffle,
            repeat,
            playSong,
            togglePlay,
            skipNext,
            skipPrevious,
            seek,
            setVolume,
            toggleShuffle,
            toggleRepeat
        }}>
            {children}
        </PlayerContext.Provider>
    );
};
