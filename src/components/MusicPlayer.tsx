import { useState, useRef, useEffect } from 'react';

// CSS Imports
import '../styles/debug.css';
import '../styles/modern-player-new.css';
import '../styles/playlist-height-fix.css';
import '../styles/active-song-highlight.css';
import '../styles/music-section.css';

// You can keep your SVG Icon components here if you defined them in this file
// For brevity, they are omitted here but should be included in your final file.

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  albumArt: string;
  audioUrl: string;
}

// The component no longer takes any props.
const MusicPlayer: React.FC = () => {
  // NEW: State for fetching data, loading status, and errors.
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Existing state for player functionality
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const progressRef = useRef<HTMLDivElement | null>(null);
  const albumArtRef = useRef<HTMLDivElement | null>(null);

  const audioKey = import.meta.env.PUBLIC_AUDIO_SECRET_KEY;
const getAudioUrlWithKey = (audioUrl: string) => {
  if (!audioKey) return audioUrl;
  
  // Check if a '?' already exists to correctly append the key
  return audioUrl.includes('?')
    ? `${audioUrl}&key=${encodeURIComponent(audioKey)}`
    : `${audioUrl}?key=${encodeURIComponent(audioKey)}`;
};

  // NEW: useEffect hook to fetch the playlist from your Netlify Function on component mount.
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await fetch('/.netlify/functions/get-playlist');
        if (!response.ok) {
          throw new Error('Failed to load playlist from API.');
        }
        const data = await response.json();
        setSongs(data.songs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, []); // The empty array [] ensures this effect runs only once.

  // This useEffect handles the audio element's events.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => nextSong();

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSongIndex, songs]); // Depends on songs now

  // Reflect progress into CSS without inline styles in JSX
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${progress}%`;
    }
  }, [progress]);

  // Update album art CSS variable without inline styles in JSX
  useEffect(() => {
    const current = songs[currentSongIndex];
    if (albumArtRef.current && current) {
      albumArtRef.current.style.setProperty('--album-image', `url(${current.albumArt})`);
    }
  }, [songs, currentSongIndex]);

  const togglePlay = () => {
    if (songs.length === 0) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // iOS Audio-Handling: play() mit User-Interaction und Fehlerbehandlung
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.log('Autoplay prevented:', error);
            setIsPlaying(false);
          });
      }
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleFirstPlay = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    togglePlay();
  };

  const changeSong = (newIndex: number) => {
    if (songs.length === 0) return;
    
    setIsPlaying(false);
    setCurrentSongIndex(newIndex);
    
    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.src = getAudioUrlWithKey(songs[newIndex].audioUrl);
        audio.load();
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }, 100);
  };

  const nextSong = () => {
    if (songs.length === 0) return;
    changeSong((currentSongIndex + 1) % songs.length);
  };

  const prevSong = () => {
    if (songs.length === 0) return;
    changeSong(currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1);
  };

  const selectSong = (index: number) => {
    if (index === currentSongIndex) {
      togglePlay();
    } else {
      changeSong(index);
    }
  };

  // --- RENDER LOGIC ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Loading Playlist...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400">
        Error: {error}
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Playlist is empty.
      </div>
    );
  }

  const currentSong = songs[currentSongIndex];

  return (
    <div className="music-player-container full-height" role="region" aria-label="Music Player">
      <div className="modern-player">
        <div className={`control-panel ${isPlaying ? 'active' : ''}`}>
          <div 
            className={`info-panel info-panel-styles ${isPlaying ? 'active' : ''}`}
          >
            <div className="info-panel-text">
              <div className="info-artist">
                {currentSong.artist}
              </div>
              <div className="info-title">
                {currentSong.title}
              </div>
              <div className="info-progress">
                <div className="info-progress-bar" ref={progressRef} />
              </div>
            </div>
          </div>
          
          <div className="album-art-container">
            <div 
              className="album-art"
              ref={albumArtRef}
              onClick={handleFirstPlay}
            />
          </div>
          
          <div className="controls-container">
            <button onClick={prevSong} className="control-btn prev-btn" aria-label="Previous" type="button" />
            <button onClick={handleFirstPlay} className={`control-btn play-btn ${isPlaying ? 'playing' : ''}`} aria-label={isPlaying ? 'Pause' : 'Play'} type="button" />
            <button onClick={nextSong} className="control-btn next-btn" aria-label="Next" type="button" />
          </div>
        </div>
      </div>
      
      <div className="song-list modern-song-list-scroll flex-grow">
        <h3 className="p-4 pt-2 text-white">Album</h3>
        <div className="song-list-tracks modern-song-list-tracks scrollable-tracks">
          {songs.map((song, index) => (
            <div 
              key={song.id}
              className={`song-list-item modern-song-list-item ${index === currentSongIndex ? 'active' : ''}`}
              onClick={() => selectSong(index)}
              data-is-playing={isPlaying && index === currentSongIndex ? 'true' : 'false'}
            >
              <div className="song-list-number modern-song-list-number">{index + 1}</div>
              <div className="song-list-info modern-song-list-info">
                <div className="song-list-title modern-song-list-title">{song.title}</div>
                <div className="song-list-artist modern-song-list-artist">{song.artist}</div>
              </div>
              <div className="song-list-duration modern-song-list-duration">{song.duration}</div>
            </div>
          ))}
        </div>
      </div>
      
      <audio 
        ref={audioRef}
        src={getAudioUrlWithKey(currentSong.audioUrl)}
        preload={hasInteracted ? "auto" : "none"}
        playsInline // iOS-spezifisch: verhindert Fullscreen
        className="audio-perf"
      />
    </div>
  );
};

export default MusicPlayer;