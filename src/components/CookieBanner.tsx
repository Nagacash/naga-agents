
import React from 'react';

interface CookieBannerProps {
  onAccept: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border z-50 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-dark-text-secondary text-center sm:text-left">
          This site uses your browser&apos;s local storage to save your agents and API keys. We do not use traditional cookies for tracking. See our{' '}
        </p>
        <button
          onClick={onAccept}
          className="flex-shrink-0 rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
};