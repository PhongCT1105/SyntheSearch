import { useEffect, useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, AlertCircle } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import CardWithForm from '@/components/Card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from '@/components/ui/progress';
import axios from 'axios';

const Home = () => {
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState([]);
  const [isTextAreaVisible, setIsTextAreaVisible] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  const [keywordProgress, setKeywordProgress] = useState(0);
  const [searchProgress, setSearchProgress] = useState(0);
  const [isKeywordLoading, setIsKeywordLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '20px';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  const handleNext = async (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setIsKeywordLoading(true);
      setKeywordProgress(0);

      const interval = setInterval(() => {
        setKeywordProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 300);

      try {
        await axios.put('http://127.0.0.1:8000/put-category', { enteredKeyword: keyword.trim() });
        setKeywordProgress(100);
        setIsCardVisible(false);

        setTimeout(() => {
          setIsTextAreaVisible(true); // Make the textarea visible
        }, 300); // Delay to allow card transition
        setKeyword('');
      } catch (error) {
        console.error("Error sending category to the backend:", error);
        setIsAlertVisible(true);
      } 
    } else {
      setIsAlertVisible(true);
    }
  };

  const handleSubmit = async () => {
    if (message.trim()) {
      setIsKeywordLoading(true);
      setKeywordProgress(0);

      const interval = setInterval(() => {
        setKeywordProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 300);
      try {
        const res = await axios.post('http://127.0.0.1:8000/message', {
          message: message.trim(),
        });
        setKeywordProgress(100);
        const newResponse = res.data;
        setResponse(newResponse);
        setSearchProgress(100);

        setTimeout(() => {
          setMessage('');
          navigate('/responds', { state: { responseDate: newResponse } });
        }, 500);
      } catch (error) {
        console.error("Error sending message to the backend:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center bg-dark text-white overflow-hidden">
      {/* Fixed Logo Section */}
      <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-xl px-4 transition-all duration-700 ${isTextAreaVisible ? '' : ''}`}>
        <div className={`transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-center">
            <h1 className="text-7xl font-bold mb-4">SyntheSearch</h1>
            <p className="text-xl">Your AI Paper Research</p>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="mt-64 w-full max-w-xl px-4">
        {/* Card Section */}
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          {isCardVisible && (
            <div className="flex flex-col items-center w-full gap-4">
              <CardWithForm keyword={keyword} onNext={handleNext} setKeyword={setKeyword} />
              {isKeywordLoading && (
                <div className="w-full max-w-md">
                  <p className="text-sm text-center mt-2">Processing your keyword...</p>
                  <Progress value={keywordProgress} className="w-full my-4" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Textarea Section */}
        <div className={`transition-all duration-700 absolute left-0 right-0 px-4 flex flex-col ${isTextAreaVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {isTextAreaVisible && (
            <>
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold">Describe more about the topic</h3>
              </div>
              <div className="relative flex justify-center">
                <div className="w-[700px] max-w-100 relative">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Type your message here"
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
            </>
          )}
        </div>
      </div>

      {/* Alert Overlay */}
      {isAlertVisible && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
          onClick={() => setIsAlertVisible(false)}
        >
          <div className="p-6 rounded-lg text-black max-w-sm w-full">
            <Alert variant="destructive">
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Please enter a keyword to proceed.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
