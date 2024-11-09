import React, { useEffect, useState } from 'react';

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
        className={`w-full text-center ${
          isVisible ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'
        }`}
      >
        <h1 className="text-5xl font-bold mb-4">researchAI</h1>
        <p className="text-xl">Your AI Paper Research</p>
      </div>
    </div>
  );
};

export default Home;