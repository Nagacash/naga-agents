import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from './icons';

export const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 p-3 rounded-full bg-brand-primary text-white shadow-lg hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-primary transition-all duration-300 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            aria-label="Scroll to top"
        >
            <ArrowUpIcon className="h-6 w-6" />
        </button>
    );
};
