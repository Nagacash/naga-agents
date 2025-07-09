import React, { useState, useEffect } from 'react';
import { Agent, AgentStatus, AIProvider, AgentType, Schedule } from '../types';
import { PlayIcon, PauseIcon, EditIcon, Trash2Icon, WrenchIcon, GoogleIcon, OpenAIIcon, AnthropicIcon, GrokIcon, ChipIcon, ImageIcon, VideoIcon, ZapIcon, GlobeIcon, LinkIcon, ClockIcon } from './icons';
import { formatSchedule } from '../utils/scheduler';
import { renderTextWithLinks } from '../utils/textUtils';
import { OutputModal } from './OutputModal'; // Import OutputModal

interface AgentCardProps {
  agent: Agent;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const PROVIDER_ICONS: Record<AIProvider, React.FC<{className?: string}>> = {
    google: GoogleIcon,
    openai: OpenAIIcon,
    anthropic: AnthropicIcon,
    grok: GrokIcon,
    kling: VideoIcon, // Placeholder
};

const TYPE_ICONS: Record<AgentType, React.FC<{className?: string}>> = {
    [AgentType.TEXT]: WrenchIcon,
    [AgentType.IMAGE]: ImageIcon,
    [AgentType.VIDEO]: VideoIcon,
};

const StatusBadge: React.FC<{ status: AgentStatus }> = ({ status }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full inline-flex items-center";
  const statusConfig = {
    [AgentStatus.RUNNING]: { classes: "bg-green-500/20 text-green-400", text: "Running", spinner: <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div> },
    [AgentStatus.IDLE]: { classes: "bg-gray-500/20 text-gray-400", text: "Idle", spinner: <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div> },
    [AgentStatus.PAUSED]: { classes: "bg-yellow-500/20 text-yellow-400", text: "Paused", spinner: <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div> },
    [AgentStatus.ERROR]: { classes: "bg-red-500/20 text-red-400", text: "Error", spinner: <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div> },
  };
  const config = statusConfig[status];
  return (
    <span className={`${baseClasses} ${config.classes}`}>
      {config.spinner}
      {config.text}
    </span>
  );
};

const formatRelativeTime = (timestamp: number) => {
    const now = new Date();
    const future = new Date(timestamp);
    const diffSeconds = Math.round((future.getTime() - now.getTime()) / 1000);

    if (diffSeconds < 0) return "in the past";
    if (diffSeconds < 60) return `in ${diffSeconds}s`;
    
    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `in ${diffMinutes}m`;

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `in ${diffHours}h`;

    const diffDays = Math.round(diffHours / 24);
    return `in ${diffDays}d`;
};

const NextRun: React.FC<{ agent: Agent }> = ({ agent }) => {
    const [relativeTime, setRelativeTime] = useState('');

    useEffect(() => {
        if (agent.schedule === Schedule.MANUAL || !agent.nextRunTime) {
            setRelativeTime('');
            return;
        }

        const update = () => {
            const nextRun = new Date(agent.nextRunTime!);
            if (nextRun.getTime() > Date.now()) {
                setRelativeTime(formatRelativeTime(agent.nextRunTime!));
            } else {
                 setRelativeTime('due');
            }
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);

    }, [agent.nextRunTime, agent.schedule]);
    
    if (agent.schedule === Schedule.MANUAL || !agent.nextRunTime) return null;

    return (
        <div className="flex items-center space-x-2 mt-1">
            <ClockIcon className="w-3 h-3 text-dark-text-secondary"/>
            <span className="text-xs text-dark-text-secondary">
                Next run: {relativeTime}
            </span>
        </div>
    );
};

const PromptDisplay: React.FC<{ agent: Agent }> = ({ agent }) => {
  if (agent.type !== AgentType.TEXT) {
    return (
      <div className="text-left">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Prompt</p>
        <p className="mt-1 text-sm text-dark-text-secondary line-clamp-3">{agent.prompt}</p>
      </div>
    );
  }
  try {
    const mcp = JSON.parse(agent.prompt);
    if (typeof mcp === 'object' && mcp !== null && mcp.system_prompt) {
      return (
        <div className="text-left space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">System Prompt</p>
            <p className="mt-1 text-sm text-dark-text-secondary truncate">{mcp.system_prompt}</p>
          </div>
          {mcp.user_prompt && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">User Prompt</p>
              <p className="mt-1 text-sm text-dark-text-secondary line-clamp-2">{mcp.user_prompt}</p>
            </div>
          )}
        </div>
      );
    }
  } catch { /* Not valid JSON */ }
  return (
    <div className="text-left">
      <p className="text-xs font-semibold text-gray-400 uppercase">Legacy Prompt</p>
      <p className="mt-1 text-sm text-dark-text-secondary">{agent.prompt}</p>
    </div>
  );
};



