import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Eye,
  Video,
  Camera,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function TimelineControls({
  isPlaying,
  togglePlay,
  currentStep,
  totalSteps,
  stepForward,
  stepBackward,
  resetTimeline,
  isStaticMode,
  showAllStatic,
  playbackSpeed,
  setPlaybackSpeed,
  onOpenPreviewMode,
  onCaptureScreenshot,
  onStartRecording,
  onStopRecording,
  isRecording,
  isConverting = false,
  convertProgress = 0,
}) {
  const speeds = [0.5, 1.0, 1.5, 2.0];
  const progressPercent = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  return (
    <div className="wa-timeline-toolbar">
      {/* Playback Controls */}
      <div className="wa-toolbar-section">
        <button
          type="button"
          className="wa-tool-btn wa-tool-btn-primary"
          onClick={togglePlay}
          title={isPlaying ? "Pause (Space)" : "Play Animation (Space)"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
          <span>{isPlaying ? "Pause" : "Play Reel"}</span>
        </button>

        <button
          type="button"
          className="wa-tool-btn"
          onClick={resetTimeline}
          title="Restart Animation"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>

        <div className="wa-btn-group">
          <button
            type="button"
            className="wa-tool-btn icon-only"
            onClick={stepBackward}
            disabled={currentStep <= 0}
            title="Step Back"
          >
            <SkipBack size={16} />
          </button>
          <button
            type="button"
            className="wa-tool-btn icon-only"
            onClick={stepForward}
            disabled={currentStep >= totalSteps}
            title="Step Forward"
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* View Mode Toggle */}
        <button
          type="button"
          className={`wa-tool-btn ${isStaticMode ? 'active' : ''}`}
          onClick={showAllStatic}
          title="Show all messages static"
        >
          <Layers size={16} />
          <span>Show All</span>
        </button>
      </div>

      {/* Progress & Speed */}
      <div className="wa-toolbar-section progress-section">
        <div className="wa-progress-info">
          <span className="wa-step-label">
            Step <strong>{currentStep}</strong> of <strong>{totalSteps}</strong>
          </span>
          <span className="wa-progress-label">{progressPercent}%</span>
        </div>
        <div className="wa-timeline-progress-bar">
          <div
            className="wa-timeline-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Speed Selector */}
      <div className="wa-toolbar-section speed-section">
        <div className="wa-speed-chips">
          {speeds.map((s) => (
            <button
              key={s}
              type="button"
              className={`wa-chip ${playbackSpeed === s ? 'active' : ''}`}
              onClick={() => setPlaybackSpeed(s)}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Video Preview & Export Actions */}
      <div className="wa-toolbar-section action-section">
        <button
          type="button"
          className="wa-tool-btn wa-tool-btn-accent"
          onClick={onOpenPreviewMode}
          title="Open Pure Video Preview Mode (1080x1920 without any UI chrome)"
        >
          <Video size={17} />
          <span>Preview Video</span>
        </button>

        {/* Record / Convert button */}
        {isConverting ? (
          <button
            type="button"
            className="wa-tool-btn wa-converting-btn"
            disabled
            title="Converting WebM → MP4 via ffmpeg.wasm…"
          >
            <span className="wa-convert-spinner" />
            <span>Converting… {convertProgress}%</span>
          </button>
        ) : (
          <button
            type="button"
            className={`wa-tool-btn ${isRecording ? 'wa-recording-btn' : ''}`}
            onClick={isRecording ? onStopRecording : onStartRecording}
            title={isRecording ? 'Stop recording and export MP4' : 'Record canvas and export as MP4'}
          >
            <span className={`wa-record-dot ${isRecording ? 'pulsing' : ''}`} />
            <span>{isRecording ? 'Stop & Export MP4' : 'Export MP4'}</span>
          </button>
        )}

        <button
          type="button"
          className="wa-tool-btn icon-only"
          onClick={onCaptureScreenshot}
          title="Capture HD Screenshot (PNG)"
        >
          <Camera size={16} />
        </button>
      </div>
    </div>
  );
}
