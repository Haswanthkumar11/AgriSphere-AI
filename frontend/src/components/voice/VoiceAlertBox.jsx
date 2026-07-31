/**
 * VoiceAlertBox — voice alert notification with play button.
 * onPlay: called when user taps ▶
 */
export default function VoiceAlertBox({ title, subtitle, onPlay }) {
  return (
    <div className="voice-alert-box" role="alert">
      <div className="ic" aria-hidden="true">📞</div>
      <div>
        <div className="t1">{title}</div>
        <div className="t2">{subtitle}</div>
      </div>
      <button
        className="play-btn"
        onClick={onPlay}
        aria-label="Play voice alert"
      >
        ▶
      </button>
    </div>
  );
}
