export const defaultChatConfig = {
  chatType: "individual", // "individual" | "group"
  name: "Sarah Jenkins",
  status: "online", // "online" | "typing..." | "last seen today at 8:45 pm"
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=faces&auto=format&q=80",
  unreadCount: 3,
  showAndroidNav: true,
  wallpaperOpacity: 0.055,

  // Animation timeline configuration
  animationSettings: {
    autoPlay: false,
    speed: 1.0,
    loop: false,
    typingSpeedMs: 1400,
    messageIntervalMs: 1600,
    autoScroll: true,
  },

  messages: [
    {
      id: "sys-1",
      type: "system",
      action: "Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.",
      isEncryptionNotice: true,
      time: "8:45 pm",
      delay: 500,
    },
    {
      id: "date-1",
      type: "system",
      isDateDivider: true,
      dateText: "TODAY",
      delay: 400,
    },
    {
      id: "msg-1",
      type: "incoming",
      text: "Hey! Are you still working on the new product design?",
      time: "8:58 pm",
      typingDuration: 1300,
      delay: 900,
    },
    {
      id: "msg-2",
      type: "outgoing",
      text: "Yes! Just finalizing the key layouts now. Let me send you a sneak peek 🚀",
      time: "8:59 pm",
      status: "read",
      typingDuration: 1000,
      delay: 1000,
    },
    {
      id: "msg-3",
      type: "outgoing",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1000&auto=format&fit=crop&q=80",
      caption: "Here is the brand direction concept!",
      text: "",
      time: "9:00 pm",
      status: "read",
      typingDuration: 1200,
      delay: 1100,
    },
    {
      id: "msg-4",
      type: "incoming",
      text: "Whoa, this looks incredible! 😍 The dark palette is so sleek.",
      time: "9:01 pm",
      typingDuration: 1500,
      delay: 1000,
    },
    {
      id: "msg-5",
      type: "incoming",
      text: "Are we ready for tomorrow's demo call?",
      time: "9:01 pm",
      typingDuration: 900,
      delay: 800,
    },
    {
      id: "msg-6",
      type: "outgoing",
      text: "100%! Let's jump on a quick voice call at 10 AM to sync up 🎙️",
      time: "9:02 pm",
      status: "read",
      typingDuration: 1100,
      delay: 1200,
    }
  ]
};

export const samplePresets = {
  sarahChat: {
    chatType: "individual",
    name: "Sarah Jenkins",
    status: "online",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=faces&auto=format&q=80",
    unreadCount: 2,
    messages: [
      {
        id: "s-enc",
        type: "system",
        action: "Messages and calls are end-to-end encrypted.",
        isEncryptionNotice: true,
        time: "7:30 pm",
      },
      {
        id: "m1",
        type: "incoming",
        text: "Did you check the flight tickets for Friday?",
        time: "8:10 pm",
        typingDuration: 1200,
      },
      {
        id: "m2",
        type: "outgoing",
        text: "Yes, booked the 6 PM direct flight! ✈️",
        time: "8:12 pm",
        status: "read",
        typingDuration: 1000,
      },
      {
        id: "m3",
        type: "incoming",
        text: "Awesome! Can't wait 🎉",
        time: "8:13 pm",
        typingDuration: 800,
      }
    ]
  },
  alexTech: {
    chatType: "individual",
    name: "Alex Rivera",
    status: "last seen today at 8:50 pm",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces&auto=format&q=80",
    unreadCount: 1,
    messages: [
      {
        id: "a1",
        type: "incoming",
        text: "Hey, production build is deployed and all integration tests passed! 🚀",
        time: "8:48 pm",
        typingDuration: 1200,
      },
      {
        id: "a2",
        type: "outgoing",
        text: "Legendary! Monitoring dashboard is all green. Great job!",
        time: "8:50 pm",
        status: "read",
        typingDuration: 900,
      }
    ]
  }
};
