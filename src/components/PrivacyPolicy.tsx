import React from 'react';
import { StaticPageLayout } from './StaticPageLayout';

interface PrivacyPolicyProps {
    onGoBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onGoBack }) => {
  return (
    <StaticPageLayout title="Privacy Policy" onGoBack={onGoBack}>
        <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-white mt-6 mb-4">Introduction</h2>
        <p>
            Welcome to Naga Codex Agents (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). We are committed to protecting your privacy. This Privacy Policy explains how we handle your information when you use our web application (the &quot;Service&quot;). This is a client-side application, which has significant privacy implications.
        </p>

        <h2 className="text-2xl font-bold text-white mt-6 mb-4">Information We Collect</h2>
        <p>Because Naga Codex Agents is a client-side application, we do not have servers that collect and store your personal data. The information handled by the application is stored directly in your web browser.</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong>API Keys:</strong> To interact with third-party AI providers (like Google, OpenAI, etc.), you must provide your own API keys. These keys are stored exclusively in your browser&apos;s `localStorage`. They are never transmitted to, or stored on, any servers owned or managed by Naga Codex Agents.</li>
            <li><strong>Agent Configurations:</strong> The agents you create, including their names, goals, and prompts, are also stored in your browser&apos;s `localStorage`. This data remains on your machine.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-6 mb-4">How We Use Your Information</h2>
        <p>The information stored in your browser is used solely for the functioning of the application on your machine. Specifically:</p>
         <ul className="list-disc list-inside space-y-2 mt-4">
            <li>Your API keys are used to make direct calls from your browser to the respective AI provider&apos;s API endpoint.</li>
            <li>Your agent configurations are used to populate the dashboard and execute tasks as you direct.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-6 mb-4">Data Storage and Security</h2>
        <p>
            <strong>We do not store your API keys on our servers.</strong> All your data, including API keys and agent configurations, is stored exclusively in your browser&apos;s `localStorage`. This means the data never leaves your computer.
        </p>
        <p className="mt-4">
            However, this also means the security of your data depends on the security of your local environment.
        </p>
        
        <h2 className="text-2xl font-bold text-white mt-6 mb-4">Your Security Responsibilities</h2>
        <p>
            To ensure the safe usage of Naga Codex Agents and protect your API keys, you are responsible for maintaining a secure browser environment. We strongly recommend that you:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
            <li>Use up-to-date antivirus and anti-malware software on your computer.</li>
            <li>Be cautious with browser extensions. Only install extensions from trusted developers and review their permissions carefully, as some extensions can access browser storage.</li>
            <li>Avoid using this application on public or untrusted computers where others may have access.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-6 mb-4">Third-Party Services</h2>
        <p>
            When you run an agent, your browser makes a direct API call to the third-party provider you selected (e.g., Google, OpenAI). Your use of these third-party services is subject to their respective privacy policies and terms of service. We are not responsible for their data handling practices.
        </p>

        <h2 className="text-2xl font-bold text-white mt-6 mb-4">Changes to This Policy</h2>
        <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2 className="text-2xl font-bold text-white mt-6 mb-4">Contact Us</h2>
        <p>
            If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <div className="mt-4 p-4 bg-dark-bg rounded-lg">
            <p>Naga Apparel.</p>
            <p>Hamburg,</p>
            <p>Email: chosenfewrecords@hotmail.de</p>
        </div>
    </StaticPageLayout>
  );
};