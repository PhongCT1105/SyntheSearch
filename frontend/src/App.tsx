import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"; 
import NavBar from './components/Navbar';

import Home from './pages/Home';
import About from './pages/About';
import FeedBack from './pages/Feedback';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/feedback" element={<FeedBack />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
