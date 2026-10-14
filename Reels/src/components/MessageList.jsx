import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import SystemMessage from './SystemMessage';
import UnreadDivider from './UnreadDivider';
import TypingIndicator from './TypingIndicator';

export default function MessageList({
  messages = [],
  activeTyping = null,
  autoScroll = true,
  isGroupChat = false,
}) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end',
      });
    }
  };

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom(true);
    }
  }, [messages.length, activeTyping, autoScroll]);

  return (
    <div className="wa-message-list-container" ref={containerRef}>
      <div className="wa-message-list-content">
        {messages.map((item, index) => {
          if (item.type === 'system') {
            return (
              <SystemMessage
                key={item.id || index}
                action={item.action}
                user={item.user}
                avatars={item.avatars}
                isEncryptionNotice={item.isEncryptionNotice}
                isDateDivider={item.isDateDivider}
                dateText={item.dateText}
              />
            );
          }

          if (item.type === 'unread-divider') {
            return (
              <UnreadDivider
                key={item.id || index}
                count={item.count}
              />
            );
          }

          // Check if previous message is from same sender to control tail
          const prevMsg = index > 0 ? messages[index - 1] : null;
          const isSameSenderAsPrev =
            prevMsg &&
            prevMsg.type === item.type &&
            (item.type === 'outgoing' || prevMsg.sender === item.sender);
          const isFirstInGroup = !isSameSenderAsPrev;

          return (
            <MessageBubble
              key={item.id || index}
              message={item}
              isFirstInGroup={isFirstInGroup}
              isAnimated={item.isAnimated}
              isGroupChat={isGroupChat}
            />
          );
        })}

        {/* Live typing indicator if active */}
        {activeTyping && (
          <TypingIndicator
            sender={activeTyping.sender}
            senderColor={activeTyping.senderColor}
            isGroupChat={isGroupChat}
          />
        )}

        <div ref={messagesEndRef} className="wa-scroll-anchor" />
      </div>
    </div>
  );
}
