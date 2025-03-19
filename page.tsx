'use client';

import { useState } from 'react';

// Assuming these components exist
import { Stepper } from '@/components/stepper';
import { Progress } from '@/components/progress';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/accordion';

export default function EmifPage() {
  // Define steps
  const steps = [
    { label: 'Personal Information', id: 'personal-info' },
    { label: 'Employment Details', id: 'employment' },
    { label: 'Financial Information', id: 'financial' },
    { label: 'Review & Submit', id: 'review' },
  ];

  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [expandedAccordions, setExpandedAccordions] = useState([steps[0].id]);

  // Calculate progress
  const progressPercentage = Math.round(
    (completedSteps.length / steps.length) * 100,
  );

  // Handle proceed button click
  const handleProceed = (stepIndex: number) => {
    // Mark current step as completed
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }

    // Move to next step if available
    if (stepIndex < steps.length - 1) {
      const nextStep = stepIndex + 1;
      setCurrentStep(nextStep);
      setExpandedAccordions([steps[nextStep].id]);
    }
  };

  // Map steps to stepper format
  const stepperSteps = steps.map((step, index) => ({
    label: step.label,
    state: completedSteps.includes(index)
      ? 'done'
      : index === currentStep
        ? 'partially-done'
        : 'pending',
  }));

  return (
    <div className="container mx-auto p-4">
      {/* Stepper */}
      <div className="mb-8">
        <Stepper
          steps={stepperSteps}
          currentStep={currentStep}
          onStep={(step: number) => {
            // Only allow clicking on completed steps or the current step
            if (completedSteps.includes(step) || step === currentStep) {
              setCurrentStep(step);
              setExpandedAccordions([steps[step].id]);
            }
          }}
        />
      </div>

      {/* Progress Bar */}
      <div className="my-6">
        <Progress type="bar" color="red" value={progressPercentage} />
      </div>

      {/* Accordions */}
      <div className="mt-8">
        <Accordion
          value={expandedAccordions}
          onValueChange={setExpandedAccordions}
          statusIcon={<CheckIcon />}
          defaultExpanded={[steps[0].id]}
        >
          {steps.map((step, index) => (
            <AccordionItem key={step.id} value={step.id}>
              <AccordionTrigger>{step.label}</AccordionTrigger>
              <AccordionContent>
                {/* This is where the actual form content would go */}
                <div className="py-4">
                  {/* For now, we're keeping the accordion content empty as per requirements */}
                  <div className="mt-4 flex justify-end">
                    <button
                      className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                      onClick={() => handleProceed(index)}
                    >
                      Proceed
                    </button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

// Placeholder for the check icon
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
