/** AdvisoryBanner — the green advisory strip with icon + title + body. */
export default function AdvisoryBanner({ icon = '🌡️', title, body }) {
  return (
    <div className="advisory" role="region" aria-label="Farming advisory">
      <div className="adv-icon" aria-hidden="true">{icon}</div>
      <div className="adv-txt">
        <div className="t1">{title}</div>
        <div className="t2">{body}</div>
      </div>
    </div>
  );
}
