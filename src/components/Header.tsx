
import React from 'react';
import { motion } from 'framer-motion';
import { GearIcon } from './icons';

interface HeaderProps {
    onSettingsClick: () => void;
    onNavigate: () => void;
}

const textPulseVariants = {
  initial: { color: '#F3F4F6' }, // dark-text
  animate: { color: '#FF8C00' }  // Orange
};

export const Header: React.FC<HeaderProps> = ({ onSettingsClick, onNavigate }) => {
    return (
        <header className="bg-dark-bg/80 backdrop-blur-sm sticky top-0 z-40">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 border-b border-dark-border">
                    <div className="flex items-center">
                        <button onClick={onNavigate} className="flex-shrink-0 flex items-center space-x-2 bg-transparent border-none cursor-pointer p-0">
                            {/* <img src="/images/logo.png" alt="Logo" className="h-8 w-8" /> */}
                            <motion.span
                                className="text-2xl font-bold text-white"
                                variants={textPulseVariants}
                                initial="initial"
                                animate="animate"
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "easeInOut"
                                }}
                            >
                                Naga Codex
                            </motion.span>
                        </button>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={onSettingsClick}
                            className="p-2 text-dark-text-secondary hover:text-white hover:bg-gray-700 rounded-full transition-colors duration-200"
                            aria-label="API Integrations"
                        >
                            <GearIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};