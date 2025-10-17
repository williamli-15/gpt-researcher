import Image from "next/image";
import React, { FC, useRef, useState, useEffect } from "react";
import TypeAnimation from "../../TypeAnimation";

type TChatInputProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (query: string) => void;
  disabled?: boolean;
};

// Debounce function to limit the rate at which a function can fire
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout | undefined;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const ChatInput: FC<TChatInputProps> = ({
  promptValue,
  setPromptValue,
  handleSubmit,
  disabled,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const placeholder = "Any questions about this report?";

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '3em';
    }
  };

  const adjustHeight = debounce((target: HTMLTextAreaElement) => {
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  }, 100);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    adjustHeight(target);
    setPromptValue(target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        if (!disabled && promptValue.trim()) {
          handleSubmit(promptValue);
          setPromptValue('');
          resetHeight();
        }
      }
    }
  };

  return (
    <div className="relative">
      {/* Gradient ring with balanced glow */}
      <div 
        className={`absolute -inset-0.5 rounded-lg bg-gradient-to-r from-[#417dc0]/40 via-[#3467a5]/30 to-[#22456d]/40 blur-sm opacity-40 transition-opacity duration-300 ${isFocused || promptValue ? 'opacity-60' : 'opacity-30'}`}
      />
      
      {/* Ambient glow effect - balanced size and opacity */}
      <div 
        className="absolute -inset-3 rounded-xl opacity-25"
        style={{
          background: 'radial-gradient(circle at center, rgba(65, 125, 192, 0.12) 0%, rgba(52, 103, 165, 0.06) 40%, rgba(255, 255, 255, 0) 70%)',
        }}
      />
      
      <form
        className="mx-auto flex pt-2 pb-2 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 shadow-lg relative overflow-hidden z-10"
        onSubmit={(e) => {
          e.preventDefault();
          if (!disabled && promptValue.trim()) {
            handleSubmit(promptValue);
            setPromptValue('');
            resetHeight();
          }
        }}
      >
        {/* Inner gradient blur effect - balanced opacity */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-400/10 via-primary-500/10 to-primary-700/10 blur-xl opacity-20 animate-pulse pointer-events-none"></div>
        
        <textarea
          placeholder={placeholder}
          ref={textareaRef}
          className="focus-visible::outline-0 my-1 w-full pl-5 font-light not-italic leading-[normal] 
          text-gray-900 placeholder-gray-500 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 
          sm:text-base min-h-[4em] resize-none relative z-10 bg-transparent"
          disabled={disabled}
          value={promptValue}
          required
          rows={3}
          onKeyDown={handleKeyDown}
          onChange={handleTextareaChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        <button
          disabled={disabled || !promptValue.trim()}
          type="submit"
          className="relative flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-md bg-primary-600 hover:bg-gradient-to-br hover:from-[#417dc0] hover:via-[#3467a5] hover:to-[#22456d] transition-all duration-300 disabled:opacity-50 disabled:hover:bg-primary-600/75 z-10 before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:from-primary-300/15 before:to-primary-500/15 before:opacity-0 before:transition-opacity before:hover:opacity-100 before:-z-10 disabled:before:opacity-0 group"
        >
          {disabled && (
            <div className="absolute inset-0 flex items-center justify-center">
              <TypeAnimation />
            </div>
          )}

          <div className="relative p-2 cursor-pointer overflow-hidden">
            {/* Glow effect on hover - balanced brightness */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-80 transition-opacity duration-300 bg-white/15 rounded-full blur-sm"></div>
            
            <img
              src={"/img/arrow-narrow-right.svg"}
              alt="send"
              width={20}
              height={20}
              className={`${disabled ? "invisible" : ""} transition-all duration-300 group-hover:scale-110 group-hover:brightness-110 group-hover:filter group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.6)]`}
            />
          </div>
        </button>
      </form>
      
      {/* Animated glow effect at the bottom - balanced brightness */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[2.5px] opacity-35 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(65, 125, 192, 0.4) 0%, rgba(52, 103, 165, 0.25) 25%, rgba(34, 69, 109, 0.08) 50%, rgba(255, 255, 255, 0) 75%)',
          boxShadow: '0 0 8px 1px rgba(65, 125, 192, 0.25), 0 0 15px 2px rgba(34, 69, 109, 0.12)'
        }}
      />
    </div>
  );
};

export default ChatInput; 
