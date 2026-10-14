import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// Singleton FFmpeg instance (loaded once)
let ffmpegInstance = null;
let ffmpegLoading = false;
let ffmpegLoaded = false;

async function getFFmpeg(onLog) {
  if (ffmpegLoaded && ffmpegInstance) return ffmpegInstance;
  if (ffmpegLoading) {
    // Wait until the existing load finishes
    while (ffmpegLoading) await new Promise((r) => setTimeout(r, 100));
    return ffmpegInstance;
  }

  ffmpegLoading = true;
  const ff = new FFmpeg();
  if (onLog) ff.on('log', ({ message }) => onLog(message));

  // Load WASM core from CDN (no CORS issues since we have COEP headers)
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  await ff.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  ffmpegInstance = ff;
  ffmpegLoaded = true;
  ffmpegLoading = false;
  return ff;
}

export function useVideoRecorder(canvasRef) {
  const [isRecording, setIsRecording] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);

  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const stopCapturingRef = useRef(null);

  // ── Screenshot (PNG) ──────────────────────────────────────────────────────
  const captureScreenshot = useCallback(async (filename = 'whatsapp-chat-1080x1920.png') => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await toPng(canvasRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Screenshot failed:', err);
    }
  }, [canvasRef]);

  // ── Start Recording (captures live canvas frames → WebM) ─────────────────
  const startRecording = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      recordedChunksRef.current = [];
      setIsRecording(true);
      setRecordedVideoUrl(null);

      // Offscreen canvas mirrors the 1080×1920 chat canvas
      const offscreen = document.createElement('canvas');
      offscreen.width = 1080;
      offscreen.height = 1920;
      const ctx = offscreen.getContext('2d');

      const stream = offscreen.captureStream(30); // 30 fps

      // Prefer VP9 WebM for quality; fall back gracefully
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : '';

      const recorder = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
        videoBitsPerSecond: 8_000_000, // 8 Mbps
      });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const webmBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        await convertToMp4(webmBlob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100);

      // Frame render loop: html-to-image → offscreen canvas
      let active = true;
      stopCapturingRef.current = () => { active = false; };

      const element = canvasRef.current;
      const renderFrame = async () => {
        if (!active) return;
        try {
          const dataUrl = await toPng(element, { quality: 0.92, pixelRatio: 1 });
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, 1080, 1920);
            ctx.drawImage(img, 0, 0, 1080, 1920);
            if (active) requestAnimationFrame(renderFrame);
          };
          img.src = dataUrl;
        } catch {
          if (active) requestAnimationFrame(renderFrame);
        }
      };

      renderFrame();
    } catch (err) {
      console.error('Recording start failed:', err);
      setIsRecording(false);
    }
  }, [canvasRef]);

  // ── Stop Recording ────────────────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    if (stopCapturingRef.current) {
      stopCapturingRef.current();
      stopCapturingRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  // ── WebM → MP4 via ffmpeg.wasm ────────────────────────────────────────────
  const convertToMp4 = useCallback(async (webmBlob) => {
    setIsConverting(true);
    setConvertProgress(0);
    try {
      const ff = await getFFmpeg((msg) => console.log('[ffmpeg]', msg));

      ff.on('progress', ({ progress }) => {
        setConvertProgress(Math.round(Math.min(progress * 100, 99)));
      });

      // Write input
      await ff.writeFile('input.webm', await fetchFile(webmBlob));

      // Re-mux WebM VP9 → MP4 with H.264 (universally playable)
      await ff.exec([
        '-i', 'input.webm',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '18',          // near-lossless quality
        '-pix_fmt', 'yuv420p', // iOS/Android compatible
        '-movflags', '+faststart',
        '-an',                 // no audio track needed
        'output.mp4',
      ]);

      const data = await ff.readFile('output.mp4');
      const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(mp4Blob);
      setRecordedVideoUrl(url);

      // Auto-download
      const a = document.createElement('a');
      a.href = url;
      a.download = `whatsapp-reel-${Date.now()}.mp4`;
      a.click();

      // Cleanup ffmpeg virtual FS
      await ff.deleteFile('input.webm');
      await ff.deleteFile('output.mp4');

      setConvertProgress(100);
    } catch (err) {
      console.error('MP4 conversion failed:', err);
      alert('MP4 conversion failed. Downloading as WebM instead.\n\n' + err.message);
      // Fallback: download the raw WebM
      const url = URL.createObjectURL(webmBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `whatsapp-reel-${Date.now()}.webm`;
      a.click();
    } finally {
      setIsConverting(false);
    }
  }, []);

  return {
    isRecording,
    isConverting,
    convertProgress,
    recordedVideoUrl,
    startRecording,
    stopRecording,
    captureScreenshot,
  };
}
