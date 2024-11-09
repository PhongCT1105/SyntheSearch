import { useEffect, useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CardWithForm } from '@/components/Card';
import axios from 'axios';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

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
      textarea.style.height = '20px'; // Reset height to get correct scrollHeight
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim()) {
      console.log(message);
      navigate('/responds', { state: { message } });
      setMessage('');
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-dark text-white">
      <div
        className={`w-full max-w-xl px-4 ${
          isVisible ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'
        }`}
      >
        <div className="text-center mb-10">
          <h1 className="text-7xl font-bold mb-4">researchAI</h1>
          <p className="text-xl">Your AI Paper Research</p>
        </div>
        
        <div className='flex justify-center w-full'>
          <CardWithForm />
        </div>
      </div>
    </div>
  );
};

export default Home;
