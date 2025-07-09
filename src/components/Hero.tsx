
import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  onCreateAgentClick: () => void;
  onLearnMoreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCreateAgentClick, onLearnMoreClick }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const charVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="relative pt-20 pb-24 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[50%] top-0 h-[32rem] w-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#2563EB] opacity-20 blur-3xl"></div>
      </div>
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          {"Build & Deploy AI Agents in Seconds".split("").map((char, index) => (
            <motion.span key={index} variants={charVariants}>
              {char}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p variants={itemVariants} className="mt-6 text-lg leading-8 text-dark-text-secondary max-w-2xl mx-auto">
          Automate your workflows, boost productivity, and let intelligent agents handle the repetitive tasks. Your automated workforce is just a prompt away.
        </motion.p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <motion.button
            variants={itemVariants}
            onClick={onCreateAgentClick}
            className="rounded-md bg-brand-primary px-4 py-3 text-base font-semibold text-white shadow-lg hover:bg-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary transition-colors duration-300"
          >
            Create Your First Agent
          </motion.button>
          <motion.button variants={itemVariants} onClick={onLearnMoreClick} className="text-base font-semibold leading-6 text-white group bg-transparent border-none cursor-pointer">
            Learn more <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};