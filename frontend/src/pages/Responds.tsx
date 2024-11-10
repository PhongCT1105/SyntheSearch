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
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Research Papers</CardTitle>
        </CardHeader>
        <CardContent>
          <ResearchDataTable data={papers} />
        </CardContent>
      </Card>
    </div>
  );
}