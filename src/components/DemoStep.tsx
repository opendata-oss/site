import { type ReactNode } from 'react';

interface DemoStepProps {
  stepNumber: number;
  title: string;
  description: ReactNode;
  code: string;
  codeTitle: string;
  isActive: boolean;
  onClick: () => void;
}

export default function DemoStep({
  stepNumber,
  title,
  description,
  code,
  codeTitle,
  isActive,
  onClick,
}: DemoStepProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border transition-all ${
        isActive
          ? 'border-[#6366f1] bg-[#6366f1]/5 shadow-sm'
          : 'border-[#e2e8f0] hover:border-[#94a3b8] bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 ${
            isActive
              ? 'bg-[#6366f1] text-white'
              : 'bg-[#f1f5f9] text-[#64748b]'
          }`}
        >
          {stepNumber}
        </span>
        <div className="min-w-0">
          <h4
            className={`text-sm font-semibold ${
              isActive ? 'text-[#0f172a]' : 'text-[#64748b]'
            }`}
          >
            {title}
          </h4>
          {isActive && (
            <div className="mt-1.5 text-sm text-[#64748b] leading-relaxed">
              {description}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
