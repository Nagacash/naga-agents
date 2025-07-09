
import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { AgentDashboard } from './components/AgentDashboard';
import { SettingsModal } from './components/SettingsModal';
import { GearIcon, LinkedInIcon } from './components/icons';
import { AIProvider } from './types';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { ContactPage } from './components/ContactPage';
import { LearnMorePage } from './components/LearnMorePage';
import { CookieBanner } from './components/CookieBanner';
import { ScrollToTopButton } from './components/ScrollToTopButton';

export type ApiKeys = Partial<Record<AIProvider, string>>;
export type Page = 'home' | 'privacy' | 'terms' | 'contact' | 'learn';

const Footer: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    return (
        <footer className="bg-dark-card mt-auto">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center space-x-2">
                     <img src="/images/logo.png" alt="Logo" className="h-8 w-8" />
                     <button onClick={() => onNavigate('home')} className="text-2xl font-bold text-white bg-transparent border-none cursor-pointer p-0">Naga Codex Agents</button>
                </div>
                <div className="mt-8 flex justify-center space-x-6">
                    <button onClick={() => onNavigate('privacy')} className="text-base text-dark-text-secondary hover:text-white bg-transparent border-none cursor-pointer">Privacy</button>
                    <button onClick={() => onNavigate('terms')} className="text-base text-dark-text-secondary hover:text-white bg-transparent border-none cursor-pointer">Terms</button>
                    <button onClick={() => onNavigate('contact')} className="text-base text-dark-text-secondary hover:text-white bg-transparent border-none cursor-pointer">Contact</button>
                    <a href="https://www.linkedin.com/in/maurice-holda/" target="_blank" rel="noopener noreferrer" className="text-base text-dark-text-secondary hover:text-white bg-transparent border-none cursor-pointer"><LinkedInIcon className="h-6 w-6" /></a>
                </div>
                <p className="mt-8 text-center text-base text-dark-text-secondary">
                    &copy; {new Date().getFullYear()} <a href="https://naga-apparel.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Naga Apparel Inc.</a> All rights reserved.
                </p>
            </div>
        </footer>
    );
};

const App: React.FC = () => {
    const dashboardRef = useRef<HTMLDivElement>(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [apiKeys, setApiKeys] = useState<ApiKeys>({});
    const [page, setPage] = useState<Page>('home');
    const [showCookieBanner, setShowCookieBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setShowCookieBanner(true);
        }

        const storedKeys: ApiKeys = {
            google: localStorage.getItem('google_api_key') || undefined,
            openai: localStorage.getItem('openai_api_key') || undefined,
            anthropic: localStorage.getItem('anthropic_api_key') || undefined,
            grok: localStorage.getItem('grok_api_key') || undefined,
            kling: localStorage.getItem('kling_api_key') || undefined,
        };
        const activeKeys = Object.fromEntries(Object.entries(storedKeys).filter(([, v]) => v));
        setApiKeys(activeKeys);
    }, []);

    const handleAcceptCookies = () => {
        localStorage.setItem('cookie_consent', 'true');
        setShowCookieBanner(false);
    };
    
    const handleSaveApiKeys = (newKeys: ApiKeys) => {
        const updatedKeys = { ...apiKeys, ...newKeys };
        setApiKeys(updatedKeys);
        for (const provider in updatedKeys) {
            const key = updatedKeys[provider as AIProvider];
            if (key) {
                localStorage.setItem(`${provider}_api_key`, key);
            } else {
                localStorage.removeItem(`${provider}_api_key`);
            }
        }
        setIsSettingsModalOpen(false);
    };

    const handleNavigate = (targetPage: Page) => {
        setPage(targetPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToDashboard = () => {
        dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const renderPageContent = () => {
        const navigateHome = () => handleNavigate('home');
        switch (page) {
            case 'privacy':
                return <PrivacyPolicy onGoBack={navigateHome} />;
            case 'terms':
                return <TermsOfService onGoBack={navigateHome} />;
            case 'contact':
                return <ContactPage onGoBack={navigateHome} />;
            case 'learn':
                return <LearnMorePage onGoBack={navigateHome} />;
            case 'home':
            default:
                return (
                    <>
                        <Hero 
                            onCreateAgentClick={scrollToDashboard}
                            onLearnMoreClick={() => handleNavigate('learn')}
                        />
                        <Features />
                        <div className="py-12 sm:py-20">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="text-center">
                                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                                        Your Agent Command Center
                                    </h2>
                                    <p className="mt-4 text-lg text-dark-text-secondary">
                                        Manage, monitor, and deploy your automated workforce from one place.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div ref={dashboardRef}>
                            <AgentDashboard apiKeys={apiKeys} onConfigureKey={() => setIsSettingsModalOpen(true)} />
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col">
            <Header onSettingsClick={() => setIsSettingsModalOpen(true)} onNavigate={() => handleNavigate('home')} />
            <main className="flex-grow">
                {renderPageContent()}
            </main>
            <Footer onNavigate={handleNavigate} />
            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                onSave={handleSaveApiKeys}
                currentApiKeys={apiKeys}
            />
            {showCookieBanner && <CookieBanner onAccept={handleAcceptCookies} onNavigate={handleNavigate} />}
            <ScrollToTopButton />
        </div>
    );
};

export default App;