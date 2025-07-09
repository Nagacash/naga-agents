import React, { useState, useEffect, useMemo } from 'react';
import { Agent, AIProvider, AgentType, OutputQuality, Schedule } from '../types';
import { XIcon } from './icons';
import { MODELS_CONFIG } from '../constants';
import { calculateNextRunTime } from '../utils/scheduler';

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agentData: Omit<Agent, 'id' | 'status'>) => void;
  agentToEdit: Agent | null;
}

const placeholderMcp = JSON.stringify({
  "protocol": "mcp-0.1",
  "system_prompt": "You are a helpful assistant. Describe your primary function or persona here.",
  "user_prompt": "Enter the specific task or question for the agent here."
}, null, 2);

const imagePlaceholder = "A photorealistic image of an astronaut riding a horse on Mars.";
const videoPlaceholder = "A cinematic shot of a futuristic city in the rain.";

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const AgentModal: React.FC<AgentModalProps> = ({ isOpen, onClose, onSave, agentToEdit }) => {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [type, setType] = useState<AgentType>(AgentType.TEXT);
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [model, setModel] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isJsonValid, setIsJsonValid] = useState(true);
  const [outputQuality, setOutputQuality] = useState<OutputQuality>(OutputQuality.STANDARD);
  const [webSearch, setWebSearch] = useState(false);
  const [schedule, setSchedule] = useState<Schedule>(Schedule.MANUAL);
  const [scheduleValue, setScheduleValue] = useState('');
  const [scheduleDay, setScheduleDay] = useState(0);

  const availableProviders = useMemo(() => {
    return Object.keys(MODELS_CONFIG).filter(p => MODELS_CONFIG[p as AIProvider][type]) as AIProvider[];
  }, [type]);

  const availableModels = useMemo(() => {
    return MODELS_CONFIG[provider]?.[type] || [];
  }, [provider, type]);

  useEffect(() => {
    if (agentToEdit) {
      setName(agentToEdit.name);
      setGoal(agentToEdit.goal);
      setType(agentToEdit.type);
      setProvider(agentToEdit.provider);
      setModel(agentToEdit.model);
      setPrompt(agentToEdit.prompt);
      setOutputQuality(agentToEdit.outputQuality || OutputQuality.STANDARD);
      setWebSearch(agentToEdit.webSearch || false);
      setSchedule(agentToEdit.schedule || Schedule.MANUAL);
      setScheduleValue(agentToEdit.scheduleValue || '');
      setScheduleDay(agentToEdit.scheduleDay || 0);
      if (agentToEdit.type === AgentType.TEXT) {
        validateJson(agentToEdit.prompt);
      }
    } else {
      // Reset to default for new agent
      setName('');
      setGoal('');
      setType(AgentType.TEXT);
      setProvider('openai');
      setModel(MODELS_CONFIG.openai[AgentType.TEXT]![0].value);
      setPrompt('');
      setOutputQuality(OutputQuality.STANDARD);
      setWebSearch(false);
      setSchedule(Schedule.MANUAL);
      setScheduleValue('');
      setScheduleDay(0);
      setIsJsonValid(true);
    }
  }, [agentToEdit]);

  useEffect(() => {
    if (!availableProviders.includes(provider)) {
      setProvider(availableProviders[0]);
    }
  }, [availableProviders, provider]);

  useEffect(() => {
    if (availableModels.length > 0 && !availableModels.find(m => m.value === model)) {
      setModel(availableModels[0].value);
    } else if (availableModels.length === 0) {
      setModel('');
    }
  }, [availableModels, model]);

  if (!isOpen) return null;

  const validateJson = (value: string) => {
    if (type !== AgentType.TEXT) {
        setIsJsonValid(true);
        return;
    }
    if (!value.trim()) {
      setIsJsonValid(true);
      return;
    }
    try {
      JSON.parse(value);
      setIsJsonValid(true);
    } catch {
      setIsJsonValid(false);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (type === AgentType.TEXT) {
      validateJson(e.target.value);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !goal.trim() || !prompt.trim() || !provider || !model) {
        alert("All fields are required.");
        return;
    }
    if (type === AgentType.TEXT && !isJsonValid) {
        alert("The MCP field contains invalid JSON. Please correct it before saving.");
        return;
    }
    
    const nextRunTime = calculateNextRunTime(schedule, scheduleValue, scheduleDay);

    onSave({ name, goal, provider, model, type, prompt, outputQuality, webSearch, schedule, scheduleValue, scheduleDay, nextRunTime });
  };
  
  const getPromptLabel = () => {
    switch(type) {
      case AgentType.IMAGE: return "Image Prompt";
      case AgentType.VIDEO: return "Video Prompt";
      case AgentType.TEXT:
      default: return "Model Context Protocol (MCP)";
    }
  };
  
  const getPromptPlaceholder = () => {
    switch(type) {
        case AgentType.IMAGE: return imagePlaceholder;
        case AgentType.VIDEO: return videoPlaceholder;
        case AgentType.TEXT:
        default: return placeholderMcp;
    }
  };
  
  const renderScheduleInputs = () => {
    switch(schedule) {
        case Schedule.ONCE:
            return <input type="datetime-local" value={scheduleValue} onChange={e => setScheduleValue(e.target.value)} className="mt-1 w-full bg-dark-input border-dark-border rounded-lg p-3" required />;
        case Schedule.HOURLY:
        case Schedule.DAILY:
            return <input type="time" value={scheduleValue} onChange={e => setScheduleValue(e.target.value)} className="mt-1 w-full bg-dark-input border-dark-border rounded-lg p-3" required />;
        case Schedule.WEEKLY:
            return (
                <div className="grid grid-cols-2 gap-4">
                    <select value={scheduleDay} onChange={e => setScheduleDay(Number(e.target.value))} className="mt-1 w-full bg-dark-input border-dark-border rounded-lg p-3">
                        {WEEKDAYS.map((day, i) => <option key={i} value={i}>{day}</option>)}
                    </select>
                    <input type="time" value={scheduleValue} onChange={e => setScheduleValue(e.target.value)} className="mt-1 w-full bg-dark-input border-dark-border rounded-lg p-3" required />
                </div>
            );
        case Schedule.MONTHLY:
            return (
                <div className="grid grid-cols-2 gap-4">
                     <input type="number" min="1" max="31" value={scheduleDay || 1} onChange={e => setScheduleDay(Number(e.target.value))} placeholder="Day of month" className="mt-1 w-full bg-dark-input border-dark-border rounded-lg p-3" required />
                    <input type="time" value={scheduleValue} onChange={e => setScheduleValue(e.target.value)} className="mt-1 w-full bg-dark-input border-dark-border rounded-lg p-3" required />
                </div>
            );
        default:
            return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-dark-card rounded-xl shadow-2xl w-full max-w-2xl border border-dark-border" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{agentToEdit ? 'Edit Agent' : 'Create New Agent'}</h2>
              <button type="button" onClick={onClose} className="p-1 rounded-full text-dark-text-secondary hover:bg-gray-700">
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="mt-1 text-sm text-dark-text-secondary">
              Define the agent&apos;s identity, type, instructions, and schedule.
            </p>
          </div>
          <div className="p-6 space-y-6 border-y border-dark-border max-h-[70vh] overflow-y-auto">
            <div>
              <label htmlFor="agent-name" className="block text-sm font-medium text-dark-text">Agent Name</label>
              <input type="text" id="agent-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., &apos;Daily Report Bot&apos;" className="mt-1 block w-full bg-dark-input border-dark-border rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-3 text-white" required />
            </div>
            <div>
              <label htmlFor="agent-goal" className="block text-sm font-medium text-dark-text">Agent&apos;s Goal</label>
              <input type="text" id="agent-goal" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="A short, clear objective for the agent." className="mt-1 block w-full bg-dark-input border-dark-border rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-3 text-white" required />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="agent-type" className="block text-sm font-medium text-dark-text">Agent Type</label>
                <select id="agent-type" value={type} onChange={(e) => setType(e.target.value as AgentType)} className="mt-1 block w-full bg-dark-input border-dark-border rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-3 text-white">
                  {Object.values(AgentType).map(t => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
               <div>
                <label htmlFor="agent-provider" className="block text-sm font-medium text-dark-text">AI Provider</label>
                <select id="agent-provider" value={provider} onChange={(e) => setProvider(e.target.value as AIProvider)} className="mt-1 block w-full bg-dark-input border-dark-border rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-3 text-white">
                  {availableProviders.map(p => (<option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>))}
                </select>
              </div>
            </div>
             <div>
                <label htmlFor="agent-model" className="block text-sm font-medium text-dark-text">Model</label>
                 <select id="agent-model" value={model} onChange={(e) => setModel(e.target.value)} className="mt-1 block w-full bg-dark-input border-dark-border rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-3 text-white">
                  {availableModels.map(m => (<option key={m.value} value={m.value}>{m.name}</option>))}
                </select>
              </div>
            
            <div className="border-t border-dark-border pt-6">
                <h3 className="text-lg font-medium text-white">Schedule</h3>
                <p className="mt-1 text-xs text-dark-text-secondary">Set a schedule to run this agent automatically. Requires the app to be open in a browser tab.</p>
                <div className="mt-4">
                    <label htmlFor="schedule-type" className="block text-sm font-medium text-dark-text">Frequency</label>
                    <select id="schedule-type" value={schedule} onChange={e => setSchedule(e.target.value as Schedule)} className="mt-1 w-full bg-dark-input border-dark-border rounded-lg p-3">
                        {Object.values(Schedule).map(s => (<option key={s} value={s}>{s}</option>))}
                    </select>
                </div>
                <div className="mt-4">
                    {renderScheduleInputs()}
                </div>
            </div>
            {type === AgentType.IMAGE && (
                <div>
                    <label htmlFor="output-quality" className="block text-sm font-medium text-dark-text">Output Quality</label>
                    <select id="output-quality" value={outputQuality} onChange={(e) => setOutputQuality(e.target.value as OutputQuality)} className="mt-1 block w-full bg-dark-input border-dark-border rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-3 text-white">
                        {Object.values(OutputQuality).map(q => (<option key={q} value={q}>{q}</option>))}
                    </select>
                    <p className="mt-2 text-xs text-dark-text-secondary">&quot;Full&quot; may result in higher quality, but also higher API costs.</p>
                </div>
            )}
            {type === AgentType.TEXT && provider === 'google' && (
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={webSearch}
                    onChange={(e) => setWebSearch(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-500 bg-dark-input text-brand-primary focus:ring-brand-primary focus:ring-offset-dark-card"
                  />
                  <span className="text-sm font-medium text-dark-text">Enable Web Search</span>
                </label>
                <p className="mt-2 text-xs text-dark-text-secondary">Allows the agent to access Google Search for up-to-date information. Only available for Google text models.</p>
              </div>
            )}
            <div>
              <label htmlFor="agent-prompt" className="block text-sm font-medium text-dark-text">{getPromptLabel()}</label>
              <textarea id="agent-prompt" rows={type === AgentType.TEXT ? 12 : 4} value={prompt} onChange={handlePromptChange} placeholder={getPromptPlaceholder()} className={`mt-1 block w-full bg-dark-input rounded-lg shadow-sm sm:text-sm p-3 text-white transition-colors ${type === AgentType.TEXT ? 'font-mono' : 'font-sans'} ${!isJsonValid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-dark-border focus:ring-brand-primary focus:border-brand-primary'}`} required />
              {type === AgentType.TEXT && !isJsonValid && <p className="mt-2 text-sm text-red-400">Invalid JSON format.</p>}
            </div>
          </div>
          <div className="p-6 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-dark-text-secondary bg-gray-700 hover:bg-gray-600 rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-secondary rounded-lg shadow-md">{agentToEdit ? 'Save Changes' : 'Create Agent'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};