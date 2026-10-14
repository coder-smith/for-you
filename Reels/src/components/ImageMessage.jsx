import React from 'react';
import { ForwardIcon } from '../utils/svgIcons';
import StatusTick from './StatusTick';

export default function ImageMessage({
  image,
  caption,
  time,
  type = 'incoming',
  status = 'seen',
  sender,
  senderColor = '#53bdeb',
  onImageClick,
}) {
  const isOutgoing = type === 'outgoing';

  return (
    <div className={`wa-media-content ${caption ? 'has-caption' : 'no-caption'}`}>
      {/* Image container */}
      <div className="wa-media-img-wrapper" onClick={onImageClick}>
        <img
          src={image}
          alt={caption || "Chat attachment"}
          className="wa-media-img"
          loading="eager"
        />

        {/* If no caption, overlay time inside bottom right */}
        {!caption && (
          <div className="wa-media-overlay-meta">
            <span className="wa-msg-time overlay">{time}</span>
            {isOutgoing && (
              <span className="wa-msg-status overlay">
                <StatusTick status={status} isOverlay={true} size={24} />
              </span>
            )}
          </div>
        )}

        {/* Forward button indicator */}
        <button type="button" className="wa-media-forward-btn" aria-label="Forward media">
          <ForwardIcon size={32} color="#e9edef" />
        </button>
      </div>

      {/* Caption if provided */}
      {caption && (
        <div className="wa-media-caption-container">
          <p className="wa-media-caption-text">{caption}</p>
          <div className="wa-msg-meta">
            <span className="wa-msg-time">{time}</span>
            {isOutgoing && (
              <span className="wa-msg-status">
                <StatusTick status={status} size={26} />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
