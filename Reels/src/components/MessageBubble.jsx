import React from 'react';
import {
  BubbleTailIncoming,
  BubbleTailOutgoing,
} from '../utils/svgIcons';
import StatusTick from './StatusTick';
import ImageMessage from './ImageMessage';

export default function MessageBubble({
  message,
  isFirstInGroup = true,
  isAnimated = false,
  isGroupChat = false,
}) {
  const {
    type = 'incoming',
    sender,
    senderColor = '#53bdeb',
    text,
    time = '12:00 pm',
    status = 'seen',
    image,
    images = [],
    caption,
    replyTo,
    reaction,
  } = message;

  const isOutgoing = type === 'outgoing';
  const bubbleColor = isOutgoing ? '#005c4b' : '#202c33';
  const hasImage = Boolean(image || (images && images.length > 0));
  const hasReaction = Boolean(reaction && reaction.trim());

  return (
    <div
      className={`wa-message-row ${isOutgoing ? 'outgoing' : 'incoming'} ${isAnimated ? 'msg-animate-in' : ''}`}
      id={`msg-${message.id}`}
    >
      <div className={`wa-bubble-wrapper ${hasImage ? 'is-media-bubble' : ''} ${hasReaction ? 'has-reaction' : ''}`}>
        {/* Tail SVG */}
        {isFirstInGroup && (
          <div className={`wa-bubble-tail-pos ${isOutgoing ? 'outgoing' : 'incoming'}`}>
            {isOutgoing ? (
              <BubbleTailOutgoing color={bubbleColor} />
            ) : (
              <BubbleTailIncoming color={bubbleColor} />
            )}
          </div>
        )}

        <div className={`wa-bubble ${isOutgoing ? 'outgoing' : 'incoming'}`}>
          {/* In 1-on-1 chats, sender name is omitted on incoming bubbles unless it is a group */}
          {isGroupChat && !isOutgoing && sender && (
            <div
              className="wa-bubble-sender"
              style={{ color: senderColor || '#53bdeb' }}
            >
              {sender}
            </div>
          )}

          {/* Reply Quote preview if any */}
          {replyTo && (
            <div className="wa-reply-quote">
              <div
                className="wa-reply-quote-bar"
                style={{ backgroundColor: replyTo.senderColor || '#53bdeb' }}
              />
              <div className="wa-reply-quote-content">
                <span
                  className="wa-reply-quote-sender"
                  style={{ color: replyTo.senderColor || '#53bdeb' }}
                >
                  {replyTo.sender}
                </span>
                <p className="wa-reply-quote-text">{replyTo.text}</p>
              </div>
            </div>
          )}

          {/* If Image Attachment */}
          {hasImage ? (
            <ImageMessage
              image={image || images[0]}
              caption={caption || text}
              time={time}
              type={type}
              status={status}
              sender={sender}
              senderColor={senderColor}
            />
          ) : (
            /* Regular Text Message with zero-overlap float meta */
            <div className="wa-bubble-text-container">
              <span className="wa-bubble-text">{text}</span>
              <span className="wa-msg-meta">
                <span className="wa-msg-time">{time}</span>
                {isOutgoing && (
                  <span className="wa-msg-status">
                    <StatusTick status={status} size={26} />
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Reaction pill — anchored to bottom corner of the bubble */}
        {hasReaction && (
          <div className={`wa-reaction-pill ${isOutgoing ? 'outgoing' : 'incoming'}`}>
            <span className="wa-reaction-emoji">{reaction}</span>
          </div>
        )}
      </div>
    </div>
  );
}
