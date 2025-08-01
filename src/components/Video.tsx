import React, { useState, useEffect, useRef } from 'react';
import '../global.css'; // Assuming you have global styles
import '../styles/video.css'; // Assuming you have video-specific styles

interface VideoVariant {
  url: string;
  bg: string;
}

interface Props {
  videoVariants: VideoVariant[];
}

const VideoPlayer: React.FC<Props> = ({ videoVariants }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const customCursorRef = useRef<HTMLDivElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const modalVideoRef = useRef<HTMLIFrameElement>(null);
  const isCursorVisible = useRef(false);

  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoEmbedUrls = videoVariants.map(
    (element) =>
      `https://www.youtube.com/embed/${getYouTubeID(element.url)}?enablejsapi=1&version=3&playerapiid=ytplayer`
  );

  const updateSelection = (index: number) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    const videoContainer = videoContainerRef.current;
    const customCursor = customCursorRef.current;
    const playButton = playButtonRef.current;
    const modal = modalRef.current;

    const handleVideoContainerClick = () => {
      if (modal) {
        modal.showModal();
      }
      const iframe = modalVideoRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          "*"
        );
      }
    };

    const handleModalClose = () => {
      const iframe = modalVideoRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          "*"
        );
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (customCursor) {
        if (!isCursorVisible.current) {
          customCursor.style.display = 'flex';
          isCursorVisible.current = true;
        }
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseEnter = () => {
      if (customCursor) customCursor.style.display = 'flex';
      if (playButton) playButton.style.opacity = '0';
    };

    const handleMouseLeave = () => {
      if (customCursor) customCursor.style.display = 'none';
      isCursorVisible.current = false;
      if (playButton) playButton.style.opacity = '1';
    };

    if (videoContainer) {
      videoContainer.addEventListener('click', handleVideoContainerClick);
      videoContainer.addEventListener('mousemove', handleMouseMove);
      videoContainer.addEventListener('mouseenter', handleMouseEnter);
      videoContainer.addEventListener('mouseleave', handleMouseLeave);
    }

    if (modal) {
      modal.addEventListener('close', handleModalClose);
      modal.addEventListener('click', (e) => {
        const modalDimensions = modal.getBoundingClientRect();
        if (
          e.clientX < modalDimensions.left ||
          e.clientX > modalDimensions.right ||
          e.clientY < modalDimensions.top ||
          e.clientY > modalDimensions.bottom
        ) {
          modal.close();
        }
      });
    }

    return () => {
      if (videoContainer) {
        videoContainer.removeEventListener('click', handleVideoContainerClick);
        videoContainer.removeEventListener('mousemove', handleMouseMove);
        videoContainer.removeEventListener('mouseenter', handleMouseEnter);
        videoContainer.removeEventListener('mouseleave', handleMouseLeave);
      }

      if (modal) {
        modal.removeEventListener('close', handleModalClose);
      }
    };
  }, []);

  useEffect(() => {
      if (videoContainerRef.current) {
          videoContainerRef.current.style.setProperty('background-image', `url(${videoVariants[selectedIndex].bg})`);
      }
  }, [selectedIndex]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      
      <div id="custom-cursor" className="circle-button" ref={customCursorRef}>
        <i className="fa fa-solid fa-play" />
      </div>

      <div id="video-container" className="rounded-2xl h-[400px]" ref={videoContainerRef}>
        <button title="Play Button" id="play-button" className="circle-button" ref={playButtonRef}>
          <span className="play-icon">
            <i className="fa fa-solid fa-play" />
          </span>
        </button>
      </div>

      <dialog id="video_modal" className="modal" ref={modalRef}>
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle modal-close-btn">✕</button>
          </form>
          <div className="aspect-w-16">
            <iframe
              id="modal-video"
              ref={modalVideoRef}
              src={videoEmbedUrls[selectedIndex]}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      </dialog>

      <div className="carousel carousel-center mt-2 max-w-full w-[704px] gap-2 pr-4">
        {videoVariants.map((variant, index) => (
          <div key={index} className={`carousel-item w-1/4 `}>
            <a><img
              src={variant.bg}
              className={
                selectedIndex === index
                  ? 'rounded-2xl border-4 border-primary brightness-75'
                  : 'rounded-2xl'
              }
              data-index={index}
              alt={`Bild ${index + 1}`}
              onClick={() => updateSelection(index)}
            /></a>
          </div>
        ))}
      </div>
    </>
  );
};

export default VideoPlayer;