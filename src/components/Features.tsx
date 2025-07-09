
import React from 'react';
import { motion } from 'framer-motion';
import { ZapIcon, FileEditIcon } from './icons';

const features = [
  {
    name: 'Prompt-Based Control',
    description: 'Define agent tasks and behaviors using natural language. It\'s as simple as telling your agent what to do.',
    icon: FileEditIcon,
  },
  {
    name: 'Rapid Deployment',
    description: 'Go from creation to execution in seconds. Deploy your agents locally and get started instantly.',
    icon: ZapIcon,
  },
  {
    name: 'Scalable Management',
    description: 'Oversee your entire workforce of AI agents from a single, intuitive dashboard. Run, pause, and edit on the fly.',
  },
];

export const Features: React.FC = () => {
  const featureCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-brand-primary font-semibold tracking-wide uppercase">Features</h2>
          <motion.p
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A Better Way to Automate Work
          </motion.p>
          <motion.p
            className="mt-4 max-w-2xl text-xl text-dark-text-secondary lg:mx-auto"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Naga Codex Agents provides the tools you need to build a powerful, automated team that works for you 24/7.
          </motion.p>
        </div>

        <div className="mt-12">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="feature-card relative bg-dark-card p-6 rounded-xl border border-dark-border shadow-lg transform hover:-translate-y-1 transition-transform duration-300"
                variants={featureCardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-black">
                    <img src="/images/logo.png" alt="Logo" className="h-8 w-8" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-white">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-dark-text-secondary">
                  {feature.description}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};