import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { PhoneOff, Mic, MicOff, Globe, Loader2, AlertCircle, Phone, X } from 'lucide-react';

interface LiveCallOverlayProps {
  onClose: () => void;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
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
}

const LiveCallOverlay: React.FC<LiveCallOverlayProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);
  const sessionRef = useRef<any>(null);
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const ringOscillatorsRef = useRef<any[]>([]);
  const ringIntervalRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const stopRinging = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    ringOscillatorsRef.current.forEach(item => {
      try { 
        item.osc.stop(); 
        item.osc.disconnect(); 
        item.gain.disconnect();
      } catch(e) {}
    });
    ringOscillatorsRef.current = [];
  };

  const startRinging = (ctx: AudioContext) => {
    stopRinging();
    
    const playRing = () => {
      const now = ctx.currentTime;
      [440, 480].forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
        gain.gain.setValueAtTime(0.05, now + 2);
        gain.gain.linearRampToValueAtTime(0, now + 2.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.1);
        ringOscillatorsRef.current.push({ osc, gain });
      });
    };

    playRing();
    ringIntervalRef.current = setInterval(() => {
      playRing();
    }, 6000);
  };

  useEffect(() => {
    let isMounted = true;

    const setupLive = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

        const outCtx = audioContextOutRef.current;
        if (outCtx) {
          await outCtx.resume();
          startRinging(outCtx);
        }

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              if (!isMounted) return;
              stopRinging();
              setStatus('connected');
              const ctx = audioContextInRef.current;
              if (!ctx) return;

              // Force Tehila to start the conversation by sending a hidden text nudge
              sessionPromise.then((session) => {
                session.sendRealtimeInput({
                  text: "The user has just entered the call. Please initiate your professional introduction and pitch as the Document Strategist at DocnPDF. Ask what document challenge we can solve today."
                });
              });

              const source = ctx.createMediaStreamSource(stream);
              const scriptProcessor = ctx.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                if (isMutedRef.current) return;
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const pcmBlob = {
                  data: encode(new Uint8Array(int16.buffer)),
                  mimeType: 'audio/pcm;rate=16000',
                };
                
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                }).catch(err => console.error("Send error:", err));
              };

              source.connect(scriptProcessor);
              scriptProcessor.connect(ctx.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (base64EncodedAudioString && audioContextOutRef.current && audioContextOutRef.current.state !== 'closed') {
                const ctx = audioContextOutRef.current;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                // Fix: Correct variable name from base64AudioString to base64EncodedAudioString
                const audioBuffer = await decodeAudioData(decode(base64EncodedAudioString), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                });
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }

              if (message.serverContent?.interrupted) {
                for (const source of sourcesRef.current.values()) {
                  try { source.stop(); } catch(e) {}
                  sourcesRef.current.delete(source);
                }
                nextStartTimeRef.current = 0;
              }
            },
            onerror: (e) => {
              console.error('Live error:', e);
              if (isMounted) {
                stopRinging();
                setStatus('error');
              }
            },
            onclose: () => {
              if (isMounted) onClose();
            },
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
            },
            systemInstruction: `You are Tehila, the highly professional, persuasive, and elite Document Strategist for DocnPDF. 
            
            IMPORTANT: You MUST initiate the conversation. Do not wait for the user to speak. Introduce yourself immediately as the Document Strategist. Deliver a short, compelling pitch about how DocnPDF transforms document friction into high-fidelity intelligence.
            
            LEAD COLLECTION PROTOCOL:
            As the conversation reaches its natural conclusion or if the user is ready to proceed with an enterprise inquiry, you MUST proactively request their phone number and email address. 
            
            Example closing: "Before we conclude, I'd like to have our strategy team reach out with a tailored implementation plan. May I get your professional email and a direct phone number to facilitate this?"
            
            FORM FALLBACK:
            If the user is hesitant to provide details over voice, direct them to our website's 'Contact Us' form where they can submit a formal inquiry for our engineering team to review.
            
            Your personality is human-expert, authoritative, and helpful. You represent the bridge between raw document data and organizational wisdom.`,
          },
        });

        sessionRef.current = await sessionPromise;
      } catch (err) {
        console.error('Setup error:', err);
        if (isMounted) {
          stopRinging();
          setStatus('error');
        }
      }
    };

    setupLive();

    return () => {
      isMounted = false;
      stopRinging();
      if (sessionRef.current) try { sessionRef.current.close(); } catch(e) {}
      for (const source of sourcesRef.current.values()) try { source.stop(); } catch(e) {}
      sourcesRef.current.clear();
      [audioContextInRef.current, audioContextOutRef.current].forEach(ctx => {
        if (ctx && ctx.state !== 'closed') try { ctx.close(); } catch (e) {}
      });
    };
  }, [onClose]);

  if (status === 'error') {
    return (
      <div className="fixed bottom-10 right-10 z-[200]">
        <div className="bg-rose-600 text-white px-6 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-white/20 animate-in fade-in">
          <AlertCircle size={20} />
          <span className="text-sm font-black uppercase tracking-widest">Network Outage</span>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all ml-4">
             <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-10 right-10 z-[200] animate-in slide-in-from-right-8 fade-in duration-500">
      <div className={`bg-[#091e42] text-white flex items-center gap-6 pl-8 pr-3 py-3 rounded-[2.5rem] shadow-[0_32px_64px_rgba(0,30,66,0.5)] border border-white/10 transition-all duration-700 ${status === 'connecting' ? 'scale-110' : 'scale-100'}`}>
        
        <div className="relative shrink-0">
          {status === 'connecting' ? (
            <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-50 rounded-full animate-ping opacity-20" />
              <Phone size={24} className="absolute text-blue-400 animate-pulse" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-[160px]">
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${status === 'connected' ? 'text-emerald-400' : 'text-blue-400'}`}>
            {status === 'connected' ? 'Session Active' : 'Establishing Link'}
          </span>
          <span className="text-lg font-black tracking-tight leading-none mt-0.5">
            {status === 'connected' ? 'Tehila is Live' : 'Ringing Tehila...'}
          </span>
        </div>

        <div className="h-10 w-px bg-white/10 mx-1" />

        <div className="flex items-center gap-3">
          {status === 'connected' && (
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-rose-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}
          
          <button 
            onClick={onClose}
            className="w-12 h-12 bg-[#f8312f] hover:bg-[#d92a28] text-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 group"
          >
            <PhoneOff size={20} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
      
      <div className={`absolute inset-0 -z-10 rounded-[2.5rem] blur-2xl animate-pulse scale-110 ${status === 'connected' ? 'bg-emerald-500/10' : 'bg-blue-500/15'}`} />
    </div>
  );
};

export default LiveCallOverlay;
