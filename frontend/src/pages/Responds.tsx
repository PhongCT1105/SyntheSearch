import { useLocation, Navigate } from 'react-router-dom';
import { ResearchDataTable } from './Table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Responds() {
  const location = useLocation();
  
  if (!location.state?.responseDate) {
    return <Navigate to="/" replace />;
  }

  const papers = location.state.responseDate.results || [];

  return (
    <div className="container mx-auto py-6 min-h-screen flex flex-col justify-center">
      <div className='font-bold mb-3'>
        Research Paper
      </div>
      <ResearchDataTable data={papers} />
    </div>
  );
}