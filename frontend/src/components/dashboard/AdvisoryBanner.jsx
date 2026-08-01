/** AdvisoryBanner — premium amber advisory strip */
export default function AdvisoryBanner({ icon = '🌡️', title, body }) {
  return (
    <div className="advisory-banner" role="region" aria-label="Farming advisory">
      <div className="adv-icon" aria-hidden="true">{icon}</div>
      <div>
        <div className="adv-title">{title}</div>
        <div className="adv-body">{body}</div>
      </div>
    </div>
  );
}
