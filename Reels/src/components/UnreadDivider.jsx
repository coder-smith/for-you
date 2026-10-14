import React from 'react';

export default function UnreadDivider({ count = 504 }) {
  if (!count && count !== 0) return null;

  return (
    <div className="wa-unread-divider-wrapper" role="separator">
      <div className="wa-unread-divider-pill">
        <span className="wa-unread-count">{count}</span>
        <span className="wa-unread-text">UNREAD MESSAGES</span>
      </div>
    </div>
  );
}
