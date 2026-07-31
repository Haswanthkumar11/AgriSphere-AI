import { Outlet } from 'react-router-dom';
import TopBar from '@components/layout/TopBar';
import BottomNav from '@components/layout/BottomNav';

/**
 * FarmerLayout — the main app shell.
 * Renders TopBar + page content (via Outlet) + fixed BottomNav.
 */
export default function FarmerLayout({ apiOnline }) {
  return (
    <div className="app screen-enter">
      <TopBar apiOnline={apiOnline} />
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
