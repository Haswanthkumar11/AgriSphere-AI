/** FieldSet — label + input/select wrapper — eliminates repeated fieldset pattern. */
export default function FieldSet({ label, children, ...props }) {
  return (
    <div className="fieldset" {...props}>
      <label>{label}</label>
      {children}
    </div>
  );
}
