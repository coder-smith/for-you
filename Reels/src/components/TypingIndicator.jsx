import React from 'react';
import { BubbleTailIncoming } from '../utils/svgIcons';

export default function TypingIndicator({ sender, senderColor = "#53bdeb", isGroupChat = false }) {
  return (
    <div className="wa-message-row incoming typing-row">
      <div className="wa-bubble-wrapper">
        <div className="wa-bubble-tail-pos incoming">
          <BubbleTailIncoming color="#202c33" />
        </div>
        <div className="wa-bubble incoming wa-typing-bubble">
          {isGroupChat && sender && (
            <div className="wa-bubble-sender" style={{ color: senderColor }}>
              {sender}
            </div>
          )}
          <div className="wa-typing-dots">
            <span className="wa-dot dot-1"></span>
            <span className="wa-dot dot-2"></span>
            <span className="wa-dot dot-3"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
