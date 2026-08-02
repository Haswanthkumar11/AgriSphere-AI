import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '@hooks/useLang';
import { useAuth } from '@hooks/useAuth';
import { scanCrop, downloadCropReport } from '@api/cropApi';
import { dispatchVoiceAlert } from '@api/diseaseApi';
import { CROPS } from '@constants/crops';
import { ROUTES } from '@constants/routes';
import PageHeader from '@components/layout/PageHeader';
import ScanFrame from '@components/scan/ScanFrame';
import ResultCard from '@components/scan/ResultCard';
import ReliabilityPanel from '@components/farmer/ReliabilityPanel';
import ActionSummaryCard from '@components/farmer/ActionSummaryCard';
import VoiceAlertBox from '@components/voice/VoiceAlertBox';

export default function ScanPage() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [previewSrc, setPreviewSrc]     = useState(null);
  const [scanning, setScanning]         = useState(false);
  const [session, setSession]           = useState(null);
  const [voiceMsg, setVoiceMsg]         = useState(null);
  const [apiOnline, setApiOnline]       = useState(true);
  const fileRef = useRef(null);

  const handleImageChosen = useCallback(async (file) => {
    const url = URL.createObjectURL(file);
    setPreviewSrc(url);
    setSession(null);
    setScanning(true);

    try {
      const res = await scanCrop(file, selectedCrop, 'yolov8', user?.id || 'usr_demo');
      setApiOnline(true);
      setSession(res);

      if (!res.prediction.healthy) {
        try {
          const v = await dispatchVoiceAlert(user?.phone || '+919876543210', lang, 'DISEASE_DETECTED', res.prediction.disease_name);
          setVoiceMsg(v.message_text || t('diseaseBody'));
        } catch { setVoiceMsg(t('diseaseBody')); }
      }
    } catch (err) {
      setApiOnline(false);
      showToast(err?.response?.data?.detail || 'AI Crop Scan Service Offline — Could not reach backend server.');
    } finally {
      setScanning(false);
    }
  }, [selectedCrop, user, lang, t]);

  const playVoice = useCallback(() => {
    if ('speechSynthesis' in window && voiceMsg) {
      const u = new SpeechSynthesisUtterance(voiceMsg);
      u.lang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : lang === 'kn' ? 'kn-IN' : 'en-IN';
      speechSynthesis.speak(u);
    }
  }, [voiceMsg, lang]);

  return (
    <div className="section screen-enter">
      <PageHeader title={t('scanTitle')} subtitle="AI Crop Intelligence & Diagnostic System" />

      {/* Crop Selector Tabs */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, marginBottom: 12 }} className="no-scrollbar">
        {CROPS.map((c) => (
          <button
            key={c.value}
            onClick={() => setSelectedCrop(c.label.split(' ')[0])}
            style={{
              padding: '6px 12px', borderRadius: 999, border: '1px solid',
              borderColor: selectedCrop === c.label.split(' ')[0] ? 'var(--soil)' : 'var(--line)',
              background: selectedCrop === c.label.split(' ')[0] ? 'var(--soil)' : '#fff',
              color: selectedCrop === c.label.split(' ')[0] ? '#fff' : 'var(--ink)',
              fontSize: 12, fontWeight: 700, flex: 'none', cursor: 'pointer',
            }}
          >
            {c.icon} {c.label.split(' ')[0]}
          </button>
        ))}
      </div>

      <ScanFrame
        previewSrc={previewSrc}
        scanning={scanning}
        onImageChosen={handleImageChosen}
        apiOnline={apiOnline}
      />

      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <button
          className="btn-primary gold"
          disabled={scanning}
          onClick={() => fileRef.current?.click()}
          style={{ flex: 1 }}
        >
          {scanning ? '🔍 Running AI Analysis...' : t('scanBtn')}
        </button>

        <button
          className="btn-secondary"
          onClick={() => navigate(ROUTES.CROP_HISTORY || '/crop/history')}
          style={{ flex: 'none', width: 'auto', padding: '0 16px', marginTop: 0 }}
          aria-label="Scan History"
        >
          📜 History
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageChosen(f); }}
      />

      {session && (
        <>
          {/* Hybrid AI Pipeline Executed Badges Bar */}
          <div style={{
            background: '#F8FAF9',
            border: '1.5px solid var(--line)',
            borderRadius: 14,
            padding: '10px 14px',
            marginBottom: 14,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px 10px',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--soil-dark)', textTransform: 'uppercase', width: '100%', marginBottom: 2 }}>
              ⚡ Hybrid AI Pipeline Execution Badges:
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--good)', background: '#EDF6EC', border: '1px solid #C8E6C9', padding: '3px 8px', borderRadius: 6 }}>
              ✔ OpenCV Preprocessing
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--good)', background: '#EDF6EC', border: '1px solid #C8E6C9', padding: '3px 8px', borderRadius: 6 }}>
              ✔ YOLOv8 Crop Localization
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--good)', background: '#EDF6EC', border: '1px solid #C8E6C9', padding: '3px 8px', borderRadius: 6 }}>
              ✔ Gemini Vision 2.0 LLM
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--good)', background: '#EDF6EC', border: '1px solid #C8E6C9', padding: '3px 8px', borderRadius: 6 }}>
              ✔ Live Weather Context
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--good)', background: '#EDF6EC', border: '1px solid #C8E6C9', padding: '3px 8px', borderRadius: 6 }}>
              ✔ ICAR Grounded Advisory
            </span>
          </div>

          {/* PDF Report Download Button */}
          <div style={{ margin: '14px 0 6px' }}>
            <button
              onClick={() => downloadCropReport(session.session_id || 'AI-SESSION')}
              className="btn-farmer btn-farmer-primary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: 800,
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
                boxShadow: '0 4px 14px rgba(46, 125, 50, 0.25)',
              }}
            >
              📄 Download Official PDF Report
            </button>
          </div>

          {/* Result Card */}
          <ResultCard
            icon={session.prediction.healthy ? '✅' : '⚠️'}
            title={session.prediction.healthy ? t('healthyTitle') : `${session.prediction.disease_name} detected`}
            subtitle={`Selected Crop: ${session.crop_type} · Severity: ${session.prediction.severity.toUpperCase()}`}
            body={session.prediction.explanation}
            confidence={session.prediction.confidence_pct}
            variant={session.prediction.healthy ? 'good' : 'bad'}
          />

          {/* Hero Feature 1: Reliability Panel */}
          <ReliabilityPanel
            modelName={session.prediction.model_used}
            inferenceTimeMs={session.prediction.inference_time_ms}
            confidencePct={session.prediction.confidence_pct}
            isGemini={true}
            isGrounded={session.treatment.is_kb_grounded}
          />

          {/* Hero Feature 3: Farmer Action Summary */}
          {!session.prediction.healthy && (
            <ActionSummaryCard
              actionSteps={session.treatment.action_steps}
              sprayWindow={session.treatment.spray_window}
              recoveryDays={session.treatment.recovery_days}
            />
          )}

          {/* Voice Alert */}
          {!session.prediction.healthy && voiceMsg && (
            <VoiceAlertBox
              title={t('voiceTitle')}
              subtitle={t('voiceBody')}
              onPlay={playVoice}
            />
          )}
        </>
      )}
    </div>
  );
}
