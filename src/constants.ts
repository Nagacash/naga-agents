import { Agent, AgentStatus, AIProvider, AgentType, OutputQuality, Schedule } from './types';

export const MODELS_CONFIG: Record<AIProvider, Partial<Record<AgentType, { name: string; value: string }[]>>> = {
  google: {
    [AgentType.TEXT]: [{ name: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' }],
    [AgentType.IMAGE]: [{ name: 'Imagen 3', value: 'imagen-3.0-generate-002' }],
    [AgentType.VIDEO]: [{ name: 'Veo', value: 'veo' }],
  },
  openai: {
    [AgentType.TEXT]: [
      { name: 'GPT-4o', value: 'gpt-4o' },
      { name: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
      { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
    ],
    [AgentType.IMAGE]: [{ name: 'DALL-E 3', value: 'dall-e-3' }],
  },
  anthropic: {
    [AgentType.TEXT]: [
      { name: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20240620' },
      { name: 'Claude 3 Opus', value: 'claude-3-opus-20240229' },
      { name: 'Claude 3 Haiku', value: 'claude-3-haiku-20240307' },
    ],
  },
  grok: {
    [AgentType.TEXT]: [
      { name: 'Llama 3 70b', value: 'llama3-70b-8192' },
      { name: 'Llama 3 8b', value: 'llama3-8b-8192' },
      { name: 'Mixtral 8x7b', value: 'mixtral-8x7b-32768' },
      { name: 'Gemma 7b', value: 'gemma-7b-it' },
    ],
  },
  kling: {
    [AgentType.VIDEO]: [{ name: 'Kling', value: 'kling' }],
  },
};

export const DUMMY_AGENTS: Agent[] = [
  {
    id: 'img1',
    name: 'OpenAI: Photorealistic Images',
    goal: 'Generate photorealistic images with DALL-E 3.',
    provider: 'openai',
    model: 'dall-e-3',
    type: AgentType.IMAGE,
    prompt: 'A photorealistic image of an astronaut riding a horse on Mars.',
    status: AgentStatus.IDLE,
    outputQuality: OutputQuality.STANDARD,
    schedule: Schedule.MANUAL,
  },
  {
    id: 'img2',
    name: 'Google: Creative Artwork',
    goal: 'Generate creative art with Imagen 3.',
    provider: 'google',
    model: 'imagen-3.0-generate-002',
    type: AgentType.IMAGE,
    prompt: 'A synthwave-style illustration of a futuristic city at sunset.',
    status: AgentStatus.IDLE,
    outputQuality: OutputQuality.STANDARD,
    schedule: Schedule.MANUAL,
  },
  {
    id: '1',
    name: 'OpenAI: Marketing Copy',
    goal: 'Create compelling marketing slogans using GPT-4o.',
    provider: 'openai',
    model: 'gpt-4o',
    type: AgentType.TEXT,
    webSearch: false,
    prompt: JSON.stringify({
      "protocol": "mcp-0.1",
      "system_prompt": "You are a world-class marketing expert. You craft catchy, memorable, and effective copy.",
      "user_prompt": "Generate 5 slogans for a new brand of eco-friendly coffee."
    }, null, 2),
    status: AgentStatus.IDLE,
    schedule: Schedule.MANUAL,
  },
  {
    id: '2',
    name: 'Anthropic: Code Explainer',
    goal: 'Explain complex code snippets in simple terms using Claude 3.5 Sonnet.',
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20240620',
    type: AgentType.TEXT,
    webSearch: false,
    prompt: JSON.stringify({
      "protocol": "mcp-0.1",
      "system_prompt": "You are an expert software engineer who is great at teaching beginners. You explain code clearly and concisely, avoiding jargon where possible.",
      "user_prompt": "Explain what this JavaScript code does:\n\nconst memoize = (fn) => {\n  const cache = {};\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (cache[key]) {\n      return cache[key];\n    }\n    const result = fn(...args);\n    cache[key] = result;\n    return result;\n  };\n};"
    }, null, 2),
    status: AgentStatus.IDLE,
    schedule: Schedule.MANUAL,
  },
    {
    id: '3',
    name: 'Google: Creative Story Writer',
    goal: 'Generate short, creative stories based on a simple prompt using Gemini.',
    provider: 'google',
    model: 'gemini-2.5-flash',
    type: AgentType.TEXT,
    webSearch: false,
    prompt: JSON.stringify({
      "protocol": "mcp-0.1",
      "system_prompt": "You are a master storyteller. Your stories are engaging, concise, and have a touch of wonder.",
      "user_prompt": "Write a 100-word story about a robot who discovers music."
    }, null, 2),
    status: AgentStatus.IDLE,
    schedule: Schedule.MANUAL,
  },
  {
    id: '4',
    name: 'Grok: Code Optimizer',
    goal: 'Refactor code for performance and readability using Llama 3 on Groq.',
    provider: 'grok',
    model: 'llama3-70b-8192',
    type: AgentType.TEXT,
    webSearch: false,
    prompt: JSON.stringify({
      "protocol": "mcp-0.1",
      "system_prompt": "You are a senior principal engineer specializing in high-performance code. Refactor the given code to be more efficient and readable, explaining your changes.",
      "user_prompt": "Please refactor this Python function to be more performant:\n\ndef find_duplicates(items):\n    duplicates = []\n    for i in range(len(items)):\n        for j in range(i + 1, len(items)):\n            if items[i] == items[j] and items[i] not in duplicates:\n                duplicates.append(items[i])\n    return duplicates"
    }, null, 2),
    status: AgentStatus.IDLE,
    schedule: Schedule.MANUAL,
  },
  {
    id: '5',
    name: 'Google: News Summarizer',
    goal: 'Get up-to-date summaries on current events with web search.',
    provider: 'google',
    model: 'gemini-2.5-flash',
    type: AgentType.TEXT,
    webSearch: true,
    prompt: JSON.stringify({
      "protocol": "mcp-0.1",
      "system_prompt": "You are a news analyst. You provide concise, neutral summaries of recent events based on web search results. Always cite your sources.",
      "user_prompt": "What are the latest developments in AI-powered robotics?"
    }, null, 2),
    status: AgentStatus.IDLE,
    schedule: Schedule.MANUAL,
  },
];