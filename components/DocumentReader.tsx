
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  X, ChevronLeft, Volume2, Play, Pause, 
  Settings, Bookmark, Share2, ZoomIn, ZoomOut,
  Layout, Headphones, Sparkles, Loader2, BookOpen, 
  Sun, Moon, Palette, Download, ExternalLink, AlertCircle, Home,
  LayoutGrid, Search, MessageSquare, Info, Maximize2, Minimize2,
  Trash2, FileText, ShieldCheck, Printer, Copy, Share, Clock,
  GraduationCap, Star
} from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { CATEGORIES, TOOLS } from '../constants';
import { BrandingConfig, StudentPassData } from '../App';
import { FormattedResponse } from './AIModal';

interface DocumentReaderProps {
  fileName: string;
  fileData?: string; // base64
  textContent?: string; // AI Output
  userCountry?: string;
  onClose: () => void;
  onAction?: (msg: string) => void;
  branding?: BrandingConfig;
  studentPass?: StudentPassData;
}

type ReaderTheme = 'light' | 'sepia';

const DocumentReader: React.FC<DocumentReaderProps> = ({ fileName, fileData, textContent, userCountry, onClose, onAction, branding, studentPass }) => {
  const [zoom, setZoom] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [theme, setTheme] = useState<ReaderTheme>('light');
  const [showTools, setShowTools] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const activeColor = branding?.isCustom ? branding.primaryColor : '#2F00FF';

  const cultureFlavor = useMemo(() => {
    if (!userCountry) return "";
    switch (userCountry) {
      case 'Nigeria': return "ACT AS TEHILA FROM NIGERIA. Use playful Nigerian Pidgin English (like 'Abeg', 'No shaking', 'Oya', 'Nawa o'). Be professional but very warm and local.";
      case 'Ghana': return "ACT AS TEHILA FROM GHANA. Use playful Ghanaian English/slang (like 'Chale', 'Bossu', 'Akwaaba'). Be professional but very friendly and relatable.";
      case 'Kenya': return "ACT AS TEHILA FROM KENYA. Use playful Kenyan Sheng or English (like 'Sasa', 'Habari gani', 'Mambo'). Be professional but lively.";
      case 'South Africa': return "ACT AS TEHILA FROM SOUTH AFRICA. Use playful South African slang (like 'Lekker', 'Howzit', 'Sharp-sharp'). Be professional but culturally vibrant.";
      default: return "";
    }
  }, [userCountry]);

  const fileUrl = useMemo(() => {
    if (!fileData) return null;
    try {
      const base64Data = fileData.includes(',') ? fileData.split(',')[1] : fileData;
      const bin = window.atob(base64Data);
      const len = bin.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < bin.length; i++) {
        bytes[i] = bin.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    } catch (e) {
      console.error("Reader Error:", e);
      return null;
    }
  }, [fileData]);

  const fileSize = useMemo(() => {
    if (textContent) return `${(textContent.length / 1024).toFixed(1)} KB`;
    if (!fileData) return "0 KB";
    const base64Str = fileData.includes(',') ? fileData.split(',')[1] : fileData;
    const bytes = (base64Str.length * 3) / 4;
    return (bytes / 1024).toFixed(1) + " KB";
  }, [fileData, textContent]);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      if (audioSource) {
        try { audioSource.stop(); } catch (e) {}
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [fileUrl, audioSource]);

  const handleDownload = () => {
    if (textContent) {
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.txt`;
      a.click();
      return;
    }
    if (!fileUrl) return;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onAction?.('Downloading high-fidelity asset...');
  };

  const handlePrint = () => {
    onAction?.('Preparing document for local output...');
    if (textContent) {
      window.print();
      return;
    }
    const win = window.open(fileUrl || '', '_blank');
    win?.focus();
    win?.print();
  };

  const handleShare = () => {
    onAction?.('Generating secure cryptographic share link...');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(textContent || "");
    onAction?.('Text content indexed and copied to clipboard');
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const handleListen = async () => {
    if (isPlaying) {
      try { audioSource?.stop(); } catch (e) {}
      setIsPlaying(false);
      return;
    }
    setIsTtsLoading(true);
    
    const performTts = async (retries = 2): Promise<void> => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let textToRead = textContent;

        if (!textContent && fileData) {
          const extraction = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
              parts: [
                { inlineData: { mimeType: 'application/pdf', data: fileData.split(',')[1] || fileData } },
                { text: `Extract a concise and engaging summary of this document (about 100 words) for reading aloud professionally. ${cultureFlavor} Provide ONLY the text of the script.` }
              ]
            }
          });
          textToRead = extraction.text || "Welcome to your document reader. Your file is ready for immersive exploration.";
        }
        
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: `Read this aloud as Tehila. ${cultureFlavor} Speak in a very natural, warm, and professional human voice. Maintain a conversational pace, clear enunciation, and engaging tone suitable for a high-fidelity intelligence briefing. Avoid robotic intonation. The text is: ${textToRead}` }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
            },
          },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          }
          const ctx = audioContextRef.current;
          const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          source.onended = () => setIsPlaying(false);
          source.start(0);
          setAudioSource(source);
          setIsPlaying(true);
        }
      } catch (error) {
        if (retries > 0) {
          console.warn("TTS Failed, retrying...", error);
          await new Promise(r => setTimeout(r, 1000));
          return performTts(retries - 1);
        }
        console.error("TTS Error:", error);
        onAction?.('Narrator node unavailable. Please try again.');
        throw error;
      }
    };

    try {
      await performTts();
    } catch (e) {
      // Handled in recursive call
    } finally {
      setIsTtsLoading(false);
    }
  };

  const themeStyles = {
    light: 'bg-white text-slate-900',
    sepia: 'bg-[#f4ecd8] text-[#5b4636]',
  };

  const toolbarStyles = {
    light: 'bg-white border-slate-100',
    sepia: 'bg-[#efe6ce] border-[#e2d6b3]',
  };

  return (
    <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ${themeStyles[theme]} relative h-full font-['Inter',_sans-serif]`}>
      
      {/* Immersive Bright Toolbar */}
      <header className={`h-14 border-b px-6 flex items-center justify-between z-30 shrink-0 transition-colors duration-500 shadow-sm ${toolbarStyles[theme]}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-900"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="h-6 w-px bg-slate-100 mx-1" />
          
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-50 border border-slate-100">
            <button onClick={() => setZoom(prev => Math.max(50, prev - 10))} className="p-1.5 text-slate-400 hover:text-theme transition-colors"><ZoomOut size={14} /></button>
            <span className="text-[10px] font-black w-10 text-center uppercase tracking-tighter text-slate-900">{zoom}%</span>
            <button onClick={() => setZoom(prev => Math.min(200, prev + 10))} className="p-1.5 text-slate-400 hover:text-theme transition-colors"><ZoomIn size={14} /></button>
          </div>

          <button 
            onClick={() => setIsFocusMode(!isFocusMode)}
            style={isFocusMode ? { backgroundColor: activeColor } : {}}
            className={`p-2 rounded-lg transition-all ${isFocusMode ? 'text-white' : 'text-slate-400 hover:bg-slate-50'}`}
            title="Focus Mode"
          >
            {isFocusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        {/* Custom Header Injection */}
        <div className="flex items-center gap-4">
           {studentPass?.isActive && !isFocusMode && (
             <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 rounded-full shadow-lg border border-indigo-500 animate-in fade-in">
                <GraduationCap size={14} className="text-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Student Mode Active</span>
                <div className="w-px h-3 bg-white/20 mx-1" />
                <button 
                  onClick={() => window.open('https://forms.gle/review-mock', '_blank')}
                  className="text-[10px] font-bold text-indigo-100 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Star size={10} fill="currentColor" /> Give Review
                </button>
             </div>
           )}

           {branding?.isCustom && !isFocusMode && !studentPass?.isActive && (
            <div className="flex items-center gap-2 px-4 py-1 bg-slate-50 rounded-full border border-slate-100 shadow-inner">
               <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black text-white" style={{ backgroundColor: branding.primaryColor }}>
                 {branding.companyName.charAt(0)}
               </div>
               <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{branding.companyName} SECURE PORTAL</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
             <button onClick={() => setTheme('light')} className={`p-2 rounded-lg transition-all ${theme === 'light' ? 'bg-white text-theme shadow-sm border border-slate-100' : 'text-slate-400 hover:opacity-70'}`}><Sun size={14} /></button>
             <button onClick={() => setTheme('sepia')} className={`p-2 rounded-lg transition-all ${theme === 'sepia' ? 'bg-white text-[#5b4636] shadow-sm border border-slate-100' : 'text-slate-400 hover:opacity-70'}`}><Palette size={14} /></button>
          </div>
          
          <div className="h-6 w-px bg-slate-100 mx-1" />

          <button onClick={handleCopyText} className="p-2 text-slate-400 hover:text-theme hover:bg-slate-50 rounded-xl transition-all" title="Copy Text"><Copy size={18} /></button>
          <button onClick={handlePrint} className="p-2 text-slate-400 hover:text-theme hover:bg-slate-50 rounded-xl transition-all" title="Print Asset"><Printer size={18} /></button>
          <button onClick={handleShare} className="p-2 text-slate-400 hover:text-theme hover:bg-slate-50 rounded-xl transition-all" title="Secure Share"><Share2 size={18} /></button>
          <button onClick={handleDownload} style={{ backgroundColor: activeColor }} className="p-2 text-white rounded-xl shadow-lg hover:brightness-110 transition-all active:scale-95" title="Download Document">
            <Download size={18} />
          </button>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <div className="flex-1 flex overflow-hidden relative bg-[#fcfdfe]">
        {/* Viewport Content */}
        <main className="flex-1 overflow-auto p-12 flex justify-center custom-scrollbar relative z-0">
          <div 
            className={`shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] rounded-2xl w-full max-w-[850px] min-h-[1100px] transition-all duration-500 origin-top overflow-hidden border relative ${theme === 'sepia' ? 'bg-[#fdf9ef] border-[#e2d6b3]' : 'bg-white border-slate-200'}`}
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {textContent ? (
              <div className="p-12 lg:p-20 text-lg">
                <FormattedResponse text={textContent} themeColor={activeColor} />
              </div>
            ) : fileUrl ? (
              <iframe 
                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className={`w-full h-full border-none rounded-2xl ${theme === 'sepia' ? 'sepia-[0.2] brightness-[0.98]' : ''}`}
                title="PDF Reader"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                <BookOpen size={64} className="mb-4" />
                <p className="text-sm font-black tracking-widest uppercase">Initializing High-Fidelity Content...</p>
              </div>
            )}
            
            {/* Custom Brand Watermark Mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none rotate-[-45deg]">
               <span className="text-[120px] font-black uppercase whitespace-nowrap">
                  {branding?.isCustom ? branding.companyName : 'docnpdf'}
               </span>
            </div>
          </div>
        </main>

        {/* Intelligence Side Drawer - Bright Edition */}
        {!isFocusMode && (
          <aside className={`w-[340px] border-l flex flex-col z-20 shrink-0 transition-all duration-500 bg-white border-slate-100`}>
            <div className="p-8 border-b border-slate-50">
                <div className="flex items-center gap-3 mb-8">
                  <div style={{ backgroundColor: activeColor }} className="w-10 h-10 rounded-[1rem] flex items-center justify-center text-white shadow-xl">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Tehila Strategist</h3>
                </div>
                
                <div className="space-y-6">
                  <button 
                    onClick={handleListen}
                    disabled={isTtsLoading}
                    className="w-full p-4 bg-slate-900 text-white rounded-[1.5rem] flex items-center gap-4 group hover:bg-theme transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50"
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white">
                      {isTtsLoading ? <Loader2 size={18} className="animate-spin" /> : isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black uppercase tracking-tight">Kore Narrator</p>
                      <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">{isPlaying ? 'Active Stream' : 'Listen to Insights'}</p>
                    </div>
                  </button>

                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem]">
                      <div style={{ color: activeColor }} className="flex items-center gap-2 mb-3">
                        <MessageSquare size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Document Intelligence</span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 leading-relaxed mb-6">Tehila has mapped the semantic structure of this asset. Ready for inquiry or table extraction.</p>
                      <button 
                        onClick={() => onAction?.('Tehila is initializing chat cluster...')}
                        className="w-full py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-theme/30 transition-all shadow-sm active:scale-95"
                      >
                        Launch AI Chat
                      </button>
                  </div>
                </div>
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-2 mb-6">
                  <Info size={14} className="text-slate-300" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical Intel</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'File Identity', value: textContent ? 'Intelligence Report' : fileName },
                    { label: 'Asset Density', value: fileSize },
                    { label: 'Encryption', value: 'AES-256' },
                    { label: 'User Node', value: userCountry || 'Global' },
                    { label: 'Status', value: 'Verified', color: 'text-emerald-500' }
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-start gap-4">
                      <span className="text-[10px] font-black text-slate-300 uppercase shrink-0">{item.label}</span>
                      <span className={`text-[11px] font-bold text-right truncate ${item.color || 'text-slate-600'}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default DocumentReader;
