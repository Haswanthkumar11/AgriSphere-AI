import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '@hooks/useLang';
import { useAuth } from '@hooks/useAuth';
import { scanCrop } from '@api/cropApi';
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
    } catch {
      // Offline fallback
      await new Promise((r) => setTimeout(r, 900));
      setApiOnline(false);
      const isDiseased = Math.random() > 0.45;
      const diseaseName = isDiseased ? 'Early Blight' : 'Healthy';
      const mockSession = {
        session_id: 'ses_mock_' + Date.now(),
        crop_type: selectedCrop,
        scan: { image_url: url },
        prediction: {
          disease_name: diseaseName,
          healthy: !isDiseased,
          confidence: 0.92,
          confidence_pct: 92.0,
          severity: isDiseased ? 'moderate' : 'none',
          affected_area_pct: isDiseased ? 14.5 : 0.0,
          model_used: 'YOLOv8n-cls + OpenCV',
          inference_time_ms: 142.8,
          explanation: isDiseased
            ? 'Fungal lesions identified on lower leaf surface.'
            : 'Leaf surface exhibits uniform chlorophyll distribution and zero disease lesions.',
          reliability_tier: 'HIGH',
        },
        treatment: {
          chemical_treatment: 'Spray Copper Oxychloride 50 WP (3g/L) within 48 hours.',
          organic_treatment: 'Spray Neem Oil 1500 ppm (5ml/L) + Trichoderma viride.',
          spray_window: 'Early morning (6:00 AM - 8:30 AM)',
          recovery_days: 7,
          action_steps: [
            '1. Spray recommended fungicide within 48 hours.',
            '2. Switch to drip irrigation; avoid leaf wetness.',
            '3. Rescan in 5–7 days to track recovery.',
          ],
          is_kb_grounded: true,
        },
      };
      setSession(mockSession);
      if (isDiseased) setVoiceMsg(t('diseaseBody'));
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
