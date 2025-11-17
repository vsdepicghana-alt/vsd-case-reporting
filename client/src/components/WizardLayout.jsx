import React from "react";
import "./WizardLayout.css";

const WizardLayout = ({ steps, currentStep, setStep, completedSteps = [], children }) => {
  return (
    <div className="wizard-layout">
      {/* === Sidebar Navigation === */}
      <aside className="wizard-sidebar">
        <h3>Case Report Sections</h3>
        <ul>
          {steps.map((step, index) => {
            const isUnlocked =
              index === 0 ||
              completedSteps.includes(steps[index - 1].id) ||
              currentStep > index;

            const isActive = index === currentStep;

            return (
              <li
                key={step.id}
                className={`wizard-step ${
                  isActive ? "active-step" : isUnlocked ? "unlocked-step" : "locked-step"
                }`}
                onClick={() => {
                  if (isUnlocked) {
                    setStep(index);
                  } else {
                    alert("⚠️ Please complete the previous section first.");
                  }
                }}
              >
                <span className="step-index">{index + 1}.</span> {step.label}
              </li>
            );
          })}
        </ul>
      </aside>

      {/* === Main Content === */}
      <main className="wizard-content">{children}</main>
    </div>
  );
};

export default WizardLayout;
