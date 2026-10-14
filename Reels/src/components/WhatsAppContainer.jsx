import React, { forwardRef } from 'react';
import WhatsAppHeader from './WhatsAppHeader';
import ChatWallpaper from './ChatWallpaper';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';
import AndroidNavigation from './AndroidNavigation';

const WhatsAppContainer = forwardRef(function WhatsAppContainer(
  {
    config,
    messages,
    activeTyping,
    composerText = "",
    onComposerChange,
    onComposerSend,
    showAndroidNav = true,
  },
  ref
) {
  const isGroupChat = config.chatType === 'group';

  return (
    <div className="wa-phone-canvas" ref={ref} id="whatsapp-screen-canvas">
      {/* Background Wallpaper Layer */}
      <ChatWallpaper opacity={config.wallpaperOpacity ?? 0.055} />

      {/* Main UI Layout */}
      <div className="wa-app-layout">
        {/* Top Fixed WhatsApp Header for Individual or Group chat */}
        <WhatsAppHeader
          name={config.name || config.groupName || "YOUR CONTACT NAME"}
          status={config.status || "online"}
          avatar={config.avatar}
          isTyping={Boolean(activeTyping)}
        />

        {/* Scrollable Message Area */}
        <main className="wa-chat-body">
          <MessageList
            messages={messages}
            activeTyping={activeTyping}
            autoScroll={config.animationSettings?.autoScroll ?? true}
            isGroupChat={isGroupChat}
          />
        </main>

        {/* Bottom Message Composer Input Bar */}
        <MessageComposer
          value={composerText}
          onChange={onComposerChange}
          onSend={onComposerSend}
        />

        {/* Bottom Android Navigation Gesture Area */}
        {showAndroidNav && <AndroidNavigation />}
      </div>
    </div>
  );
});

export default WhatsAppContainer;
