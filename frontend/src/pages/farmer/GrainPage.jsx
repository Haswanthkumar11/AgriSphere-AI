import { useState } from 'react';
import PageHeader from '@components/layout/PageHeader';
import QualityScoreCard from '@components/farmer/QualityScoreCard';
import StorageAdvisorCard from '@components/farmer/StorageAdvisorCard';
import MarketReadinessCard from '@components/farmer/MarketReadinessCard';
import GrainPassportCard from '@components/farmer/GrainPassportCard';
import Skeleton from '@components/ui/Skeleton';
import { analyzeHarvestGrain, downloadGrainReport } from '@api/harvestApi';
import { useLang } from '@hooks/useLang';

export default function GrainPage() {
  const { t } = useLang();
  const [cropType, setCropType] = useState('Paddy');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError('');
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a grain sample photo.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await analyzeHarvestGrain(file, cropType);
      // Defensive payload unwrapping
      const payload = res?.data || res;
      setResult(payload);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Grain analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="farmer-page" style={{ padding: 16 }}>
      <PageHeader title="🌾 Grain Quality Check" subtitle="AI-powered AGMARK grading, storage risk meter & selling advice" />

      {/* Sequential Farmer Workflow Step 1: Upload Photo */}
      <form onSubmit={handleAnalyze} className="yield-card" style={{ marginTop: 14 }}>
        <div className="form-group" style={{ marginBottom: 12 }}>
          <label className="form-label" style={{ fontWeight: 800 }}>1. Select Grain Crop</label>
          <select value={cropType} onChange={(e) => setCropType(e.target.value)} className="form-select">
            <option value="Paddy">🌾 Paddy Grain (Rice)</option>
            <option value="Wheat">🌾 Wheat Grain</option>
            <option value="Maize">🌽 Maize / Corn</option>
            <option value="Groundnut">🥜 Groundnut</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label" style={{ fontWeight: 800 }}>2. Upload Grain Sample Photo</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="form-file" />
        </div>

        {preview && (
          <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <img src={preview} alt="Grain Preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 12, border: '2px solid var(--line)' }} />
          </div>
        )}

        {error && <div className="advisory-banner error" style={{ margin: '10px 0' }}>⚠️ {error}</div>}

        <button type="submit" disabled={loading} className="btn-farmer btn-farmer-primary btn-farmer-lg" style={{ width: '100%', marginTop: 8 }}>
          {loading ? 'Analyzing Grain Quality...' : '📷 Run Grain Quality Check'}
        </button>
      </form>

      {/* Loading Skeletons */}
      {loading && (
        <div style={{ marginTop: 16 }}>
          <Skeleton height={140} style={{ borderRadius: 18, marginBottom: 12 }} />
          <Skeleton height={120} style={{ borderRadius: 18, marginBottom: 12 }} />
          <Skeleton height={130} style={{ borderRadius: 18 }} />
        </div>
      )}

      {/* Results Workflow */}
      {result && result.quality && !loading && (
        <>
          {/* Step 2: Quality Score */}
          <QualityScoreCard
            grade={result.quality.grade}
            qualityScore={result.quality.quality_score}
            moistureStatus={result.quality.moisture_status}
            moistureRange={result.quality.moisture_range}
            brokenGrainPct={result.quality.broken_grain_pct}
            foreignMatterPct={result.quality.foreign_matter_pct}
            sizeUniformity={result.quality.size_uniformity}
          />

          {/* Step 3: Storage Advice */}
          <StorageAdvisorCard
            storageType={result.storage.storage_type}
            shelfLifeDays={result.storage.shelf_life_days}
            riskLabel={result.storage.risk_label}
            actionableGuidance={result.storage.actionable_guidance}
            humidityLimit={result.storage.humidity_limit_pct}
            tempLimit={result.storage.temp_limit_c}
            pestPrecautions={result.storage.pest_precautions}
          />

          {/* Step 4: Selling Advice */}
          <MarketReadinessCard
            recommendationLabel={result.market.recommendation_label}
            minPrice={result.market.min_estimated_price}
            maxPrice={result.market.max_estimated_price}
            priceSource={result.market.price_source}
            readinessScore={result.market.readiness_score}
          />

          {/* Step 5: Official Grain Quality Passport */}
          <div style={{ margin: '14px 0 8px' }}>
            <button
              onClick={() => downloadGrainReport(result.session_id || result.passport_id || 'GRAIN-PASSPORT')}
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
                background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.25)',
              }}
            >
              📄 Download Official Grain Quality Passport PDF
            </button>
          </div>

          <GrainPassportCard
            passportId={result.passport_id}
            cropType={result.crop_type}
            grade={result.quality.grade}
            qualityScore={result.quality.quality_score}
            moistureRange={result.quality.moisture_range}
            storageType={result.storage.storage_type}
            priceBand={`₹${result.market.min_estimated_price} – ₹${result.market.max_estimated_price}`}
            date={result.started_at}
          />
        </>
      )}
    </div>
  );
}
