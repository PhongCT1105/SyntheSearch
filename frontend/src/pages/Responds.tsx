import React from 'react';
import { useLocation } from 'react-router-dom';
import Table from './Table';

const Responds = () => {
  const { state } = useLocation();
  const initialMessage = state?.message || ''; 

  return (
    <div className="flex justify-center items-center min-h-screen bg-dark text-white">
      <div className="w-5/6 max-w-4xl">
        <div className="text-right mb-4 ml-4">
          <p className="bg-slate-700 text-white p-3 rounded-lg inline-block max-w-xs leading-6">{initialMessage}</p>
        </div>
        <div className="mt-10">
          <Table /> 
        </div>
      </div>
    </div>
  );
};

export default Responds;
