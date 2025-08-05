import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import '../global.css'; // Assuming you have global styles
import '../styles/video.css'; // Assuming you have video-specific styles

interface VideoVariant {
  url: string;
  bg: string;
  title: string;
}

interface Props {
  videoVariants: VideoVariant[];
}

const VideoPlayer: React.FC<Props> = ({ videoVariants }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cookieConsent, setCookieConsent] = useState<string | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const modalVideoRef = useRef<HTMLIFrameElement>(null);

  // Check cookie consent on component mount
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    const allowYouTube = localStorage.getItem('allowYouTube');
    setCookieConsent(allowYouTube);

    // Listen for cookie consent changes
    const handleCookieChange = (event: CustomEvent) => {
      setCookieConsent(event.detail.allowYouTube);
    };

    window.addEventListener('cookieConsentChanged', handleCookieChange as EventListener);

    return () => {
      window.removeEventListener('cookieConsentChanged', handleCookieChange as EventListener);
    };
  }, []);

  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getVideoTitle = (index: number) => {
    return videoVariants[index]?.title || `Video ${index + 1}`;
  };

  const videoEmbedUrls = videoVariants.map(
    (element) =>
      `https://www.youtube.com/embed/${getYouTubeID(element.url)}?enablejsapi=1&version=3&playerapiid=ytplayer`
  );

  const updateSelection = (index: number) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    const modal = modalRef.current;

    const stopVideo = () => {
      const iframe = modalVideoRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          "*"
        );
        iframe.contentWindow.postMessage(
          '{"event":"command","func":"stopVideo","args":""}',
          "*"
        );
        
        // Also reset the src to ensure complete stop
        setTimeout(() => {
          if (iframe) {
            iframe.src = iframe.src;
          }
        }, 100);
      }
    };

    const handleModalClose = () => {
      stopVideo();
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal && modal.open) {
        // Stop video before closing - same as close button
        const iframe = modalVideoRef.current;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            "*"
          );
          iframe.contentWindow.postMessage(
            '{"event":"command","func":"stopVideo","args":""}',
            "*"
          );
        }
        setTimeout(() => {
          if (modal) {
            modal.close();
          }
        }, 200);
      }
    };

    if (modal) {
      modal.addEventListener('close', handleModalClose);
      
      // Add global keydown listener
      document.addEventListener('keydown', handleGlobalKeyDown);
      
      // Click outside to close
      modal.addEventListener('click', (e) => {
        const modalDimensions = modal.getBoundingClientRect();
        if (
          e.clientX < modalDimensions.left ||
          e.clientX > modalDimensions.right ||
          e.clientY < modalDimensions.top ||
          e.clientY > modalDimensions.bottom
        ) {
          // Stop video before closing - same as close button
          const iframe = modalVideoRef.current;
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(
              '{"event":"command","func":"pauseVideo","args":""}',
              "*"
            );
            iframe.contentWindow.postMessage(
              '{"event":"command","func":"stopVideo","args":""}',
              "*"
            );
          }
          setTimeout(() => {
            if (modal) {
              modal.close();
            }
          }, 200);
        }
      });
    }

    return () => {
      if (modal) {
        modal.removeEventListener('close', handleModalClose);
      }
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  // Update background image when selection changes or on first load
  useEffect(() => {
    if (videoContainerRef.current && typeof window !== 'undefined' && videoVariants.length > 0) {
      videoContainerRef.current.style.setProperty('background-image', `url(${videoVariants[selectedIndex].bg})`);
    }
  }, [selectedIndex, videoVariants]);

  const handlePlayButtonClick = () => {
    // Check if YouTube is allowed
    if (cookieConsent !== 'true') {
      alert('To watch videos, you need to accept YouTube cookies. Please update your cookie settings.');
      return;
    }
    
    const modal = modalRef.current;
    const iframe = modalVideoRef.current;
    
    if (modal && iframe) {
      modal.showModal();
      // Play video using YouTube API
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          "*"
        );
      }
    }
  };

  // Placeholder component for when YouTube is not allowed
  const VideoPlaceholder = () => (
    <div className="youtube-placeholder rounded-2xl flex flex-col items-center justify-center border-2 border-primary bg-[#131c20]">
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold text-white mb-2">YouTube Videos</h3>
        <p className="text-gray-300 mb-4">
          To watch our videos, you need to accept YouTube cookies.
        </p>
        <button 
          onClick={() => {
            // Auto-accept all cookies when clicking "Change Cookie Settings"
            localStorage.setItem('cookieConsent', 'accepted');
            localStorage.setItem('allowYouTube', 'true');
            setCookieConsent('true');
            
            // Hide cookie banner
            const cookieBanner = document.getElementById('cookie-banner');
            if (cookieBanner) {
              cookieBanner.classList.remove('show');
              setTimeout(() => {
                cookieBanner.style.display = 'none';
              }, 300);
            }
            
            // Trigger event for other components
            window.dispatchEvent(new CustomEvent('cookieConsentChanged', {
              detail: { 
                cookieConsent: 'accepted',
                allowYouTube: 'true'
              }
            }));
          }}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/80 transition-colors"
        >
          Change Cookie Settings
        </button>
      </div>
    </div>
  );

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      {/* Show placeholder if YouTube cookies are not accepted, otherwise show video player */}
      {cookieConsent !== 'true' ? (
        <VideoPlaceholder />
      ) : (
        <div
          id="video-container"
          className="rounded-2xl"
          ref={videoContainerRef}
        >
          <button id="play-button" className="circle-button" onClick={handlePlayButtonClick} title="Play Video">
            <i className="fa fa-solid fa-play play-icon" />
          </button>
        </div>
      )}

      {/* Modal is only needed when cookies are accepted */}
      {cookieConsent === 'true' && (
        <dialog id="video_modal" className="modal backdrop:bg-black/50" ref={modalRef}>
          <div className="relative">
            <form method="dialog">
              <button
                type="button"
                className="absolute right-2 top-2 z-[9999] w-[50px] h-[50px] border-2 border-white/50 rounded-full bg-black/70 backdrop-blur-md text-white text-lg flex justify-center items-center transition-all hover:bg-white/20 hover:scale-110 focus:outline-none"
                onClick={() => {
                  // Stop video before closing
                  const iframe = modalVideoRef.current;
                  const modal = modalRef.current;
                  if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage(
                      '{"event":"command","func":"pauseVideo","args":""}',
                      "*"
                    );
                    iframe.contentWindow.postMessage(
                      '{"event":"command","func":"stopVideo","args":""}',
                      "*"
                    );
                  }
                  setTimeout(() => {
                    if (modal) {
                      modal.close();
                    }
                  }, 200);
                }}
              >
                ✕
              </button>
            </form>
            <div className="w-[80vw] h-[45vw] max-w-[1280px] max-h-[720px] min-w-[640px] min-h-[360px] rounded-2xl overflow-hidden bg-black">
              <iframe
                id="modal-video"
                ref={modalVideoRef}
                src={videoEmbedUrls[selectedIndex]}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="w-full h-full rounded-2xl border-0"
                frameBorder="0"
                title={getVideoTitle(selectedIndex) + ' (YouTube Video)'}
                aria-label={getVideoTitle(selectedIndex) + ' (YouTube Video)'}
              />
            </div>
          </div>
        </dialog>
      )}

      {/* Thumbnail buttons - immer sichtbar, jetzt mit echten Links für SEO */}
      <div className="thumbnail-container flex flex-col gap-2 justify-center">
        <div className="flex flex-row gap-2 justify-center">
          {videoVariants.map((variant, index) => (
            <div key={index} className="flex-1 max-w-[170px]">
              <a
                href={variant.url}
                aria-label={`Video öffnen: ${variant.title}`}
                tabIndex={0}
                onClick={e => {
                  e.preventDefault();
                  updateSelection(index);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    updateSelection(index);
                  }
                }}
              >
                <img
                  src={variant.bg}
                  width="1920"
                  height="1080"
                  className={
                    selectedIndex === index
                      ? 'rounded-2xl border-4 border-white brightness-75 cursor-pointer w-full object-cover shadow-lg backdrop-brightness-110'
                      : 'rounded-2xl cursor-pointer w-full object-cover'
                  }
                  data-index={index}
                  alt={`Image ${index + 1}`}
                />
              </a>
            </div>
          ))}
        </div>

        {/* Video title display */}
        <div className="text-center mt-2">
          <p className="text-white text-sm">
            Currently playing: <i>{getVideoTitle(selectedIndex)}</i>
          </p>
        </div>
      </div>
    </>
  );
};

export default VideoPlayer;