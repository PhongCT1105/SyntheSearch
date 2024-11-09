import React, { useEffect, useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { ArrowUp } from "lucide-react";
import { Button } from '@/components/ui/button';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '20px';  // Reset height to get correct scrollHeight
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim()) {
      // Handle message submission here
      console.log(message);
      setMessage('');
    }
  };

  return (
    <div className="w-full h-[80vh] bg-dark text-white flex items-center justify-center">
      <div
        className={`w-full max-w-2xl px-4 ${
          isVisible ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'
        }`}
      >
        <div className="text-center mb-8">
          <h1 className="text-7xl font-bold mb-4">researchAI</h1>
          <p className="text-xl">Your AI Paper Research</p>
        </div>
        
        <div className="relative flex flex-col w-full">
          <Textarea 
            ref={textareaRef}
            placeholder="Type your message here." 
            className="min-h-[20px] max-h-[200px] rounded-3xl pr-14 resize-none overflow-y-auto"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            rows={1}
          />
          <Button 
            className="absolute right-2 bottom-1 h-7 w-7 bg-white rounded-full p-0 hover:bg-slate-700"
            variant="ghost"
            onClick={handleSubmit}
          >
            <ArrowUp className="h-4 w-4 text-black" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;