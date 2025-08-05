import { useState, useRef, useEffect } from 'react';
// Import der CSS-Dateien
import '../styles/debug.css';
import '../styles/modern-player-new.css'; // Neues Screenshot-basiertes Design
import '../styles/playlist-height-fix.css'; // Spezieller Fix für die Playlist-Höhe
import '../styles/active-song-highlight.css'; // Hervorhebung des aktiven Songs

// Icons für den Player
interface IconProps { className?: string; }
const PlayIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
  </svg>
);

const PauseIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
  </svg>
);

const NextIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
    <path d="M16 8v8h2V8h-2z"/>
  </svg>
);

const PrevIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2 14.5v-9l-6 4.5 6 4.5z"/>
    <path d="M8 8v8H6V8h2z"/>
  </svg>
);

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  albumArt: string;
  audioUrl: string; // Basis-URL ohne Key
}

interface MusicPlayerProps {
  songs: Song[];
  albumTitle: string;
  description?: string;
  displayMusicServices?: boolean;
}

// Client-side component
const MusicPlayer: React.FC<MusicPlayerProps> = ({ songs, albumTitle, description, displayMusicServices = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false); // Für Lazy Loading
  const [isClient, setIsClient] = useState(false); // Für Hydration-Sicherheit
  const [vinylAnimating, setVinylAnimating] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  // Nur ein Satz State, useEffects, Hilfsfunktionen und EIN return-Block:
  // Key aus der .env (Astro/Vite: PUBLIC_AUDIO_SECRET_KEY)
  const audioKey = import.meta.env.PUBLIC_AUDIO_SECRET_KEY;
  // Hilfsfunktion, um Key an die Audio-URL anzuhängen
  const getAudioUrlWithKey = (audioUrl: string) => {
    if (!audioKey) return audioUrl;
    // Falls schon ein Query-Parameter existiert, hänge mit & an, sonst mit ?
    return audioUrl.includes('?')
      ? `${audioUrl}&key=${encodeURIComponent(audioKey)}`
      : `${audioUrl}?key=${encodeURIComponent(audioKey)}`;
  };
  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        setProgress(progressPercent);
        setCurrentTime(audio.currentTime);
      }
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      if (isPlaying) {
        audio.play().catch(() => setIsPlaying(false));
      }
    };
    const handleEnded = () => {
      nextSong();
    };
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSongIndex, isPlaying, isClient]);

  const togglePlay = async () => {
    if (!isClient) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
        // Trigger vinyl animation nur beim Start
        if (!vinylAnimating) {
          setVinylAnimating(true);
          setTimeout(() => setVinylAnimating(false), 1000);
        }
      } catch {
        setIsPlaying(false);
      }
    }
  };

  const handleFirstPlay = () => {
    setHasInteracted(true);
    togglePlay();
  };

  const nextSong = () => {
    if (!isClient) return;
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = getAudioUrlWithKey(songs[nextIndex].audioUrl);
        audioRef.current.load();
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }, 100);
  };

  const prevSong = () => {
    if (!isClient) return;
    const prevIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(prevIndex);
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = getAudioUrlWithKey(songs[prevIndex].audioUrl);
        audioRef.current.load();
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }, 100);
  };

  const selectSong = (index: number) => {
    if (!isClient) return;
    if (index === currentSongIndex) {
      togglePlay();
      return;
    }
    setCurrentSongIndex(index);
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = getAudioUrlWithKey(songs[index].audioUrl);
        audioRef.current.load();
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }, 100);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="music-player-container full-height" role="region" aria-label="Music Player">
      {/* Modern Player Design basierend auf den Screenshots */}
      <div className="modern-player">
        {/* Control Panel - immer sichtbar */}
        <div className={`control-panel ${isPlaying ? 'active' : ''}`}>
          {/* Info Panel - umfasst Album Cover, aber Album Cover liegt darüber */}
          <div 
            className={`info-panel ${isPlaying ? 'active' : ''}`}
            style={{
              position: 'absolute',
              top: '-55px', // Weniger Abstand zum Control Panel
              left: '25px', // Startet beim Album Cover
              width: '350px', // Umfasst Album Cover + Control Buttons
              height: '60px', // Höher für bessere Sichtbarkeit
              backgroundColor: 'rgba(255, 255, 255, 0.85)', // Hell transparent
              color: '#333', // Dunkle Schrift für hellen Hintergrund
              padding: '10px 15px',
              borderRadius: '15px 15px 0 0',
              zIndex: 3, // Unter dem Album Cover (Album Cover hat z-index: 10)
              opacity: isPlaying ? 1 : 0,
              visibility: isPlaying ? 'visible' : 'hidden',
              transform: isPlaying ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', // Smoother Easing
              border: '1px solid rgba(0,0,0,0.1)', // Subtiler dunkler Rand
              backdropFilter: 'blur(15px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            {/* Text-Container - positioniert über den Control Buttons */}
            <div style={{
              position: 'absolute',
              left: '145px', // Über den Control Buttons (155px - 25px Start + 15px Padding)
              top: '10px',
              width: '190px' // Breite nur für die Control Buttons
            }}>
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>
                {currentSong.artist}
              </div>
              <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                {currentSong.title}
              </div>
              <div style={{ 
                width: '100%', 
                height: '3px', 
                backgroundColor: 'rgba(0,0,0,0.2)', 
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div 
                  style={{ 
                    height: '100%', 
                    backgroundColor: '#dc2626', 
                    width: `${progress}%`,
                    transition: 'width 0.2s ease'
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* TEST: Einfacher Text - entfernen wir */}
          
          {/* Album Art */}
          <div className="album-art-container">
            <div 
              className="album-art"
              style={{ '--album-image': `url(${currentSong.albumArt})` } as React.CSSProperties}
              onClick={(e) => { e.stopPropagation(); hasInteracted ? togglePlay() : handleFirstPlay(); }}
            ></div>
          </div>
          
          {/* Controls */}
          <div className="controls-container">
            <button 
              onClick={(e) => { e.stopPropagation(); prevSong(); }} 
              className="control-btn prev-btn" 
              aria-label="Previous"
              type="button"
            ></button>
            <button 
              onClick={(e) => { e.stopPropagation(); hasInteracted ? togglePlay() : handleFirstPlay(); }} 
              className={`control-btn play-btn ${isPlaying ? 'playing' : ''}`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              type="button"
            ></button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextSong(); }} 
              className="control-btn next-btn" 
              aria-label="Next"
              type="button"
            ></button>
          </div>
        </div>
      </div>
      {/* Song List - Optional anzeigen */}
      {songs.length > 1 && (
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
      )}
      {/* Hidden Audio Element */}
      {isClient && (
        <audio 
          ref={audioRef} 
          src={getAudioUrlWithKey(currentSong.audioUrl)}
          preload={hasInteracted ? "auto" : "none"}
        />
      )}
    </div>
  );
};

export default MusicPlayer;