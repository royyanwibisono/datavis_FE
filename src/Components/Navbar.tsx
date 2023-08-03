// Navbar.tsx
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  children: ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  return (
    <div>
      <nav className="navbar">
        <ul>
          <Link to="/">Home</Link>
        </ul>
        <ul>
          <Link to="/data?res=us&ts=2023-07-22T05:18:42Z&te=2023-07-22T05:18:43Z&cols=uba_radial&skipr=50">Data</Link>
        </ul>
      </nav>
      <div>
        {children}
      </div>
    </div>
    
  );
};

export default Navbar;
