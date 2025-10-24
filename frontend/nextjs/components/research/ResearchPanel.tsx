import React, { useState } from 'react';
import { ResearchResults } from '@/components/ResearchResults';
import { Data, ChatBoxSettings } from '@/types/data';
import LoadingDots from '@/components/LoadingDots';
import Image from 'next/image';

interface ResearchPanelProps {
  orderedData: Data[];
  answer: string;
  allLogs: any[];
  chatBoxSettings: ChatBoxSettings;
  handleClickSuggestion: (value: string) => void;
  currentResearchId?: string;
  onShareClick?: () => void;
  isCopilotVisible?: boolean;
  setIsCopilotVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  onNewResearch?: () => void;
  loading?: boolean;
  toggleSidebar?: () => void;
}

const ResearchPanel: React.FC<ResearchPanelProps> = ({
  orderedData,
  answer,
  allLogs,
  chatBoxSettings,
  handleClickSuggestion,
  currentResearchId,
  onShareClick,
  isCopilotVisible,
  setIsCopilotVisible,
  onNewResearch,
  loading,
  toggleSidebar
}) => {
  // Determine if research is complete (has answer) and copilot should be highlighted
  const researchComplete = Boolean(answer && answer.length > 0);
  const [isNotificationDismissed, setIsNotificationDismissed] = useState(false);
  
  return (
    <>
      {/* Panel Header */}
      <div className="flex justify-between items-center px-3 py-3 border-b border-gray-200 bg-white">
        {/* Left side - Empty div to maintain flex layout */}
        <div className="flex items-center">
        </div>
        
        {/* Right side - Action buttons */}
        <div className="flex items-center gap-2">
          {/* New Research button */}
          {onNewResearch && (
            <button 
              onClick={onNewResearch}
              className="relative overflow-hidden px-3 py-1.5 rounded-md text-white text-sm font-semibold flex items-center gap-1.5 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 shadow-[0_6px_16px_rgba(65,125,192,0.25)] hover:shadow-[0_8px_18px_rgba(65,125,192,0.3)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 focus-visible:ring-offset-1 focus-visible:ring-offset-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Research
            </button>
          )}
          
          {/* Share button */}
          {onShareClick && currentResearchId && (
            <button 
              onClick={onShareClick}
              className="relative overflow-hidden px-3 py-1.5 rounded-md text-white text-sm font-semibold flex items-center gap-1.5 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 shadow-[0_6px_18px_rgba(34,69,109,0.35)] hover:shadow-[0_10px_22px_rgba(34,69,109,0.4)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/60 focus-visible:ring-offset-1 focus-visible:ring-offset-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              Share
            </button>
          )}
          
          {/* Show Copilot button - only visible when copilot is hidden */}
          {!isCopilotVisible && setIsCopilotVisible && (
            <button 
              onClick={() => setIsCopilotVisible(true)}
              className={`px-3 py-1.5 rounded-md text-white text-sm font-semibold flex items-center gap-1.5 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 shadow-[0_6px_16px_rgba(65,125,192,0.25)] hover:shadow-[0_8px_18px_rgba(65,125,192,0.3)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 focus-visible:ring-offset-1 focus-visible:ring-offset-white ${researchComplete ? 'animate-chat-button-pulse' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Chat
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar bg-white">
        {/* Filter out chat messages so they only show in the chat panel */}
        <div className="space-y-4 relative">          
          <ResearchResults
            orderedData={orderedData.filter(data => {
              // Keep everything except chat responses
              if (data.type === 'chat') return false;
              
              // For questions, only keep the first/initial question
              if (data.type === 'question') {
                return orderedData.indexOf(data) === 0;
              }
              
              // Keep all other types
              return true;
            })}
            answer={answer}
            allLogs={allLogs}
            chatBoxSettings={chatBoxSettings}
            handleClickSuggestion={handleClickSuggestion}
            currentResearchId={currentResearchId}
          />
          
          {/* Loading indicator - show during research */}
          {loading && (
            <div className="flex justify-center mt-6">
              <div className="flex flex-col items-center">
                <LoadingDots />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        @keyframes chat-button-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(65, 125, 192, 0.35);
            transform: scale(1);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(65, 125, 192, 0);
            transform: scale(1.02);
          }
        }
        
        .animate-chat-button-pulse {
          animation: chat-button-pulse 2s infinite cubic-bezier(0.66, 0, 0, 1);
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e5e7eb;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(65, 125, 192, 0.4);
          border-radius: 20px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(43, 85, 135, 0.6);
        }
      `}</style>
    </>
  );
};

export default ResearchPanel; 
