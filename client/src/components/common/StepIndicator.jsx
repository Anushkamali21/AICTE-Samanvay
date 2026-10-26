import React from 'react';
import { Check } from 'lucide-react';

export const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-4 border-b border-slate-200 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <nav aria-label="Registration Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;

              return (
                <li key={step.id || index} className="relative flex-1 flex flex-col items-center">
                  {/* Connecting bar */}
                  {index !== 0 && (
                    <div 
                      className={`absolute top-4 -left-1/2 w-full h-0.5 -z-10 ${
                        isCompleted || isCurrent ? 'bg-blue-700' : 'bg-slate-200'
                      }`}
                    />
                  )}

                  {/* Step circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                      isCompleted
                        ? 'bg-blue-700 text-white'
                        : isCurrent
                        ? 'bg-blue-50 text-blue-800 border-2 border-blue-700'
                        : 'bg-slate-100 text-slate-500 border border-slate-300'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNumber}
                  </div>

                  {/* Step Label */}
                  <span
                    className={`mt-2 text-xs font-medium text-center hidden sm:block ${
                      isCurrent ? 'text-blue-900 font-semibold' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default StepIndicator;
