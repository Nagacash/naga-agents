
import React from 'react';

interface StaticPageLayoutProps {
  title: string;
  children: React.ReactNode;
  onGoBack: () => void;
}

const BackArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);


export const StaticPageLayout: React.FC<StaticPageLayoutProps> = ({ title, children, onGoBack }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="mb-6">
            <button
                onClick={onGoBack}
                className="inline-flex items-center gap-x-2 text-sm font-semibold text-dark-text-secondary hover:text-white group transition-colors"
                aria-label="Go back to dashboard"
            >
                <BackArrowIcon className="transition-transform duration-300 group-hover:-translate-x-1" />
                Go Back to Dashboard
            </button>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-8 md:p-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">{title}</h1>
            <div className="prose prose-invert prose-lg text-dark-text-secondary leading-relaxed space-y-6">
                {children}
            </div>
        </div>
    </div>
);