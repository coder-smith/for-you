import React, { useEffect, useRef, useState } from 'react';
import WhatsAppContainer from './WhatsAppContainer';
import { useChatTimeline } from '../hooks/useChatTimeline';
import { X, Play, Pause, RotateCcw } from 'lucide-react';

export default function VideoPreviewModal({
  config,
  isOpen,
  onClose,
}) {
  const containerRef = useRef(null);
  const [showControlsOnHover, setShowControlsOnHover] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.5);

  const timeline = useChatTimeline(config, {
    autoPlay: true,
    staticMode: false,
  });

  // Calculate viewport fit scale
  useEffect(() => {
    const handleResize = () => {
      const windowH = window.innerHeight;
      const windowW = window.innerWidth;
      const scaleH = windowH / 1920;
      const scaleW = windowW / 1080;
      const scale = Math.min(scaleH, scaleW);
      setPreviewScale(scale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="wa-video-preview-overlay"
      onMouseEnter={() => setShowControlsOnHover(true)}
      onMouseLeave={() => setShowControlsOnHover(false)}
    >
      {/* Subtle floating close button and controls on hover */}
      <div className={`wa-preview-hover-bar ${showControlsOnHover ? 'visible' : ''}`}>
        <button
          type="button"
          className="wa-preview-btn"
          onClick={timeline.togglePlay}
          title={timeline.isPlaying ? "Pause" : "Play"}
        >
          {timeline.isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
        </button>

        <button
          type="button"
          className="wa-preview-btn"
          onClick={timeline.resetTimeline}
          title="Restart"
        >
          <RotateCcw size={16} />
        </button>

        <span className="wa-preview-tag">1080 × 1920 (9:16) Video Mode</span>

        <button
          type="button"
          className="wa-preview-close-btn"
          onClick={onClose}
          title="Exit Preview (ESC)"
        >
          <X size={18} />
          <span>Exit Preview (ESC)</span>
        </button>
      </div>

      {/* Pure 1080x1920 Phone Canvas */}
      <div className="wa-preview-viewport-center">
        <div
          className="wa-preview-canvas-wrapper"
          style={{
            width: 1080,
            height: 1920,
            transform: `scale(${previewScale})`,
            transformOrigin: 'center center',
          }}
        >
          <WhatsAppContainer
            ref={containerRef}
            config={config}
            messages={timeline.visibleMessages}
            activeTyping={timeline.activeTyping}
            showAndroidNav={config.showAndroidNav !== false}
          />
        </div>
      </div>
    </div>
  );
}
