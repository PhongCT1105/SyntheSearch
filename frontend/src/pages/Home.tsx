import React, { useEffect, useState } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

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
        
        <div className="grid w-full gap-2">
          <Textarea placeholder="Type your message here." className="min-h-[100px]" />
          <Button>Send message</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;