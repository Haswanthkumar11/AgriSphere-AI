import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@constants/routes';

import GuestLayout    from '@layouts/GuestLayout';
import FarmerLayout   from '@layouts/FarmerLayout';
import OfficerLayout  from '@layouts/OfficerLayout';
import AdminLayout    from '@layouts/AdminLayout';
import GuestRoute     from './GuestRoute';
import FarmerRoute    from './FarmerRoute';
import OfficerRoute   from './OfficerRoute';
import AdminRoute     from './AdminRoute';
import Loader         from '@components/ui/Loader';

// Helper for lazy loading pages with automatic retry on Vercel deployment chunk update
function lazyRetry(componentImport) {
  return lazy(async () => {
    const pageHasBeenReloaded = sessionStorage.getItem('chunk_reload_attempts');
    try {
      const component = await componentImport();
      sessionStorage.removeItem('chunk_reload_attempts');
      return component;
    } catch (error) {
      if (!pageHasBeenReloaded) {
        sessionStorage.setItem('chunk_reload_attempts', '1');
        window.location.reload();
        return new Promise(() => {}); // prevent throw while reloading
      }
      throw error;
    }
  });
}

// ── Lazy-loaded pages ──
const LanguageSelect = lazyRetry(() => import('@pages/LanguageSelect'));
const Login          = lazyRetry(() => import('@pages/Login'));
const AdminLogin     = lazyRetry(() => import('@pages/AdminLogin'));
const OfficerLogin   = lazyRetry(() => import('@pages/officer/OfficerLogin'));
const Register       = lazyRetry(() => import('@pages/Register'));

const Dashboard      = lazyRetry(() => import('@pages/farmer/Dashboard'));
const ScanPage       = lazyRetry(() => import('@pages/farmer/ScanPage'));
const WeatherPage    = lazyRetry(() => import('@pages/farmer/WeatherPage'));
const GrainPage      = lazyRetry(() => import('@pages/farmer/GrainPage'));
const EquipmentPage  = lazyRetry(() => import('@pages/farmer/EquipmentPage'));
const BookingsPage   = lazyRetry(() => import('@pages/farmer/BookingsPage'));
const YieldPage      = lazyRetry(() => import('@pages/farmer/YieldPage'));
const MarketPage     = lazyRetry(() => import('@pages/farmer/MarketPage'));
const ProfilePage    = lazyRetry(() => import('@pages/farmer/ProfilePage'));

// Module 3 pages
const CropHistoryPage    = lazyRetry(() => import('@pages/farmer/CropHistoryPage'));
const ScanComparisonPage = lazyRetry(() => import('@pages/farmer/ScanComparisonPage'));
const DiseaseKBPage      = lazyRetry(() => import('@pages/farmer/DiseaseKBPage'));

// Module 4 pages
const HarvestHistoryPage    = lazyRetry(() => import('@pages/farmer/HarvestHistoryPage'));
const HarvestComparisonPage = lazyRetry(() => import('@pages/farmer/HarvestComparisonPage'));
const StorageAdvicePage     = lazyRetry(() => import('@pages/farmer/StorageAdvicePage'));

// Officer pages
const OfficerDashboard = lazyRetry(() => import('@pages/officer/OfficerDashboard'));

// Admin pages
const AdminDashboard = lazyRetry(() => import('@pages/admin/AdminDashboard'));
const UsersPage      = lazyRetry(() => import('@pages/admin/UsersPage'));

const Unauthorized401 = lazyRetry(() => import('@pages/error/Unauthorized401'));
const Forbidden403    = lazyRetry(() => import('@pages/error/Forbidden403'));
const NotFound404     = lazyRetry(() => import('@pages/error/NotFound404'));
const ServerError500  = lazyRetry(() => import('@pages/error/ServerError500'));

const PageLoader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Loader variant="spinner" message="Loading..." />
  </div>
);

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* Root redirect */}
          <Route path="/" element={<Navigate to={ROUTES.LANGUAGE_SELECT} replace />} />

          {/* Guest routes (unauthenticated) */}
          <Route element={<GuestLayout />}>
            <Route path={ROUTES.LANGUAGE_SELECT} element={<GuestRoute><LanguageSelect /></GuestRoute>} />
            <Route path={ROUTES.LOGIN}            element={<GuestRoute><Login /></GuestRoute>} />
            <Route path={ROUTES.ADMIN_LOGIN}      element={<GuestRoute><AdminLogin /></GuestRoute>} />
            <Route path={ROUTES.OFFICER_LOGIN}    element={<GuestRoute><OfficerLogin /></GuestRoute>} />
            <Route path={ROUTES.REGISTER}         element={<GuestRoute><Register /></GuestRoute>} />
          </Route>

          {/* Farmer workspace routes (gated strictly to role='farmer') */}
          <Route element={<FarmerRoute><FarmerLayout /></FarmerRoute>}>
            <Route path={ROUTES.DASHBOARD}       element={<Dashboard />} />
            <Route path={ROUTES.SCAN}            element={<ScanPage />} />
            <Route path={ROUTES.WEATHER}         element={<WeatherPage />} />
            <Route path={ROUTES.GRAIN}           element={<GrainPage />} />
            <Route path={ROUTES.EQUIPMENT}       element={<EquipmentPage />} />
            <Route path={ROUTES.BOOKINGS}        element={<BookingsPage />} />
            <Route path={ROUTES.YIELD}           element={<YieldPage />} />
            <Route path={ROUTES.MARKET}          element={<MarketPage />} />
            <Route path={ROUTES.PROFILE}         element={<ProfilePage />} />
            <Route path={ROUTES.CROP_HISTORY}    element={<CropHistoryPage />} />
            <Route path={ROUTES.CROP_COMPARE}    element={<ScanComparisonPage />} />
            <Route path={ROUTES.CROP_KB}         element={<DiseaseKBPage />} />
            <Route path={ROUTES.HARVEST_HISTORY} element={<HarvestHistoryPage />} />
            <Route path={ROUTES.HARVEST_COMPARE} element={<HarvestComparisonPage />} />
            <Route path={ROUTES.STORAGE_ADVICE}  element={<StorageAdvicePage />} />
          </Route>

          {/* Extension Officer Portal (gated strictly to role='officer' with OfficerLayout sidebar) */}
          <Route element={<OfficerRoute><OfficerLayout /></OfficerRoute>}>
            <Route path={ROUTES.OFFICER_DASHBOARD} element={<OfficerDashboard />} />
          </Route>

          {/* Admin Control Center (gated strictly to role='admin' with AdminLayout sidebar) */}
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path={ROUTES.ADMIN}           element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN_USERS}     element={<UsersPage />} />
          </Route>

          {/* Error routes */}
          <Route path={ROUTES.UNAUTHORIZED_401} element={<Unauthorized401 />} />
          <Route path={ROUTES.FORBIDDEN_403}    element={<Forbidden403 />} />
          <Route path={ROUTES.SERVER_ERROR_500} element={<ServerError500 />} />
          <Route path="*"                       element={<NotFound404 />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
