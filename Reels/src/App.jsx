import React, { useState, useRef, useEffect, useCallback } from 'react';
import WhatsAppContainer from './components/WhatsAppContainer';
import TimelineControls from './components/TimelineControls';
import ConfigPanel from './components/ConfigPanel';
import VideoPreviewModal from './components/VideoPreviewModal';
import { defaultChatConfig } from './data/defaultChatConfig';
import { useChatTimeline } from './hooks/useChatTimeline';
import { useVideoRecorder } from './hooks/useVideoRecorder';
import { Smartphone, Video, Sliders, Maximize2, Minimize2, Save, Check, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'wa_reels_saved_chat_config_v1';

export default function App() {
  // Load saved config from localStorage if present
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load saved chat config:', e);
    }
    return defaultChatConfig;
  });

  const [scaleMode, setScaleMode] = useState('fit'); // 'fit' | 'fill' | '0.38' | '0.5' | '0.75' | '1.0'
  const [computedScale, setComputedScale] = useState(0.48);
  const [isVideoPreviewOpen, setIsVideoPreviewOpen] = useState(false);
  const [composerText, setComposerText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPureEdgeToEdge, setIsPureEdgeToEdge] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const canvasRef = useRef(null);
  const viewportRef = useRef(null);

  // Auto-save to localStorage whenever config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to auto-save chat config:', e);
    }
  }, [config]);

  // Explicit Save button action
  const handleManualSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    } catch (e) {
      alert('Failed to save to browser storage');
    }
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (window.confirm('Reset chat configuration back to default sample messages?')) {
      setConfig(defaultChatConfig);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Timeline playback hook
  const timeline = useChatTimeline(config, {
    autoPlay: false,
    staticMode: true,
  });

  // Video & Screenshot export hook
  const recorder = useVideoRecorder(canvasRef);

  // Calculate auto-fit scale
  const updateScale = useCallback(() => {
    if (scaleMode !== 'fit' && scaleMode !== 'fill') {
      setComputedScale(parseFloat(scaleMode));
      return;
    }

    if (viewportRef.current) {
      const rect = viewportRef.current.getBoundingClientRect();
      const padding = isPureEdgeToEdge ? 0 : 16;
      const availableWidth = Math.max(rect.width - padding * 2, 100);
      const availableHeight = Math.max(rect.height - padding * 2, 100);

      const scaleX = availableWidth / 1080;
      const scaleY = availableHeight / 1920;

      // Fit: aspect ratio preserving fill
      const scale = Math.min(scaleX, scaleY);
      setComputedScale(Math.max(scale, 0.2));
    }
  }, [scaleMode, isPureEdgeToEdge]);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale, isSidebarOpen, isPureEdgeToEdge]);

  // Handle composer live sending
  const handleComposerSend = (text) => {
    if (!text.trim()) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeStr = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

    const newMsg = {
      id: `msg-${Date.now()}`,
      type: 'outgoing',
      text: text,
      time: timeStr,
      status: 'seen',
      delay: 800,
    };

    setConfig((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), newMsg],
    }));
    setComposerText("");
  };

  const scaledWidth = Math.round(1080 * computedScale);
  const scaledHeight = Math.round(1920 * computedScale);

  return (
    <div className={`studio-app ${isPureEdgeToEdge ? 'pure-edge-mode' : ''}`}>
      {/* Top Studio Nav (hidden in pure edge mode) */}
      {!isPureEdgeToEdge && (
        <header className="studio-top-nav">
          <div className="studio-brand">
            <div className="studio-logo-icon">WA</div>
            <span className="studio-title">WhatsApp Android Reels Studio</span>
            <span className="studio-badge">1080 × 1920 (9:16)</span>
          </div>

          <div className="studio-nav-actions">
            {/* Save Button */}
            <button
              type="button"
              className={`wa-tool-btn ${saveToast ? 'wa-tool-btn-primary' : 'wa-save-highlight-btn'}`}
              onClick={handleManualSave}
              title="Save all chat changes to browser storage"
            >
              {saveToast ? <Check size={15} color="#fff" /> : <Save size={15} />}
              <span>{saveToast ? "Saved!" : "Save Chat"}</span>
            </button>

            {/* Reset to Default */}
            <button
              type="button"
              className="wa-tool-btn icon-only"
              onClick={handleResetToDefault}
              title="Reset to default sample chat"
            >
              <RotateCcw size={14} />
            </button>

            {/* Zoom / Scale selector */}
            <select
              className="scale-select"
              value={scaleMode}
              onChange={(e) => setScaleMode(e.target.value)}
              title="Canvas Scale"
            >
              <option value="fit">Fit Screen Height (100%)</option>
              <option value="0.38">38% Scale</option>
              <option value="0.5">50% Scale</option>
              <option value="0.75">75% Scale</option>
              <option value="1.0">100% Native (1080x1920)</option>
            </select>

            {/* Toggle Edge to Edge Full Screen */}
            <button
              type="button"
              className="wa-tool-btn wa-tool-btn-accent"
              onClick={() => setIsPureEdgeToEdge(true)}
              title="Fit Full Screen Window"
            >
              <Maximize2 size={15} />
              <span>Fit Fullscreen</span>
            </button>

            {/* Toggle Android Bar */}
            <button
              type="button"
              className="wa-tool-btn"
              onClick={() => setConfig(prev => ({ ...prev, showAndroidNav: !prev.showAndroidNav }))}
            >
              <Smartphone size={15} />
              <span>{config.showAndroidNav ? "Nav Bar On" : "Nav Bar Off"}</span>
            </button>

            {/* Preview Video Button */}
            <button
              type="button"
              className="wa-tool-btn"
              onClick={() => setIsVideoPreviewOpen(true)}
            >
              <Video size={15} />
              <span>Video Mode</span>
            </button>

            {/* Toggle Sidebar */}
            <button
              type="button"
              className={`wa-tool-btn ${isSidebarOpen ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(prev => !prev)}
              title="Toggle Config Editor"
            >
              <Sliders size={15} />
              <span>Config Panel</span>
            </button>
          </div>
        </header>
      )}

      {/* Floating Exit Edge button */}
      {isPureEdgeToEdge && (
        <button
          type="button"
          className="wa-exit-edge-btn"
          onClick={() => setIsPureEdgeToEdge(false)}
          title="Exit Full Screen View"
        >
          <Minimize2 size={16} />
          <span>Exit Fullscreen</span>
        </button>
      )}

      {/* Main Workspace Split */}
      <div className="studio-workspace">
        {/* Stage Canvas Area */}
        <section className="studio-stage-area">
          <div className="studio-canvas-viewport" ref={viewportRef}>
            {/* Outer box constrained strictly to scaled visual boundaries */}
            <div
              className="studio-canvas-scaler-box"
              style={{
                width: scaledWidth,
                height: scaledHeight,
              }}
            >
              <div
                className="studio-canvas-scaler"
                style={{
                  width: 1080,
                  height: 1920,
                  transform: `scale(${computedScale})`,
                  transformOrigin: 'top left',
                }}
              >
                <WhatsAppContainer
                  ref={canvasRef}
                  config={config}
                  messages={timeline.visibleMessages}
                  activeTyping={timeline.activeTyping}
                  composerText={composerText}
                  onComposerChange={setComposerText}
                  onComposerSend={handleComposerSend}
                  showAndroidNav={config.showAndroidNav !== false}
                />
              </div>
            </div>
          </div>

          {/* Bottom Animation Timeline Toolbar (hidden in pure edge mode) */}
          {!isPureEdgeToEdge && (
            <TimelineControls
              isPlaying={timeline.isPlaying}
              togglePlay={timeline.togglePlay}
              currentStep={timeline.currentStep}
              totalSteps={timeline.totalSteps}
              stepForward={timeline.stepForward}
              stepBackward={timeline.stepBackward}
              resetTimeline={timeline.resetTimeline}
              isStaticMode={timeline.isStaticMode}
              showAllStatic={timeline.showAllStatic}
              playbackSpeed={timeline.playbackSpeed}
              setPlaybackSpeed={timeline.setPlaybackSpeed}
              onOpenPreviewMode={() => setIsVideoPreviewOpen(true)}
              onCaptureScreenshot={() => recorder.captureScreenshot(`whatsapp-reel-${Date.now()}.png`)}
              onStartRecording={recorder.startRecording}
              onStopRecording={recorder.stopRecording}
              isRecording={recorder.isRecording}
              isConverting={recorder.isConverting}
              convertProgress={recorder.convertProgress}
            />
          )}
        </section>

        {/* Right Sidebar Config Panel (hidden in pure edge mode) */}
        {!isPureEdgeToEdge && isSidebarOpen && (
          <aside className="studio-sidebar">
            <ConfigPanel
              config={config}
              onChangeConfig={setConfig}
              onSaveConfig={handleManualSave}
              saveToast={saveToast}
            />
          </aside>
        )}
      </div>

      {/* Pure 1080x1920 Video Preview Mode Modal */}
      <VideoPreviewModal
        config={config}
        isOpen={isVideoPreviewOpen}
        onClose={() => setIsVideoPreviewOpen(false)}
      />
    </div>
  );
}
