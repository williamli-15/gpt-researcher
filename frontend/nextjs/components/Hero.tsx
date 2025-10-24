import React, { FC, useEffect, useState, useRef } from "react";
import InputArea from "./ResearchBlocks/elements/InputArea";
import { motion, AnimatePresence } from "framer-motion";
import { AGENT_PROFILES } from "@/data/agentProfiles";

type THeroProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleDisplayResult: (query : string) => void;
  selectedAgentProfile: string;
  onSelectAgentProfile: (profileId: string) => void;
};

const Hero: FC<THeroProps> = ({
  promptValue,
  setPromptValue,
  handleDisplayResult,
  selectedAgentProfile,
  onSelectAgentProfile,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showGradient, setShowGradient] = useState(true);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setIsVisible(true);
    
    // Create particles for the background effect
    if (particlesContainerRef.current) {
      const container = particlesContainerRef.current;
      const particleCount = window.innerWidth < 768 ? 15 : 30; // Reduce particles on mobile
      
      // Clear any existing particles
      container.innerHTML = '';
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        
        // Random particle attributes
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 50 + 20;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.3 + 0.1;
        
        // Apply styles
        particle.className = 'absolute rounded-full bg-white';
        Object.assign(particle.style, {
          width: `${size}px`,
          height: `${size}px`,
          left: `${posX}%`,
          top: `${posY}%`,
          opacity: opacity.toString(),
          animation: `float ${duration}s ease-in-out ${delay}s infinite`,
        });
        
        container.appendChild(particle);
      }
    }
    
    // Add scroll event listener to show/hide gradient
    let lastScrollY = window.scrollY;
    const threshold = 50; // Amount of scroll before hiding gradient (reduced for quicker response)
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY <= threshold) {
        // At or near the top, show gradient
        setShowGradient(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down, hide gradient
        setShowGradient(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up, show gradient
        setShowGradient(true);
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    const container = particlesContainerRef.current;
    // Clean up function
    return () => {
      if (container) {
        container.innerHTML = '';
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClickSuggestion = (value: string) => {
    setPromptValue(value);
  };

  const handleSelectUseCase = (profileId: string) => {
    onSelectAgentProfile(profileId);
  };

  // Animation variants for consistent animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative overflow-visible min-h-[100vh] flex items-center pt-[60px] sm:pt-[80px] mt-[-60px] sm:mt-[-130px]">
      {/* Particle background */}
      <div ref={particlesContainerRef} className="absolute inset-0 -z-20"></div>
      
      <motion.div 
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeInUp}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center w-full py-6 sm:py-8 md:py-16 lg:pt-10 lg:pb-20"
      >
        {/* Header text */}
        <motion.h1 
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-medium text-center text-gray-900 mb-8 sm:mb-10 md:mb-12 px-4"
        >
          What would you like to research next?
        </motion.h1>

        {/* Input section with enhanced styling */}
        <motion.div 
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-[800px] pb-6 sm:pb-8 md:pb-10 px-4"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 via-primary-500/20 to-primary-700/30 rounded-xl blur-md opacity-60 group-hover:opacity-85 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
            <div className="relative bg-white backdrop-blur-sm rounded-xl ring-1 ring-gray-200">
              <InputArea
                promptValue={promptValue}
                setPromptValue={setPromptValue}
                handleSubmit={handleDisplayResult}
              />
            </div>
          </div>
          
          {/* Disclaimer text */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-center px-4"
          >
            <p className="text-gray-600 text-sm font-light">
              AI may make mistakes. Verify important information and check sources.
            </p>
          </motion.div>
        </motion.div>

        {/* Use-case selector grid */}
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="w-full max-w-[1000px] px-4 mt-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {AGENT_PROFILES.map((profile) => {
              const isActive = selectedAgentProfile === profile.id;
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => handleSelectUseCase(profile.id)}
                  className={`text-left rounded-xl border transition-all duration-300 shadow-sm hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                    isActive
                      ? "border-primary-500 bg-primary-50/70"
                      : "border-gray-200 bg-white hover:border-primary-400/70"
                  }`}
                >
                  <div className="p-4 md:p-5 h-full flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                        {profile.category}
                      </span>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 bg-white/70 px-2 py-1 rounded-full shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.342a1 1 0 0 1-1.436.004l-3.428-3.4a1 1 0 1 1 1.406-1.422l2.706 2.684 6.543-6.621a1 1 0 0 1 1.453-.001z" clipRule="evenodd" />
                          </svg>
                          Selected
                        </span>
                      )}
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">
                      {profile.agentName}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <span className="font-semibold text-gray-700">Main focus:</span> {profile.mainFocus}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <span className="font-semibold text-gray-700">Who it helps:</span> {profile.audience}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <span className="font-semibold text-gray-700">What it covers:</span> {profile.coverage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Suggestions section with enhanced styling */}
        <motion.div 
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 xs:gap-3 md:gap-4 pb-6 sm:pb-8 md:pb-10 px-4 lg:flex-nowrap lg:justify-normal"
        >
          <AnimatePresence>
            {suggestions.map((item, index) => (
              <motion.div
                key={item.id}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                className="flex h-[38px] sm:h-[42px] cursor-pointer items-center justify-center gap-[6px] rounded-lg 
                         border border-solid border-primary-500/30 bg-primary-50 
                         backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 hover:border-primary-500/60 
                         hover:bg-primary-100 transition-all duration-300 hover:shadow-lg hover:shadow-[rgba(65,125,192,0.15)] min-w-[100px]"
                onClick={() => handleClickSuggestion(item?.name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  width={18}
                  height={18}
                  className="w-[18px] sm:w-[20px] opacity-80"
                />
                <span className="text-xs sm:text-sm font-medium leading-[normal] text-gray-800">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Magical premium gradient glow at the bottom */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: showGradient ? 1 : 0 }}
        transition={{ duration: 1.2 }}
        className="fixed bottom-0 left-0 right-0 h-[12px] z-50 overflow-hidden pointer-events-none"
      >
        <div className="relative w-full h-full">
          {/* Main perfect center glow with smooth fade at edges */}
          <div 
            className="absolute inset-0"
            style={{
              opacity: 0.85,
              background: 'radial-gradient(ellipse at center, rgba(65, 125, 192, 1) 0%, rgba(52, 103, 165, 0.7) 25%, rgba(34, 69, 109, 0.2) 50%, rgba(255, 255, 255, 0) 75%)',
              boxShadow: '0 0 30px 6px rgba(65, 125, 192, 0.45), 0 0 60px 10px rgba(52, 103, 165, 0.2)'
            }}
          />
          
          {/* Subtle shimmer overlay with perfect center focus */}
          <div 
            className="absolute inset-0"
            style={{
              animation: 'shimmer 8s ease-in-out infinite alternate',
              opacity: 0.5,
              background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 30%, rgba(255, 255, 255, 0) 60%)'
            }}
          />
          
          {/* Gentle breathing effect */}
          <div 
            className="absolute inset-0"
            style={{
              opacity: 0.4,
              animation: 'breathe 7s cubic-bezier(0.4, 0.0, 0.2, 1) infinite',
              background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 50%)'
            }}
          />
        </div>
      </motion.div>
      
      {/* Custom keyframes for magical animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            opacity: 0.4;
            transform: scale(0.98);
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0.4;
            transform: scale(1.02);
          }
        }
        
        @keyframes breathe {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.96);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.04);
          }
        }
      `}</style>
    </div>
  );
};

type suggestionType = {
  id: number;
  name: string;
  icon: string;
};

const suggestions: suggestionType[] = [
  // {
  //   id: 1,
  //   name: "Stock analysis on ",
  //   icon: "/img/stock2.svg",
  // },
  // {
  //   id: 2,
  //   name: "Help me plan an adventure to ",
  //   icon: "/img/hiker.svg",
  // },
  // {
  //   id: 3,
  //   name: "What are the latest news on ",
  //   icon: "/img/news.svg",
  // },
];

export default Hero;
