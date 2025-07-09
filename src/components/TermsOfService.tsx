
import React from 'react';
import { StaticPageLayout } from './StaticPageLayout';

interface TermsOfServiceProps {
    onGoBack: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onGoBack }) => {
  return (
    <StaticPageLayout title="Terms of Service" onGoBack={onGoBack}>
      <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="text-2xl font-bold text-white mt-6 mb-4">1. Agreement to Terms</h2>
      <p>
        By accessing or using Naga Codex Agents (the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of the terms, you may not access the Service.
      </p>

      <h2 className="text-2xl font-bold text-white mt-6 mb-4">2. Description of Service</h2>
      <p>
        Naga Codex Agents is a client-side web application that allows users to create, manage, and run AI agents. The Service facilitates interactions with third-party AI providers by using API keys provided by the user. All data, including API keys and agent configurations, is stored locally in the user&apos;s browser.
      </p>

      <h2 className="text-2xl font-bold text-white mt-6 mb-4">3. User Responsibilities</h2>
       <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong>API Keys:</strong> You are solely responsible for obtaining and managing your own API keys from third-party providers (e.g., Google, OpenAI). You are also responsible for all costs and usage fees associated with your API keys.</li>
            <li><strong>Security:</strong> You acknowledge that your API keys are stored only in your browser&apos;s local storage and not on our servers. You are therefore responsible for the security of your own computer and browser. We strongly recommend using security tools such as antivirus software and being cautious with browser extensions to ensure safe usage. Do not use the Service on untrusted or public computers.</li>
            <li><strong>Compliance:</strong> You agree not to use the Service for any illegal or unauthorized purpose. You are responsible for your conduct and any content or prompts you submit.</li>
        </ul>

      <h2 className="text-2xl font-bold text-white mt-6 mb-4">4. Disclaimer of Warranty</h2>
      <p>
        The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. Naga Apparel Inc. makes no warranty that the Service will meet your requirements or be available on an uninterrupted, secure, or error-free basis.
      </p>

      <h2 className="text-2xl font-bold text-white mt-6 mb-4">5. Limitation of Liability</h2>
      <p>
        In no event shall Naga Apparel Inc., nor its directors, employees, partners, or agents, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; and (iii) any costs incurred from usage of your API keys with third-party providers.
      </p>

      <h2 className="text-2xl font-bold text-white mt-6 mb-4">6. Governing Law</h2>
      <p>
        These Terms shall be governed and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
      </p>

      <h2 className="text-2xl font-bold text-white mt-6 mb-4">Contact Information</h2>
      <p>
        For any questions about these Terms, please contact us:
      </p>
      <div className="mt-4 p-4 bg-dark-bg rounded-lg">
            <p>Naga Apparel.</p>
            <p>Hamburg,</p>
            <p>Email: chosenfewrecords@hotmail.de</p>
        </div>
    </StaticPageLayout>
  );
};