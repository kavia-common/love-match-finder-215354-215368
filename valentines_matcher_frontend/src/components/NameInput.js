import React from "react";

/**
 * PRESENTATIONAL COMPONENT
 * Controlled text input with a label and optional hint.
 */
export default function NameInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  autoComplete = "off",
}) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        className="field-input"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode="text"
      />
      {hint ? <div className="field-hint">{hint}</div> : null}
    </div>
  );
}
