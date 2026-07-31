import { Outlet } from 'react-router-dom';

/** GuestLayout — no nav. Wraps language-select, login, register pages. */
export default function GuestLayout() {
  return (
    <div className="screen-enter">
      <Outlet />
    </div>
  );
}
