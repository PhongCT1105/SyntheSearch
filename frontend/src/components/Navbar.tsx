import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <nav className="bg-gray-900 fixed top-0 left-0 w-full shadow-md z-10">
        <div className="container mx-auto flex justify-between items-center p-4">
          {/* Website Name */}
          <Link className="text-xl font-bold text-white hover:text-white" to="/" onClick={scrollToTop}>
            <span className="text-white">research</span><b className="text-white">AI</b>
          </Link>

          {/* Mobile Toggle Button */}
          <button
            type="button"
            className="block lg:hidden text-white hover:text-gray-400 focus:outline-none"
            onClick={toggleMenu}
          >
            <span className="block w-6 h-0.5 bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </button>

          {/* Desktop Links */}
          <div className="hidden lg:flex space-x-8">
            <Link className="text-white hover:text-red-600 transition-colors duration-200" to="/" onClick={scrollToTop}>Home</Link>
            <Link className="text-white hover:text-red-600 transition-colors duration-200" to="/about" onClick={scrollToTop}>About Us</Link>
            <Link className="text-white hover:text-red-600 transition-colors duration-200" to="/feedback" onClick={scrollToTop}>Feedback</Link>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="bg-gray-900 shadow-md fixed w-full top-14 rounded-md z-10 flex flex-col items-start lg:hidden">
          <Link className="block w-full text-left py-2 text-white hover:text-red-600 transition-colors duration-200 px-4" to="/" onClick={scrollToTop}>Home</Link>
          <Link className="block w-full text-left py-2 text-white hover:text-red-600 transition-colors duration-200 px-4" to="/about" onClick={scrollToTop}>About Us</Link>
          <Link className="block w-full text-left py-2 text-white hover:text-red-600 transition-colors duration-200 px-4" to="/feedback" onClick={scrollToTop}>Feedback</Link>
        </div>
      )}
    </>
  );
};

export default NavBar;
