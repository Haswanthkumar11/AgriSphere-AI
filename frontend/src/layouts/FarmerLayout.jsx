import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '@components/layout/TopBar';
import BottomNav from '@components/layout/BottomNav';
import CompanionFab from '@components/companion/CompanionFab';
import AgriSphereCompanionPanel from '@components/companion/AgriSphereCompanionPanel';

/**
 * FarmerLayout — the main app shell with AgriSphere Companion Agentic AI integration.
 */
export default function FarmerLayout({ apiOnline }) {
  const [companionOpen, setCompanionOpen] = useState(false);

  return (
    <div className="app screen-enter">
      <TopBar apiOnline={apiOnline} />
      <main>
        <Outlet />
      </main>

      {/* Floating Action Button for AgriSphere Companion */}
      <CompanionFab
        onClick={() => setCompanionOpen(!companionOpen)}
        isOpen={companionOpen}
      />

      {/* AgriSphere Companion Panel */}
      <AgriSphereCompanionPanel
        isOpen={companionOpen}
        onClose={() => setCompanionOpen(false)}
      />

      <BottomNav onOpenCompanion={() => setCompanionOpen(true)} />
    </div>
  );
}
