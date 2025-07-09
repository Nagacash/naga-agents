
import React from 'react';
import { StaticPageLayout } from './StaticPageLayout';

interface LearnMorePageProps {
    onGoBack: () => void;
}

export const LearnMorePage: React.FC<LearnMorePageProps> = ({ onGoBack }) => {
  return (
    <StaticPageLayout title="What is Naga Codex Agents?" onGoBack={onGoBack}>
        <p className="text-lg">
            Naga Codex Agents is your personal command center for creating and managing a workforce of AI agents. It&apos;s a powerful, intuitive platform designed to help you automate tasks, streamline workflows, and boost productivity by leveraging the world&apos;s most advanced AI models.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">How It Works</h2>
        <p>The entire application runs directly in your browser. This client-side approach puts you in complete control of your data and API keys.</p>
        <ol className="list-decimal list-inside space-y-2 mt-4">
            <li><strong>Create an Agent:</strong> Define an agent by giving it a name, a clear goal, and a prompt using the structured Model Context Protocol (MCP).</li>
            <li><strong>Choose Your AI:</strong> Select from a wide range of providers and models, including Google Gemini, OpenAI&apos;s GPT, Anthropic&apos;s Claude, and high-speed models from Groq.</li>
            <li><strong>Configure Your Keys:</strong> Securely add your API keys to the application. They are stored only in your browser&apos;s local storage and are never sent to our servers.</li>
            <li><strong>Run & Automate:</strong> Execute your agents manually from the dashboard. The application will use your key to make a direct request to the AI provider and display the result.</li>
        </ol>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-3 mt-4">
            <li>
                <strong>Multi-Provider Support:</strong> Don&apos;t get locked into one ecosystem. Use the best model for the job by seamlessly switching between Google, OpenAI, Anthropic, and Grok.
            </li>
            <li>
                <strong>Client-Side Security:</strong> Your privacy is paramount. Your API keys and agent configurations never leave your machine, giving you full ownership and control.
            </li>
            <li>
                <strong>Prompt-Based Control:</strong> Harness the power of structured MCP prompts to give your agents clear instructions, personas, and tasks.
            </li>
            <li>
                <strong>Intuitive Dashboard:</strong> Manage your entire workforce of AI agents from a single, clean interface. Create, edit, run, and delete agents with ease.
            </li>
        </ul>

        <div className="mt-8 p-4 bg-brand-primary/10 border border-brand-secondary/30 rounded-lg text-brand-secondary">
            <p className="font-bold">Ready to get started?</p>
            <p>Go back to the dashboard and click &quot;Create New Agent&quot; to build your first automated worker in seconds!</p>
        </div>
    </StaticPageLayout>
  );
};