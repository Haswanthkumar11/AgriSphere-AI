import { useAuth } from '@hooks/useAuth';
import { useLang } from '@hooks/useLang';
import PageHeader from '@components/layout/PageHeader';
import WeatherCard from '@components/farmer/WeatherCard';
import AdvisoryBanner from '@components/dashboard/AdvisoryBanner';

export default function WeatherPage() {
  const { t } = useLang();
  const { user } = useAuth();
  const farmerCrop = user?.crop_type || user?.crop || 'Paddy';

  return (
    <div className="section screen-enter">
      <PageHeader title={t('weatherTitle')} subtitle={t('weatherSub')} />

      {/* Main Weather Card Component */}
      <WeatherCard cropType={farmerCrop} />

      {/* Satellite Telemetry & Crop Advisory Banners */}
      <div className="mt-4">
        <AdvisoryBanner icon="🛰️" title={t('ndviTitle')} body={t('ndviBody')} />
      </div>
    </div>
  );
}
