import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@constants/routes';

import GuestLayout    from '@layouts/GuestLayout';
import FarmerLayout   from '@layouts/FarmerLayout';
import AdminLayout    from '@layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute     from './GuestRoute';
import AdminRoute     from './AdminRoute';
import Loader         from '@components/ui/Loader';

// ── Lazy-loaded pages ──
const LanguageSelect = lazy(() => import('@pages/LanguageSelect'));
const Login          = lazy(() => import('@pages/Login'));
const AdminLogin     = lazy(() => import('@pages/AdminLogin'));
const Register       = lazy(() => import('@pages/Register'));

const Dashboard      = lazy(() => import('@pages/farmer/Dashboard'));
const ScanPage       = lazy(() => import('@pages/farmer/ScanPage'));
const WeatherPage    = lazy(() => import('@pages/farmer/WeatherPage'));
const GrainPage      = lazy(() => import('@pages/farmer/GrainPage'));
const EquipmentPage  = lazy(() => import('@pages/farmer/EquipmentPage'));
const BookingsPage   = lazy(() => import('@pages/farmer/BookingsPage'));
const YieldPage      = lazy(() => import('@pages/farmer/YieldPage'));
const MarketPage     = lazy(() => import('@pages/farmer/MarketPage'));
const ProfilePage    = lazy(() => import('@pages/farmer/ProfilePage'));

// Module 3 pages
const CropHistoryPage    = lazy(() => import('@pages/farmer/CropHistoryPage'));
const ScanComparisonPage = lazy(() => import('@pages/farmer/ScanComparisonPage'));
const DiseaseKBPage      = lazy(() => import('@pages/farmer/DiseaseKBPage'));

// Module 4 pages
const HarvestHistoryPage    = lazy(() => import('@pages/farmer/HarvestHistoryPage'));
const HarvestComparisonPage = lazy(() => import('@pages/farmer/HarvestComparisonPage'));
const StorageAdvicePage     = lazy(() => import('@pages/farmer/StorageAdvicePage'));

const AdminDashboard = lazy(() => import('@pages/admin/AdminDashboard'));
const UsersPage      = lazy(() => import('@pages/admin/UsersPage'));

const Unauthorized401 = lazy(() => import('@pages/error/Unauthorized401'));
const Forbidden403    = lazy(() => import('@pages/error/Forbidden403'));
const NotFound404     = lazy(() => import('@pages/error/NotFound404'));
const ServerError500  = lazy(() => import('@pages/error/ServerError500'));

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
            <Route path={ROUTES.REGISTER}         element={<GuestRoute><Register /></GuestRoute>} />
          </Route>

          {/* Farmer routes (protected) */}
          <Route element={<ProtectedRoute><FarmerLayout /></ProtectedRoute>}>
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

          {/* Admin routes (protected + role-gated) */}
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
