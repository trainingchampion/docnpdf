
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, X, RotateCcw, Check, Zap, Loader2, StopCircle, Play } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (file: File, base64: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setIsInitializing(true);
    setError(null);
    try {
      const constraints = {
        video: { facingMode: 'environment' },
        audio: mode === 'video'
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setError("Unable to access camera. Please check permissions.");
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setPreview(dataUrl);
    stopCamera();
  };

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setPreview(url);
      stopCamera();
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRetake = () => {
    setPreview(null);
    startCamera();
  };

  const handleConfirm = async () => {
    if (!preview) return;

    if (mode === 'photo') {
      const res = await fetch(preview);
      const blob = await res.blob();
      const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
      const base64 = preview.split(',')[1];
      onCapture(file, base64);
    } else {
      const res = await fetch(preview);
      const blob = await res.blob();
      const file = new File([blob], `capture_${Date.now()}.webm`, { type: 'video/webm' });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        onCapture(file, base64);
      };
      reader.readAsDataURL(blob);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Camera size={20} />
          </div>
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-[12px]">Capture Asset</h3>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">High-Fidelity Input</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {!preview ? (
          <div className="relative w-full max-w-4xl aspect-[4/3] bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
            {isInitializing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/40">
                <Loader2 size={48} className="animate-spin text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Initializing Hardware...</span>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <X size={48} className="text-rose-500 mb-4" />
                <p className="text-white font-bold mb-6">{error}</p>
                <button 
                  onClick={startCamera}
                  className="px-8 py-3 bg-white text-black rounded-xl font-black text-[11px] uppercase tracking-widest"
                >
                  Retry Access
                </button>
              </div>
            ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
            )}
            
            {/* HUD */}
            {!isInitializing && !error && (
              <div className="absolute top-6 left-6 flex gap-4">
                <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">
                    {isRecording ? 'Recording' : 'Live Preview'}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full max-w-4xl aspect-[4/3] bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
            {mode === 'photo' ? (
              <img src={preview} className="w-full h-full object-cover" alt="Capture Preview" />
            ) : (
              <video src={preview} controls autoPlay loop className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-12 flex flex-col items-center gap-10">
        {!preview ? (
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <button 
                onClick={() => setMode('photo')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'photo' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
              >
                <Camera size={14} className="inline mr-2" /> Photo
              </button>
              <button 
                onClick={() => setMode('video')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'video' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
              >
                <Video size={14} className="inline mr-2" /> Video
              </button>
            </div>

            <div className="relative">
              {mode === 'photo' ? (
                <button 
                  onClick={takePhoto}
                  className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                >
                  <div className="w-16 h-16 rounded-full border-2 border-black/10" />
                </button>
              ) : (
                <button 
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all ${isRecording ? 'bg-rose-500' : 'bg-white'}`}
                >
                  {isRecording ? (
                    <StopCircle size={32} className="text-white fill-current" />
                  ) : (
                    <div className="w-10 h-10 bg-rose-500 rounded-full" />
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-6">
            <button 
              onClick={handleRetake}
              className="flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[1.5rem] font-black text-[13px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
            >
              <RotateCcw size={18} /> Retake
            </button>
            <button 
              onClick={handleConfirm}
              className="flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-[13px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
            >
              <Check size={18} /> Use Capture
            </button>
          </div>
        )}
        
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
          Powered by Gemini Intelligence v4.8
        </p>
      </div>
    </div>
  );
};

export default CameraCapture;
