import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from './components/Navbar';

import Home from './pages/Home';
import About from './pages/About';
import FeedBack from './pages/Feedback';
import Responds from './pages/Responds';
import Table from './pages/Table';

function AppContent() {
  const location = useLocation();
  
  // Check if the current route is '/responds'
  const hideNavBar = location.pathname === '/responds';

  return (
    <div>
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<FeedBack />} />
        <Route path="/responds" element={<Responds />} />
        <Route path="/table" element={<Table />} />
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
