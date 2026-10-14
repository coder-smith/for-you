import { useState, useEffect, useRef, useCallback } from 'react';

export function useChatTimeline(config, options = {}) {
  const { messages = [], animationSettings = {} } = config;
  const speed = animationSettings.speed || 1.0;
  const isAutoPlayInitial = options.autoPlay ?? animationSettings.autoPlay ?? false;

  const [isPlaying, setIsPlaying] = useState(isAutoPlayInitial);
  const [currentStep, setCurrentStep] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [activeTyping, setActiveTyping] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(speed);
  const [isStaticMode, setIsStaticMode] = useState(!isAutoPlayInitial && options.staticMode !== false);

  const timeoutRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const totalSteps = messages.length;

  // Build the complete message state for static mode
  const getFullMessages = useCallback(() => {
    return messages.map(msg => ({ ...msg, isAnimated: false }));
  }, [messages]);

  // Reset to initial
  const resetTimeline = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentStep(0);
    setActiveTyping(null);
    if (isStaticMode) {
      setVisibleMessages(getFullMessages());
    } else {
      setVisibleMessages([]);
    }
    setIsPlaying(false);
  }, [isStaticMode, getFullMessages]);

  // When static mode is toggled
  useEffect(() => {
    if (isStaticMode) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsPlaying(false);
      setActiveTyping(null);
      setVisibleMessages(getFullMessages());
    }
  }, [isStaticMode, getFullMessages]);

  // Step runner
  const executeStep = useCallback((stepIdx) => {
    if (stepIdx >= messages.length) {
      setIsPlaying(false);
      setActiveTyping(null);
      if (animationSettings.loop) {
        timeoutRef.current = setTimeout(() => {
          resetTimeline();
          setIsPlaying(true);
        }, 2000 / playbackSpeed);
      }
      return;
    }

    const currentMsg = messages[stepIdx];
    const typingTime = (currentMsg.typingDuration || 1000) / playbackSpeed;
    const msgDelay = (currentMsg.delay || 800) / playbackSpeed;

    // If incoming message or has typing
    if (currentMsg.type === 'incoming' && typingTime > 0) {
      setActiveTyping({
        sender: currentMsg.sender,
        senderColor: currentMsg.senderColor,
      });

      timeoutRef.current = setTimeout(() => {
        setActiveTyping(null);
        // Reveal message
        setVisibleMessages((prev) => [...prev, { ...currentMsg, isAnimated: true }]);
        setCurrentStep(stepIdx + 1);

        // Schedule next step
        if (isPlayingRef.current) {
          timeoutRef.current = setTimeout(() => {
            executeStep(stepIdx + 1);
          }, msgDelay);
        }
      }, typingTime);
    } else if (currentMsg.type === 'outgoing') {
      const targetStatus = currentMsg.status || 'seen';

      // 1. If configured as single tick or clock
      if (targetStatus === 'sent' || targetStatus === 'single' || targetStatus === 'clock' || targetStatus === 'sending') {
        const outgoingMsg = { ...currentMsg, status: targetStatus, isAnimated: true };
        setVisibleMessages((prev) => [...prev, outgoingMsg]);
        setCurrentStep(stepIdx + 1);

        if (isPlayingRef.current) {
          timeoutRef.current = setTimeout(() => {
            executeStep(stepIdx + 1);
          }, msgDelay);
        }
      } else if (targetStatus === 'delivered' || targetStatus === 'double') {
        // 2. Animate single tick -> double gray tick (delivered)
        const initialMsg = { ...currentMsg, status: 'sent', isAnimated: true };
        setVisibleMessages((prev) => [...prev, initialMsg]);
        setCurrentStep(stepIdx + 1);

        timeoutRef.current = setTimeout(() => {
          setVisibleMessages((prev) =>
            prev.map((m) => (m.id === currentMsg.id ? { ...m, status: 'delivered' } : m))
          );

          if (isPlayingRef.current) {
            timeoutRef.current = setTimeout(() => {
              executeStep(stepIdx + 1);
            }, msgDelay);
          }
        }, 400 / playbackSpeed);
      } else {
        // 3. Animate single tick -> double tick -> blue tick (seen)
        const initialMsg = { ...currentMsg, status: 'sent', isAnimated: true };
        setVisibleMessages((prev) => [...prev, initialMsg]);
        setCurrentStep(stepIdx + 1);

        timeoutRef.current = setTimeout(() => {
          setVisibleMessages((prev) =>
            prev.map((m) => (m.id === currentMsg.id ? { ...m, status: 'delivered' } : m))
          );

          timeoutRef.current = setTimeout(() => {
            setVisibleMessages((prev) =>
              prev.map((m) => (m.id === currentMsg.id ? { ...m, status: 'seen' } : m))
            );

            if (isPlayingRef.current) {
              timeoutRef.current = setTimeout(() => {
                executeStep(stepIdx + 1);
              }, msgDelay);
            }
          }, 350 / playbackSpeed);
        }, 400 / playbackSpeed);
      }
    } else {
      // System message / unread divider
      setVisibleMessages((prev) => [...prev, { ...currentMsg, isAnimated: true }]);
      setCurrentStep(stepIdx + 1);

      if (isPlayingRef.current) {
        timeoutRef.current = setTimeout(() => {
          executeStep(stepIdx + 1);
        }, msgDelay);
      }
    }
  }, [messages, animationSettings.loop, playbackSpeed, resetTimeline]);

  // Start / stop playback
  useEffect(() => {
    if (isPlaying) {
      setIsStaticMode(false);
      if (currentStep >= messages.length) {
        // restart if at end
        setVisibleMessages([]);
        setCurrentStep(0);
        executeStep(0);
      } else {
        executeStep(currentStep);
      }
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying, executeStep]);

  const togglePlay = () => {
    if (isStaticMode) {
      setIsStaticMode(false);
      setVisibleMessages([]);
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const stepForward = () => {
    if (currentStep < messages.length) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsPlaying(false);
      setActiveTyping(null);
      const nextMsg = messages[currentStep];
      setVisibleMessages((prev) => [...prev, { ...nextMsg, isAnimated: true }]);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsPlaying(false);
      setActiveTyping(null);
      setVisibleMessages((prev) => prev.slice(0, prev.length - 1));
      setCurrentStep((prev) => prev - 1);
    }
  };

  const showAllStatic = () => {
    setIsStaticMode(true);
    setCurrentStep(messages.length);
  };

  return {
    isPlaying,
    setIsPlaying,
    togglePlay,
    currentStep,
    totalSteps,
    visibleMessages,
    activeTyping,
    playbackSpeed,
    setPlaybackSpeed,
    resetTimeline,
    stepForward,
    stepBackward,
    isStaticMode,
    showAllStatic,
  };
}