export const AgentCard: React.FC<AgentCardProps> = ({ agent, onEdit, onDelete, onToggleStatus }) => {
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false); // State for modal

  const ProviderIcon = PROVIDER_ICONS[agent.provider] || ChipIcon;
  const TypeIcon = TYPE_ICONS[agent.type] || ChipIcon;
  
  return (
    <div className="bg-dark-card rounded-xl border border-dark-border shadow-lg flex flex-col h-full overflow-hidden transition-all duration-300 hover:border-brand-primary hover:shadow-2xl">
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-white pr-4">{agent.name}</h3>
          <StatusBadge status={agent.status} />
        </div>
        
        <div className="flex items-center space-x-2 text-dark-text-secondary text-xs mt-1">
            <ClockIcon className="w-3 h-3" />
            <span>{formatSchedule(agent)}</span>
        </div>
        <NextRun agent={agent} />

        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-dark-text-secondary">
            <div className="flex items-center space-x-2">
                <ProviderIcon className="w-4 h-4" />
                <span className="font-semibold">{agent.model}</span>
            </div>
            <div className="flex items-center space-x-2">
                <TypeIcon className="w-4 h-4" />
                <span className="font-semibold">{agent.type}</span>
            </div>
            {agent.type === AgentType.IMAGE && agent.outputQuality && (
                <div className="flex items-center space-x-2">
                    <ZapIcon className="w-4 h-4" />
                    <span className="font-semibold">{agent.outputQuality} Quality</span>
                </div>
            )}
            {agent.webSearch && (
              <div className="flex items-center space-x-2">
                <GlobeIcon className="w-4 h-4" />
                <span className="font-semibold">Web Search</span>
              </div>
            )}
        </div>

        <p className="mt-3 text-sm text-dark-text-secondary h-10 overflow-hidden">{agent.goal}</p>
        
        <div className="mt-4 bg-dark-bg/50 p-3 rounded-lg font-mono border border-dark-border overflow-y-auto min-h-[90px]">
            <PromptDisplay agent={agent} />
        </div>

        {(agent.output || agent.error || (agent.sources && agent.sources.length > 0)) && (
          <div className="mt-4 flex-grow flex flex-col min-h-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Last Run Output</p>
            <div 
              className="bg-dark-bg/50 rounded-lg border border-dark-border overflow-y-auto text-sm flex-grow max-h-64 cursor-pointer hover:border-brand-primary transition-colors duration-200"
              onClick={() => setIsOutputModalOpen(true)}
            >
              {agent.error ? (
                <pre className="text-red-400 whitespace-pre-wrap break-words font-sans p-3">{agent.error}</pre>
              ) : agent.type === AgentType.IMAGE && agent.output ? (
                <img src={`data:image/png;base64,${agent.output}`} alt="Generated by AI" className="w-full h-full object-contain rounded-lg" />
              ) : (
                <>
                  {agent.output && (
                    <pre className="text-dark-text-secondary whitespace-pre-wrap break-words font-sans p-4 leading-relaxed">
                        {renderTextWithLinks(agent.output)}
                    </pre>
                  )}
                  {agent.webSearch && ( // Show sources section if web search was enabled
                      <div className="pt-4 border-t border-dark-border">
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sources</h4>
                          {agent.sources && agent.sources.length > 0 ? (
                              <ul className="space-y-2">
                                  {agent.sources
                                      .filter(Boolean)
                                      .map((source, index) => (
                                      <li key={index} className="truncate">
                                          <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline flex items-center space-x-2">
                                              <LinkIcon className="w-4 h-4 flex-shrink-0" />
                                              <span className="truncate" title={source.title || source.uri}>{source.title || source.uri}</span>
                                          </a>
                                      </li>
                                  ))}
                              </ul>
                          ) : (
                              <p className="text-sm text-dark-text-secondary">No sources found for this output.</p>
                          )}
                      </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {isOutputModalOpen && (
          <OutputModal
            isOpen={isOutputModalOpen}
            onClose={() => setIsOutputModalOpen(false)}
            output={agent.output}
            error={agent.error}
            sources={agent.sources}
          />
        )}
      </div>
      <div className="bg-dark-card/50 border-t border-dark-border p-4 flex justify-between items-center mt-auto">
        <div className="flex items-center space-x-2">
            <button
                onClick={onToggleStatus}
                className={`p-2 rounded-full transition-colors duration-200 ${
                    agent.status === AgentStatus.RUNNING 
                    ? 'text-yellow-400 hover:bg-yellow-500/20' 
                    : 'text-green-400 hover:bg-green-500/20'
                }`}
                aria-label={agent.status === AgentStatus.RUNNING ? 'Pause Agent' : 'Run Agent'}
            >
                {agent.status === AgentStatus.RUNNING ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
            </button>
        </div>
        <div className="flex items-center space-x-2">
            <button 
                onClick={onEdit}
                className="p-2 text-dark-text-secondary hover:text-white hover:bg-gray-600/50 rounded-full transition-colors"
                aria-label="Edit Agent"
            >
                <EditIcon className="h-5 w-5" />
            </button>
            <button 
                onClick={onDelete}
                className="p-2 text-dark-text-secondary hover:text-red-500 hover:bg-red-500/20 rounded-full transition-colors"
                aria-label="Delete Agent"
            >
                <Trash2Icon className="h-5 w-5" />
            </button>
        </div>
      </div>
    </div>
  );
};