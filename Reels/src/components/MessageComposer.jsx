import React from 'react';
import {
  EmojiIcon,
  PaperclipIcon,
  RupeePaymentIcon,
  CameraIcon,
  MicrophoneIcon
} from '../utils/svgIcons';

export default function MessageComposer({
  value = "",
  onChange,
  onSend,
  placeholder = "Message",
  isTyping = false,
}) {
  return (
    <div className="wa-composer-wrapper">
      <div className="wa-composer-input-pill">
        {/* Emoji Button */}
        <button
          type="button"
          className="wa-composer-icon-btn"
          aria-label="Emoji Picker"
        >
          <EmojiIcon size={25} color="#8696a0" />
        </button>

        {/* Input text field */}
        <div className="wa-composer-input-field">
          <input
            type="text"
            className="wa-composer-input"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && value.trim()) {
                onSend?.(value);
              }
            }}
          />
        </div>

        {/* Action icons inside the bar */}
        <div className="wa-composer-actions">
          <button
            type="button"
            className="wa-composer-icon-btn"
            aria-label="Attach file"
          >
            <PaperclipIcon size={23} color="#8696a0" />
          </button>

          <button
            type="button"
            className="wa-composer-icon-btn"
            aria-label="Payments"
          >
            <RupeePaymentIcon size={21} color="#8696a0" />
          </button>

          <button
            type="button"
            className="wa-composer-icon-btn"
            aria-label="Camera"
          >
            <CameraIcon size={23} color="#8696a0" />
          </button>
        </div>
      </div>

      {/* Floating Action Button (Microphone or Send) */}
      <button
        type="button"
        className="wa-composer-fab-btn"
        aria-label="Voice Message"
        onClick={() => {
          if (value.trim()) {
            onSend?.(value);
          }
        }}
      >
        <MicrophoneIcon size={24} color="#ffffff" />
      </button>
    </div>
  );
}
