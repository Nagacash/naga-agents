import React from 'react';
import { XIcon, /* LinkIcon */ } from './icons';
import { Source } from '../types';
import { renderTextWithLinks } from '../utils/textUtils';

interface OutputModalProps {
  isOpen: boolean;
  onClose: () => void;
  output?: string;
  error?: string;
  sources?: Source[];
}

export const OutputModal: React.FC<OutputModalProps> = ({ isOpen, onClose, output, error, sources }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-dark-card rounded-xl shadow-2xl w-full max-w-3xl h-3/4 flex flex-col border border-dark-border" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 flex justify-between items-center border-b border-dark-border">
          <h2 className="text-2xl font-bold text-white">Agent Output</h2>
          <button type="button" onClick={onClose} className="p-1 rounded-full text-dark-text-secondary hover:bg-gray-700">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 flex-grow overflow-y-auto text-sm text-dark-text-secondary">
          {error ? (
            <pre className="text-red-400 whitespace-pre-wrap break-words font-sans">{error}</pre>
          ) : (
            <>
              {output && (
                <pre className="whitespace-pre-wrap break-words font-sans leading-relaxed mb-4">
                  {renderTextWithLinks(output)}
                </pre>
              )}
              {sources && sources.length > 0 && (
                <div className="pt-4 border-t border-dark-border mt-4">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sources</h4>
                  <ul className="space-y-2">
                    {sources.map((source, index) => (
                      <li key={index} className="truncate">
                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline flex items-center space-x-2">
                          <LinkIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate" title={source.title || source.uri}>{source.title || source.uri}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!output && !error && (!sources || sources.length === 0) && (
                <p>No output, error, or sources available.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};