
import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Loader2, Sparkles, ShieldCheck, Zap, Video, Download, RotateCcw, AlertCircle, ExternalLink } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LOADING_MESSAGES = [
  "Architecting your cinematic demo...",
  "Rendering high-fidelity cryptographic signatures...",
  "Synchronizing document intelligence visuals...",
  "Applying brand-specific depth layers...",
  "Finalizing high-resolution output node...",
];

const DemoVideoModal: React.FC<DemoVideoModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'checking-key' | 'generating' | 'completed' | 'error'>('idle');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      checkKeyAndInitiate();
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: any;
    if (status === 'generating') {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const checkKeyAndInitiate = async () => {
    setStatus('checking-key');
    try {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(selected);
      if (selected) {
        generateDemo();
      }
    } catch (e) {
      console.error("Key check error", e);
      setStatus('error');
    }
  };

  const handleSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
      generateDemo();
    } catch (e) {
      console.error("Key selection error", e);
    }
  };

  const generateDemo = async () => {
    setStatus('generating');
    setErrorMessage(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = "A high-fidelity cinematic 3D animation of a secure digital document signing process. A sleek document appears in a professional workspace. A vibrant blue digital signature is applied, which then glows and transforms into a golden holographic shield, representing bank-level encryption. Professional lighting, 4k resolution style, clean aesthetic.";

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
        setStatus('completed');
      } else {
        throw new Error("No video URI returned.");
      }
    } catch (error: any) {
      console.error("Video Generation Error:", error);
      if (error.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
      }
      setErrorMessage(error.message || "Failed to generate video. The AI node is currently at capacity.");
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="max-w-5xl w-full relative group">
        {/* Layered Depth Effect mirroring logo */}
        <div className="absolute w-[95%] h-[95%] bg-[#1A73E8] rounded-[2.5rem] bottom-0 left-0 translate-y-6 -translate-x-6 opacity-30 shadow-2xl" />
        <div className="absolute w-[95%] h-[95%] bg-[#F9BC00] rounded-[2.5rem] top-0 right-0 -translate-y-6 translate-x-6 opacity-40 shadow-2xl" />
        
        <div className="relative z-10 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 flex flex-col min-h-[500px]">
          {/* Header */}
          <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                <Video size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Intelligence Demo Studio</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Model: Veo 3.1 Fast</span>
                  <span className="w-1 h-1 rounded-full bg-slate-200" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Video Tunnel</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-900">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 bg-slate-50 p-10 flex items-center justify-center">
            {status === 'checking-key' && (
              <div className="text-center">
                <Loader2 size={48} className="text-blue-600 animate-spin mx-auto mb-6" />
                <p className="text-slate-900 font-bold">Verifying authorization...</p>
              </div>
            )}

            {!hasApiKey && status === 'checking-key' === false && (
              <div className="text-center max-w-md animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center text-amber-600 mx-auto mb-8 shadow-inner">
                  <Zap size={40} fill="currentColor" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4 uppercase">API Key Required</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-10">
                  Video generation requires a paid API key. Please visit the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-blue-600 underline">billing documentation</a> and select a valid key.
                </p>
                <button 
                  onClick={handleSelectKey}
                  className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3"
                >
                  <ShieldCheck size={20} /> Select API Key
                </button>
              </div>
            )}

            {status === 'generating' && (
              <div className="flex flex-col items-center text-center animate-in fade-in duration-500">
                <div className="relative mb-12">
                  <div className="w-32 h-32 border-[6px] border-blue-100 rounded-full border-t-blue-600 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={40} className="text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">{LOADING_MESSAGES[loadingMsgIdx]}</h3>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Processing high-fidelity node...</p>
              </div>
            )}

            {status === 'completed' && videoUrl && (
              <div className="w-full flex flex-col gap-8 animate-in zoom-in duration-500">
                <div className="aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200">
                  <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={() => { setVideoUrl(null); generateDemo(); }}
                    className="px-10 py-4 bg-white border border-slate-200 rounded-xl font-black text-[11px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-3"
                  >
                    <RotateCcw size={16} /> Re-Generate
                  </button>
                  <a 
                    href={videoUrl} 
                    download="docnpdf_demo.mp4"
                    className="px-10 py-4 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center gap-3"
                  >
                    <Download size={16} /> Download MP4
                  </a>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center max-w-md animate-in shake duration-500">
                <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-600 mx-auto mb-8 shadow-inner">
                  <AlertCircle size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4 uppercase">Generation Halted</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-10">
                  {errorMessage}
                </p>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={generateDemo}
                    className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl"
                  >
                    Try Again
                  </button>
                  {!hasApiKey && (
                    <button 
                      onClick={handleSelectKey}
                      className="text-blue-600 font-black text-[11px] uppercase tracking-widest hover:underline"
                    >
                      Change API Key
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 opacity-40">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Encrypted</span>
              </div>
              <div className="flex items-center gap-2 opacity-40">
                <ExternalLink size={14} className="text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest">Global Node: NY-V1</span>
              </div>
            </div>
            <p className="text-[9px] font-black uppercase text-slate-300 tracking-[0.3em]">AI Studio v5.1.0-Veo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoVideoModal;
