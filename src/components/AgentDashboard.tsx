import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Agent, AgentStatus, AgentType, OutputQuality, Source, Schedule } from '../types';
import { DUMMY_AGENTS } from '../constants';
import { AgentCard } from './AgentCard';
import { AgentModal } from './AgentModal';
import { PlusCircleIcon } from './icons';
import { GoogleGenerativeAI, GenerateContentResult, GenerationConfig, Part, Content } from '@google/generative-ai';

import { ApiKeys } from '../App';
import { calculateNextRunTime } from '../utils/scheduler';

interface AgentDashboardProps {
    apiKeys: ApiKeys;
    onConfigureKey: () => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ apiKeys, onConfigureKey }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentToEdit, setAgentToEdit] = useState<Agent | null>(null);
  const dashboardGridRef = useRef<HTMLDivElement>(null);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const savedAgents = localStorage.getItem('agents');
    if (savedAgents) {
        setAgents(JSON.parse(savedAgents));
    } else {
        setAgents(DUMMY_AGENTS);
    }
  }, []);

  useEffect(() => {
    if (agents.length > 0) {
      localStorage.setItem('agents', JSON.stringify(agents));
    }
  }, [agents]);

  const runAgent = useCallback(async (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    const apiKey = apiKeys[agent.provider];
    if (!apiKey) {
      alert(`Please set your ${agent.provider.charAt(0).toUpperCase() + agent.provider.slice(1)} API key in Settings before running this agent.`);
      onConfigureKey();
      return;
    }

    setAgents(prev => prev.map(a =>
      a.id === agentId ? { ...a, status: AgentStatus.RUNNING, output: undefined, error: undefined, sources: undefined } : a
    ));

    try {
        let output = '';
        let sources: Source[] = [];

        if (agent.type === AgentType.IMAGE) {
            switch(agent.provider) {
                case 'google':
                    throw new Error("Google image generation (direct image file output) is not supported via @google/generative-ai. Please use Google Cloud's Imagen API or a different provider.");

                case 'openai':
                    const quality = agent.outputQuality === OutputQuality.FULL ? 'hd' : 'standard';
                    const openaiImgResponse = await fetch('https://api.openai.com/v1/images/generations', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}`},
                        body: JSON.stringify({ model: agent.model, prompt: agent.prompt, n: 1, size: '1024x1024', quality: quality, response_format: 'b64_json' })
                    });
                    if (!openaiImgResponse.ok) {
                        const errorData = await openaiImgResponse.json();
                        throw new Error(`OpenAI API Error: ${errorData.error.message}`);
                    }
                    const openaiImgData = await openaiImgResponse.json();
                    if (!openaiImgData.data?.[0]?.b64_json) {
                        throw new Error('No image data received from OpenAI');
                    }
                    output = openaiImgData.data[0].b64_json;
                    break;
                default:
                    throw new Error(`Image generation is not supported for provider: ${agent.provider}`);
            }
        } else { // Text agent
            const mcp = JSON.parse(agent.prompt);
            switch(agent.provider) {
                case 'google': {
                  const ai = new GoogleGenerativeAI(apiKey);
                  const model = ai.getGenerativeModel({ model: agent.model });

                  const contents: Content[] = [
                    { role: 'user', parts: [{ text: mcp.user_prompt }] }
                  ];

                  const generationConfig: GenerationConfig = {};

                  const request: {
                      contents: Content[];
                      generationConfig?: GenerationConfig;
                      tools?: any[];
                      systemInstruction?: string; // Add systemInstruction to the request type
                  } = {
                    contents: contents,
                    generationConfig: generationConfig,
                    systemInstruction: mcp.system_prompt // Move systemInstruction here
                  };

                  if (agent.webSearch) {
                    request.tools = [{ googleSearch: {} }];
                  }

                  const result: GenerateContentResult = await model.generateContent(request);
                  const response = await result.response;

                  output = response.text() || '';

                  const citationMetadata = response.candidates?.[0]?.citationMetadata;
                  if (citationMetadata?.citationSources && citationMetadata.citationSources.length > 0) {
                      const sourceMap = new Map<string, Source>();
                      citationMetadata.citationSources.forEach(citation => {
                          if (citation.uri) {
                              sourceMap.set(citation.uri, {
                                  uri: citation.uri,
                                  // FIXED: 'publisher' does not exist on CitationSource, using 'uri' as title
                                  title: citation.uri
                              });
                          }
                      });
                      sources = Array.from(sourceMap.values());
                  }

                  break;
                }
                case 'openai': {
                  const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                    body: JSON.stringify({
                      model: agent.model,
                      messages: [{ role: 'system', content: mcp.system_prompt }, { role: 'user', content: mcp.user_prompt }]
                    })
                  });
                  if (!openaiResponse.ok) { const errorData = await openaiResponse.json(); throw new Error(`OpenAI API Error: ${errorData.error.message}`); }
                  const openaiData = await openaiResponse.json();
                  output = openaiData.choices[0]?.message?.content || 'No response from model.';
                  break;
                }
                case 'anthropic': {
                  const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
                    body: JSON.stringify({ model: agent.model, system: mcp.system_prompt, messages: [{ role: 'user', content: mcp.user_prompt }], max_tokens: 2048 })
                  });
                   if (!anthropicResponse.ok) { const errorData = await anthropicResponse.json(); throw new Error(`Anthropic API Error: ${errorData.error.message}`); }
                  const anthropicData = await anthropicResponse.json();
                  output = anthropicData.content[0]?.text || 'No response from model.';
                  break;
                }
                case 'grok': {
                  const grokResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                    body: JSON.stringify({
                      model: agent.model,
                      messages: [{ role: 'system', content: mcp.system_prompt }, { role: 'user', content: mcp.user_prompt }]
                    })
                  });
                  if (!grokResponse.ok) { const errorData = await grokResponse.json(); throw new Error(`Grok API Error: ${errorData.error.message}`); }
                  const grokData = await grokResponse.json();
                  output = grokData.choices[0]?.message?.content || 'No response from model.';
                  break;
                }
            }
        }

      const nextRunTime = calculateNextRunTime(agent.schedule, agent.scheduleValue, agent.scheduleDay);
      const schedule = agent.schedule === Schedule.ONCE ? Schedule.MANUAL : agent.schedule;

      setAgents(prev => prev.map(a =>
        a.id === agentId ? { ...a, status: AgentStatus.IDLE, output, sources, lastRunTime: Date.now(), nextRunTime, schedule } : a
      ));
    } catch (e: unknown) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setAgents(prev => prev.map(a =>
        a.id === agentId ? { ...a, status: AgentStatus.ERROR, error: errorMessage } : a
      ));
    }
  }, [agents, apiKeys, onConfigureKey]);


  useEffect(() => {
    const scheduler = setInterval(() => {
      const now = Date.now();
      agents.forEach(agent => {
        if (agent.status !== AgentStatus.RUNNING && agent.schedule !== Schedule.MANUAL && agent.nextRunTime && agent.nextRunTime <= now) {
          console.log(`Scheduler: Running agent ${agent.name}`);
          runAgent(agent.id);
        }
      });
    }, 15000); // Check every 15 seconds

    return () => clearInterval(scheduler);
  }, [agents, runAgent]);

  const handleCreateNewAgent = () => {
    setAgentToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setAgentToEdit(agent);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAgentToEdit(null);
  };

  const handleSaveAgent = (agentData: Omit<Agent, 'id' | 'status'>) => {
    if (agentToEdit) {
      setAgents(agents.map(a => a.id === agentToEdit.id ? { ...agentToEdit, ...agentData, output: undefined, error: undefined, sources: undefined } : a));
    } else {
      const newAgent: Agent = {
        id: crypto.randomUUID(),
        ...agentData,
        status: AgentStatus.IDLE,
      };
      setAgents([newAgent, ...agents]);
    }
    handleCloseModal();
  };

  const handleDeleteAgent = useCallback((agentId: string) => {
    setAgents(prev => prev.filter(a => a.id !== agentId));
  }, []);

  const handleToggleStatus = useCallback(async (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    if (agent.status === AgentStatus.RUNNING) {
      setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: AgentStatus.PAUSED } : a));
      return;
    }

    runAgent(agentId);
  }, [agents, runAgent]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="flex justify-end mb-6">
        <button
          onClick={handleCreateNewAgent}
          className="inline-flex items-center gap-x-2 rounded-md bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary transition-colors"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Create New Agent
        </button>
      </div>
      <div ref={dashboardGridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent, index) => (
          <motion.div
            className="agent-card"
            key={agent.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <AgentCard
              agent={agent}
              onEdit={() => handleEditAgent(agent)}
              onDelete={() => handleDeleteAgent(agent.id)}
              onToggleStatus={() => handleToggleStatus(agent.id)}
            />
          </motion.div>
        ))}
      </div>
      {isModalOpen && (
        <AgentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveAgent}
          agentToEdit={agentToEdit}
        />
      )}
    </div>
  );
};