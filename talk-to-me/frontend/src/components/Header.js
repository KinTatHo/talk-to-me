import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-blue-600 py-4">
    <div className="container mx-auto px-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">
        <Link to="/">Talk To Me</Link>
      </h1>
      <nav>
        <Link to="/" className="text-white mr-4">Home</Link>
        <Link to="/practice" className="text-white mr-4">Practice</Link>
        <Link to="/progress" className="text-white">Progress</Link>
      </nav>
    </div>
  </header>
);

export default Header;