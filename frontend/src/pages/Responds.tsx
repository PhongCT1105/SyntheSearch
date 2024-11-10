import { useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {ResearchDataTable} from "./Table";

export default function Responds() {
  const location = useLocation();
  const [isContentVisible, setIsContentVisible] = useState(false);

  if (!location.state?.responseDate) {
    return <Navigate to="/" replace />;
  }

  const papers = location.state.responseDate.results || [];

  useEffect(() => {
    setIsContentVisible(true);
  }, []);

  return (
    <div className="container mx-auto py-6 min-h-screen flex flex-col justify-center">
      <div
        className={`text-3xl font-bold mb-4 transition-opacity duration-700 ${
          isContentVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        Research Paper
      </div>

      <div
        className={`transition-opacity duration-700 ${
          isContentVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <ResearchDataTable data={papers} />
      </div>
    </div>
  );
}
