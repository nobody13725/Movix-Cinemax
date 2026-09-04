import React from "react";

const STEPS = [
  { key: "seats", label: "Chọn ghế" },
  { key: "combo", label: "Bắp nước" },
  { key: "payment", label: "Thanh toán" },
];

export default function Stepper({ current }) {
  const idx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="stepper">
      {STEPS.map((s, i) => (
        <React.Fragment key={s.key}>
          <div className={`step ${i < idx ? "done" : i === idx ? "active" : ""}`}>
            <div className="step-circle">{i < idx ? "✓" : i + 1}</div>
            <div className="step-label">{s.label}</div>
          </div>
          {i < STEPS.length - 1 && <div className="step-line" />}
        </React.Fragment>
      ))}
    </div>
  );
}
