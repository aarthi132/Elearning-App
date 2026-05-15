import React from 'react';
import './VideoModal.css';

const VideoModal = ({ videoUrl, onClose }) => {
    if (!videoUrl) return null;

    // Convert standard YouTube watch URLs to embed URLs
    const getEmbedUrl = (url) => {
        let embedUrl = url;
        if (url.includes('youtube.com/watch?v=')) {
            embedUrl = url.replace('watch?v=', 'embed/');
        } else if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        
        // Remove additional parameters if any (like &t=...) for simplicity
        if (embedUrl.includes('&')) {
            embedUrl = embedUrl.split('&')[0];
        }
        return embedUrl;
    };

    return (
        <div className="video-modal-overlay" onClick={onClose}>
            <div className="video-modal-content" onClick={e => e.stopPropagation()}>
                <button className="video-modal-close" onClick={onClose} aria-label="Close Video">
                    &times;
                </button>
                <div className="video-container">
                    <iframe
                        src={getEmbedUrl(videoUrl)}
                        title="Course Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default VideoModal;
