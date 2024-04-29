// Stepper.tsx
import React, { useState } from 'react';

interface StepperProps {
  steps: string[];
  content: string[];
}

const Stepper: React.FC<StepperProps> = ({ steps, content }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const goToStep = (index: number) => {
    setCurrentStep(index);
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const isFinalStep = currentStep === steps.length - 1;

  return (
    <div data-hs-stepper="">
      <ul className="relative flex flex-row gap-x-2">
        {steps.map((step, index) => (
          <li
          key={index}
          className={`flex items-center gap-x-2 shrink basis-0 flex-1 group ${
            index === currentStep ? 'hs-stepper-active:bg-blue-600 hs-stepper-active:text-white' : ''
          } ${
            index < currentStep ? 'hs-stepper-completed:bg-teal-500 group-last:hidden' : ''
          }`}
          data-hs-stepper-nav-item={`{"index": ${index + 1}}`}
          onClick={() => goToStep(index)}
        >
          <span className="min-w-7 min-h-7 group inline-flex items-center text-xs align-middle">
            <span
              className={`size-7 flex justify-center items-center flex-shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full group-focus:bg-gray-200 ${
                index === currentStep ? 'bg-blue-600 text-white' : index < currentStep ? 'bg-primary text-white' : ''
              }`}
            >
              <span className="font-medium">{index + 1}</span>
            </span>
            <span className="ms-2 text-sm font-medium text-gray-800">
              Step
            </span>
          </span>
          {index !== steps.length - 1 && (
            <div className="w-full h-px flex-1 bg-gray-200 group-last:hidden"></div>
          )}
        </li>
        
        ))}
      </ul>
      <div className="mt-5 sm:mt-8">
        <div
          data-hs-stepper-content-item={`{"index": ${currentStep + 1}}`}
          style={{ display: 'block' }}
        >
          <div className="p-4 h-48 bg-gray-50 flex justify-center items-center border border-dashed border-gray-200 rounded-xl">
            <h3 className="text-gray-500">{content[currentStep]}</h3>
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-between items-center gap-x-2">
        <button
          type="button"
          className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
          data-hs-stepper-back-btn=""
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <svg
            className="flex-shrink-0 size-4"
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
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          Back
        </button>
        <button
          type="button"
          className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          data-hs-stepper-next-btn=""
          onClick={isFinalStep ? () => {} : nextStep}
        >
          Next
          <svg
            className="flex-shrink-0 size-4"
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
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </button>
        <button
          type="button"
          className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          data-hs-stepper-finish-btn=""
          style={{ display: isFinalStep ? 'block' : 'none' }}
        >
          Finish
        </button>
        <button
          type="reset"
          className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          data-hs-stepper-reset-btn=""
          style={{ display: isFinalStep ? 'block' : 'none' }}
          onClick={() => setCurrentStep(0)}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Stepper;
