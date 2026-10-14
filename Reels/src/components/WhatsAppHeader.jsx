import React from 'react';
import {
  BackArrowIcon,
  VideoCallIcon,
  VoiceCallIcon,
  MoreMenuIcon
} from '../utils/svgIcons';

export default function WhatsAppHeader({
  name = "Sarah Jenkins",
  status = "online",
  avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=faces&auto=format&q=80",
  isTyping = false,
  onBackClick,
  onVideoClick,
  onCallClick,
  onMenuClick,
}) {
  const isTypingActive = isTyping || status === "typing...";

  return (
    <header className="wa-header">
      {/* Left section: Back arrow + Avatar + Contact Info */}
      <div className="wa-header-left">
        <button
          type="button"
          className="wa-icon-btn wa-back-btn"
          aria-label="Back"
          onClick={onBackClick}
        >
          <BackArrowIcon size={44} color="#e9edef" />
        </button>

        <div className="wa-avatar-container">
          <img
            src={avatar}
            alt={name}
            className="wa-header-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%236b7b8a'/%3E%3Ccircle cx='50' cy='38' r='20' fill='%23cfd9df'/%3E%3Cpath d='M20,90 C20,68 35,60 50,60 C65,60 80,68 80,90 Z' fill='%23cfd9df'/%3E%3C/svg%3E";
            }}
          />
        </div>

        <div className="wa-header-info">
          <h1 className="wa-header-title" title={name}>
            {name}
          </h1>
          <p className={`wa-header-subtitle ${isTypingActive ? 'is-typing-status' : ''}`} title={isTypingActive ? "typing..." : status}>
            {isTypingActive ? "typing..." : (status || "online")}
          </p>
        </div>
      </div>

      {/* Right section: Video Call + Voice Call + 3-Dot Menu */}
      <div className="wa-header-right">
        <button
          type="button"
          className="wa-icon-btn"
          aria-label="Video Call"
          onClick={onVideoClick}
        >
          <VideoCallIcon size={42} color="#e9edef" />
        </button>

        <button
          type="button"
          className="wa-icon-btn"
          aria-label="Voice Call"
          onClick={onCallClick}
        >
          <VoiceCallIcon size={38} color="#e9edef" />
        </button>

        <button
          type="button"
          className="wa-icon-btn"
          aria-label="More options"
          onClick={onMenuClick}
        >
          <MoreMenuIcon size={42} color="#e9edef" />
        </button>
      </div>
    </header>
  );
}
