import { useEffect, useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { ArrowUp } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate()

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

  const handleSubmit = async () => {
    if (message.trim()) {
      try {
        // make a POST request to the FastAPI backend
        const res = await axios.post('http://127.0.0.1:8000/message', {
          message: message.trim(),
        });
        
        setResponse(res.data); // This updates the state asynchronously
        console.log(response);
        setMessage('');
      } catch (error) {
        console.error("Error sending message to the backend:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-dark text-white">
      <div
        className={`w-full max-w-xl px-4 ${isVisible ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'
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
            className="min-h-[52px] max-h-[200px] rounded-3xl pr-14 resize-none overflow-y-auto py-3.5 leading-7"
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
            className="absolute right-3 bottom-3 h-7 w-7 bg-white rounded-full p-0 hover:bg-slate-700"
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
