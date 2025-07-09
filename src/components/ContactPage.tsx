
import React from 'react';
import { StaticPageLayout } from './StaticPageLayout';

interface ContactPageProps {
    onGoBack: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onGoBack }) => {
  return (
    <StaticPageLayout title="Contact Us" onGoBack={onGoBack}>
      <p>
        Have questions, feedback, or need support? We&apos;d love to hear from you. Please reach out to us through the following channels.
      </p>

      <h2 className="text-2xl font-bold text-white mt-6 mb-4">General Inquiries & Support</h2>
      <p>
        For all general questions and support requests, the best way to contact us is via email.
      </p>
      <div className="mt-4 p-4 bg-dark-bg rounded-lg">
          <p className="font-semibold text-white">Email</p>
          <a href="mailto:chosenfewrecords@hotmail.de" className="text-brand-secondary hover:underline">chosenfewrecords@hotmail.de</a>
      </div>

      <h2 className="text-2xl font-bold text-white mt-6 mb-4">Mailing Address</h2>
      <p>
        You can also reach us by mail at our corporate headquarters.
      </p>
      <div className="mt-4 p-4 bg-dark-bg rounded-lg">
        <p className="font-semibold text-white">Naga Apparel.</p>
        <p>Hamburg,</p>
      </div>

       <p className="mt-8">
        We strive to respond to all inquiries within 48 business hours. Thank you for using Naga Codex Agents!
      </p>
    </StaticPageLayout>
  );
};