import React from 'react';
import { LockIcon } from '../utils/svgIcons';

export default function SystemMessage({
  action,
  user,
  avatars = [],
  isEncryptionNotice = false,
  isDateDivider = false,
  dateText,
}) {
  if (isDateDivider) {
    return (
      <div className="wa-system-container">
        <div className="wa-system-card wa-system-date">
          <span>{dateText || "TODAY"}</span>
        </div>
      </div>
    );
  }

  if (isEncryptionNotice) {
    return (
      <div className="wa-system-container">
        <div className="wa-system-card wa-system-encryption">
          <div className="wa-system-lock-icon">
            <LockIcon size={14} color="#ffd279" />
          </div>
          <span className="wa-system-encryption-text">
            {action || "Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="wa-system-container">
      <div className="wa-system-card">
        {avatars && avatars.length > 0 && (
          <div className="wa-system-avatars">
            {avatars.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="System avatar"
                className="wa-system-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%236b7b8a'/%3E%3C/svg%3E";
                }}
              />
            ))}
          </div>
        )}
        <span className="wa-system-text">
          {user ? <strong className="wa-system-username">{user} </strong> : null}
          {action}
        </span>
      </div>
    </div>
  );
}
