import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from './components/Navbar';

import Home from './pages/Home';
import About from './pages/About';
import FeedBack from './pages/Feedback';
import Responds from './pages/Responds';
import { ResearchDataTable } from './pages/Table';
// import ModalDetail from './pages/ModalDetail';

function AppContent() {
  const location = useLocation();

  // List of routes where NavBar should be hidden
  const hideNavBarRoutes = [''];
  const hideNavBar = hideNavBarRoutes.includes(location.pathname);

  return (
    <div>
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<FeedBack />} />
        <Route path="/responds" element={<Responds />} />
        <Route path="/table" element={<ResearchDataTable />} />
        {/* <Route path="/modal" element={<ModalDetail />} /> */}
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
