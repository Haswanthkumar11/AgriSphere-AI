import { useEffect, useState } from 'react';
import { useLang } from '@hooks/useLang';
import { getPrices, getMarketPrediction, getPriceForecast } from '@api/marketApi';
import PriceCard from '@components/market/PriceCard';
import PriceForecast from '@components/market/PriceForecast';
import PageHeader from '@components/layout/PageHeader';
import Loader from '@components/ui/Loader';

const CROP_TABS = [
  { key: 'Tomato', icon: '🍅' },
  { key: 'Paddy',  icon: '🌾' },
  { key: 'Chilli', icon: '🌶️' },
];

export default function MarketPage() {
  const { t } = useLang();
  const [prices, setPrices] = useState([]);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [activeCrop, setActiveCrop] = useState('Tomato');
  const [prediction, setPrediction] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loadingPred, setLoadingPred] = useState(false);

  useEffect(() => {
    getPrices()
      .then((d) => setPrices(d?.prices || []))
      .catch(() => setPrices([]))
      .finally(() => setLoadingPrices(false));
  }, []);

  useEffect(() => {
    setLoadingPred(true);
    setPrediction(null);
    setForecast([]);
    Promise.all([getMarketPrediction(activeCrop), getPriceForecast(activeCrop)])
      .then(([pred, fore]) => {
        setPrediction(pred);
        setForecast(fore?.price_forecast || []);
      })
      .catch(() => {
        setPrediction(null);
        setForecast([]);
      })
      .finally(() => setLoadingPred(false));
  }, [activeCrop]);

  return (
    <div className="section screen-enter">
      <PageHeader title={t('marketTitle')} subtitle={t('marketSub')} />

      {/* Price overview */}
      <div className="section-title" style={{ padding: 0, marginBottom: 8 }}>
        <span className="eyebrow">{t('pricesEyebrow')}</span>
      </div>

      {loadingPrices ? (
        <Loader variant="spinner" message={t('loading')} />
      ) : prices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 16px', background: '#fff', borderRadius: 16, border: '1px border var(--line)', marginBottom: 16 }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>📊</div>
          <h5 style={{ fontSize: 14, fontWeight: 800, color: 'var(--soil-dark)', marginBottom: 2 }}>Mandi Market Prices Unavailable</h5>
          <p style={{ fontSize: 12, color: 'var(--ink-soft)', margin: 0 }}>
            Real-time mandi rates could not be fetched from the backend service.
          </p>
        </div>
      ) : (
        prices.map((p) => (
          <PriceCard
            key={p.crop}
            crop={p.crop}
            icon={p.icon}
            price={p.price}
            trendPercent={p.trend_percent}
            mandi={p.mandi}
          />
        ))
      )}

      {/* Crop tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, marginTop: 8 }}>
        {CROP_TABS.map(({ key, icon }) => (
          <button
            key={key}
            onClick={() => setActiveCrop(key)}
            style={{
              flex: 1, padding: '10px 6px', borderRadius: 12, border: '1.5px solid',
              borderColor: activeCrop === key ? 'var(--soil)' : 'var(--line)',
              background: activeCrop === key ? 'var(--soil)' : '#fff',
              color: activeCrop === key ? '#fff' : 'var(--ink)',
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}
          >
            {icon} {key}
          </button>
        ))}
      </div>

      {loadingPred ? (
        <Loader variant="spinner" message="Loading prediction..." />
      ) : prediction ? (
        <>
          <div className="advisory" style={{ marginBottom: 14 }}>
            <div className="adv-icon">🤖</div>
            <div className="adv-txt">
              <div className="t1">{t('aiRecommendation')}: {prediction.best_selling_window || prediction.bestSelling}</div>
              <div className="t2">{prediction.ai_recommendation || prediction.aiRecommendation}</div>
            </div>
          </div>

          <PriceForecast points={forecast} title={t('priceforecast')} />
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 16px', background: '#fff', borderRadius: 16, border: '1px border var(--line)' }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>📈</div>
          <h5 style={{ fontSize: 13, fontWeight: 800, color: 'var(--soil-dark)', marginBottom: 2 }}>AI Market Prediction Unavailable</h5>
          <p style={{ fontSize: 12, color: 'var(--ink-soft)', margin: 0 }}>
            Price trend prediction service is currently offline.
          </p>
        </div>
      )}
    </div>
  );
}
