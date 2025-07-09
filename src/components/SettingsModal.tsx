
import React, { useState, useEffect } from 'react';
import { XIcon, GoogleIcon, OpenAIIcon, AnthropicIcon, GrokIcon, KlingIcon } from './icons';
import { AIProvider } from '../types';
import { ApiKeys } from '../App';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKeys: ApiKeys) => void;
  currentApiKeys: ApiKeys;
}

const providers: { id: AIProvider; name: string; Icon: React.FC<{className?:string}> }[] = [
    { id: 'google', name: 'Google', Icon: GoogleIcon },
    { id: 'openai', name: 'OpenAI', Icon: OpenAIIcon },
    { id: 'anthropic', name: 'Anthropic', Icon: AnthropicIcon },
    { id: 'grok', name: 'Grok', Icon: GrokIcon },
    { id: 'kling', name: 'Kling', Icon: KlingIcon },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentApiKeys }) => {
  const [keys, setKeys] = useState<ApiKeys>({});
  const [activeTab, setActiveTab] = useState<AIProvider>('google');

  useEffect(() => {
    if (isOpen) {
        setKeys(currentApiKeys);
    }
  }, [currentApiKeys, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(keys);
  };

  const handleKeyChange = (provider: AIProvider, value: string) => {
    setKeys(prev => ({...prev, [provider]: value}));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-dark-card rounded-xl shadow-2xl w-full max-w-lg border border-dark-border" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">API Integrations</h2>
            <button type="button" onClick={onClose} className="p-1 rounded-full text-dark-text-secondary hover:bg-gray-700">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          <p className="mt-1 text-sm text-dark-text-secondary">
            Manage your API keys for each AI provider to run agents.
          </p>
        </div>
        <div className="border-y border-dark-border">
            <div className="border-b border-dark-border px-6">
                <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                    {providers.map(({id, name, Icon}) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`${
                                activeTab === id
                                ? 'border-brand-primary text-brand-secondary'
                                : 'border-transparent text-dark-text-secondary hover:text-white hover:border-gray-500'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center space-x-2`}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{name}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-6">
              {providers.map(({id, name}) => (
                <div key={id} style={{ display: activeTab === id ? 'block' : 'none' }}>
                    <label htmlFor={`${id}-api-key`} className="block text-sm font-medium text-dark-text">{name} API Key</label>
                    <input
                      type="password"
                      id={`${id}-api-key`}
                      value={keys[id] || ''}
                      onChange={(e) => handleKeyChange(id, e.target.value)}
                      placeholder={`Enter your ${name} API key`}
                      className="mt-1 block w-full bg-dark-input border-dark-border rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-3 text-white"
                    />
                </div>
              ))}
              <div className="mt-4 bg-yellow-900/50 border border-yellow-700 text-yellow-300 text-xs rounded-lg p-3 space-y-1">
                <p><strong>Security Notice:</strong> We do not store your API keys. They are saved exclusively in your browser&apos;s local storage and never leave your machine.</p>
                <p>For safe usage, ensure your computer is secure and be cautious with browser extensions, as they may be able to access your stored keys.</p>
              </div>
            </div>
        </div>
        <div className="p-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-dark-text-secondary bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-secondary rounded-lg shadow-md"
          >
            Save Keys
          </button>
        </div>
      </div>
    </div>
  );
};