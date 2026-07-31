import { useRef } from 'react';
import { useLang } from '@hooks/useLang';

/**
 * ScanFrame — camera frame with corner decorations + scanline animation.
 * previewSrc: data URL of the chosen image
 * scanning: boolean — shows animated scanline
 * onImageChosen: callback with File object
 */
export default function ScanFrame({ previewSrc, scanning = false, onImageChosen, apiOnline = false }) {
  const { t } = useLang();
  const inputRef = useRef(null);

  return (
    <div className="scan-frame" onClick={() => inputRef.current?.click()} style={{ cursor: 'pointer' }}>
      {/* API/offline badge */}
      <div className="badge-offline">
        {apiOnline ? '☁️' : '📡'}
        <span>{apiOnline ? t('serverBadge') : t('edgeBadge')}</span>
      </div>

      {/* Preview or placeholder */}
      {previewSrc ? (
        <img
          src={previewSrc}
          alt="Selected leaf"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div className="leaf-icon" aria-hidden="true">🍃</div>
      )}

      {/* Corner decorations */}
      <div className="scan-corner c1" aria-hidden="true" />
      <div className="scan-corner c2" aria-hidden="true" />
      <div className="scan-corner c3" aria-hidden="true" />
      <div className="scan-corner c4" aria-hidden="true" />

      {/* Animated scanline */}
      {scanning && <div className="scanline" aria-hidden="true" />}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        aria-label="Take a photo of the leaf"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImageChosen(file);
        }}
      />
    </div>
  );
}
