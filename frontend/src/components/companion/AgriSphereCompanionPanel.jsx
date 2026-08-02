import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendCompanionChat } from '@api/companionApi';
import { useAuth } from '@hooks/useAuth';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
];

const SUGGESTED_QUESTIONS = [
  { icon: '☁️', text: 'Will it rain today?' },
  { icon: '🌾', text: 'Diagnose my crop' },
  { icon: '💧', text: 'Should I irrigate today?' },
  { icon: '🌱', text: 'Which fertilizer should I use?' },
  { icon: '🚜', text: 'Find tractors nearby' },
  { icon: '📈', text: 'Market price of paddy' },
  { icon: '📋', text: 'Government schemes' },
  { icon: '📷', text: 'Analyze my crop image' },
];

export default function AgriSphereCompanionPanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: 'companion',
      title: '🌾 AgriSphere Companion',
      summary: `Hello ${user?.name || 'Farmer'} 👋 I am your Agentic AI Companion. How can I assist your ${user?.crop_type || 'crop'} farm today?`,
      recommendation: 'Ask about live weather telemetry, crop disease diagnostics, equipment rentals, or market prices.',
      actions: [
        { label: '📷 Scan Crop Leaf', route: '/scan' },
        { label: '☁️ Weather Forecast', route: '/weather' },
      ],
      pipeline_steps: ['✓ System Initialized', '✓ Profile & Location Loaded'],
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePipeline, setActivePipeline] = useState([]);
  const [selectedLang, setSelectedLang] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);

  const chatEndRef = useRef(null);

  const cropType = user?.crop_type || 'Paddy';
  const city = localStorage.getItem('agrisphere_weather_city') || 'Tirupati';
  const userId = user?.id || 'usr_demo';

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, activePipeline]);

  // Speech Recognition (STT) setup
  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang === 'te' ? 'te-IN' : selectedLang === 'hi' ? 'hi-IN' : selectedLang === 'ta' ? 'ta-IN' : selectedLang === 'kn' ? 'kn-IN' : 'en-US';
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInputMsg(transcript);
        handleSend(transcript);
      }
    };

    recognition.start();
  };

  // Text-to-Speech (TTS)
  const speakText = (text, idx) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (speakingIdx === idx) {
      setSpeakingIdx(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textToSend = null) => {
    const query = textToSend || inputMsg;
    if (!query || !query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');
    setLoading(true);

    // Dynamic pipeline step animation
    setActivePipeline(['Understanding Question', 'Selecting Specialized Tools']);
    const timer1 = setTimeout(() => {
      setActivePipeline(['✓ Understanding Question', '✓ Checking Weather & Profile', 'Loading Farmer Context']);
    }, 400);
    const timer2 = setTimeout(() => {
      setActivePipeline(['✓ Understanding Question', '✓ Checking Weather & Profile', '✓ Loading Farmer Context', 'Synthesizing Gemini Recommendation']);
    }, 900);

    try {
      const res = await sendCompanionChat(query, cropType, city, userId, selectedLang);
      const data = res?.data || res;
      clearTimeout(timer1);
      clearTimeout(timer2);

      const companionMsg = {
        sender: 'companion',
        title: data.title || '🌾 AgriSphere Companion',
        summary: data.summary,
        recommendation: data.recommendation,
        actions: data.actions || [],
        voice: data.voice || data.recommendation,
        pipeline_steps: data.pipeline_steps || ['✓ Understanding Question', '✓ Preparing Recommendation', '✓ Completed'],
      };

      setMessages((prev) => [...prev, companionMsg]);
      setActivePipeline([]);

      // Auto-speak response
      if (companionMsg.voice) {
        speakText(companionMsg.voice, messages.length + 1);
      }

      // Check if explicit navigation route requested
      if (query.toLowerCase().includes('scan') || query.toLowerCase().includes('camera')) {
        setTimeout(() => {
          onClose();
          navigate('/scan');
        }, 1200);
      }
    } catch {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'companion',
          title: '⚠️ Service Notice',
          summary: 'AgriSphere Companion offline.',
          recommendation: 'Could not connect to FastAPI companion endpoint. Please check server connection.',
          actions: [{ label: '☁️ Check Weather', route: '/weather' }],
        },
      ]);
      setActivePipeline([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(38, 50, 56, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      }}
    >
      <div
        className="companion-modal-container"
        style={{
          width: '100%',
          maxWidth: 460,
          maxHeight: '90vh',
          height: '100%',
          background: '#FFFFFF',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
            color: '#FFFFFF',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🌾</span>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#FFFFFF' }}>AgriSphere Companion</h3>
            </div>
            <div style={{ fontSize: 11, opacity: 0.9, marginTop: 2 }}>Agentic AI Orchestration Engine</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 6px',
                cursor: 'pointer',
              }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} style={{ color: '#000' }}>
                  {l.label}
                </option>
              ))}
            </select>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: 32,
                height: 32,
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Chat Feed */}
        <div style={{ flex: 1, padding: 16, overflowY: 'auto', background: '#F7FAF5' }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{ marginBottom: 14 }}>
              {m.sender === 'user' ? (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      background: '#2E7D32',
                      color: '#FFFFFF',
                      padding: '10px 16px',
                      borderRadius: '18px 18px 2px 18px',
                      maxWidth: '82%',
                      fontSize: 14,
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(46, 125, 50, 0.2)',
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: 20,
                    padding: 16,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#2E7D32' }}>{m.title}</div>
                    {m.voice && (
                      <button
                        onClick={() => speakText(m.voice, idx)}
                        style={{
                          background: speakingIdx === idx ? '#FFE082' : '#EDF6EC',
                          border: '1px solid #A5D6A7',
                          borderRadius: 999,
                          padding: '3px 10px',
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#2E7D32',
                          cursor: 'pointer',
                        }}
                      >
                        {speakingIdx === idx ? '🔊 Speaking...' : '🔊 Replay Voice'}
                      </button>
                    )}
                  </div>

                  {m.summary && <div style={{ fontSize: 13, color: '#263238', marginBottom: 8, fontWeight: 600 }}>{m.summary}</div>}

                  {m.recommendation && (
                    <div style={{ background: '#F4FBF4', borderLeft: '4px solid #2E7D32', padding: '10px 12px', borderRadius: '0 12px 12px 0', fontSize: 12.5, color: '#1B5E20', marginBottom: 10 }}>
                      💡 <strong>Recommendation:</strong> {m.recommendation}
                    </div>
                  )}

                  {/* Actions Buttons */}
                  {m.actions && m.actions.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                      {m.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            onClose();
                            navigate(act.route);
                          }}
                          style={{
                            background: '#2E7D32',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: 10,
                            padding: '6px 14px',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {act.label} ➔
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Pipeline Ticks */}
                  {m.pipeline_steps && (
                    <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px dashed #E5E7EB', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {m.pipeline_steps.map((step, i) => (
                        <span key={i} style={{ fontSize: 10, background: '#EEF2EE', color: '#4B5563', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                          {step}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Active Pipeline Execution Steps */}
          {loading && (
            <div style={{ background: '#FFFFFF', border: '1.5px solid #81C784', borderRadius: 18, padding: 14, marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#2E7D32', marginBottom: 6 }}>
                ⚙️ AgriSphere Companion Pipeline Executing...
              </div>
              {activePipeline.map((step, idx) => (
                <div key={idx} style={{ fontSize: 11.5, color: '#374151', padding: '2px 0' }}>
                  {step.startsWith('✓') ? '✅' : '⏳'} {step}
                </div>
              ))}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Questions Grid */}
        <div style={{ background: '#FFFFFF', padding: '10px 14px', borderTop: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: 6 }}>
            💡 Suggested Questions
          </div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q.text)}
                style={{
                  background: '#F7FAF5',
                  border: '1px solid #C8E6C9',
                  borderRadius: 999,
                  padding: '5px 12px',
                  fontSize: 11.5,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  color: '#2E7D32',
                  cursor: 'pointer',
                }}
              >
                {q.icon} {q.text}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div style={{ padding: 12, background: '#FFFFFF', borderTop: '1px solid #E5E7EB', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={handleMicClick}
            style={{
              background: isListening ? '#D32F2F' : '#2E7D32',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: 44,
              height: 44,
              fontSize: 20,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isListening ? '0 0 0 4px rgba(211, 47, 47, 0.3)' : 'none',
            }}
            title="Speak Question"
          >
            {isListening ? '🎙️' : '🎤'}
          </button>
          <input
            type="text"
            placeholder="Ask Companion about weather, crops, prices..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1,
              padding: '12px 14px',
              borderRadius: 14,
              border: '1.5px solid #E5E7EB',
              fontSize: 13,
              outline: 'none',
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputMsg.trim()}
            style={{
              background: '#2E7D32',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 14,
              padding: '12px 18px',
              fontWeight: 800,
              fontSize: 13,
              cursor: 'pointer',
              opacity: loading || !inputMsg.trim() ? 0.6 : 1,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
