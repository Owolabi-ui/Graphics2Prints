import React from 'react';
import Sidebar from './Sidebar';
import { useTheme } from './ThemeProvider';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';


export const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-primary text-primary-foreground shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Rewrap App</h1>
          
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-primary-foreground/10">
            theme === 'dark' ? <FontAwesomeIcon icon={faSun} size='lg' /> : <FontAwesomeIcon icon={faMoon} size='lg' />
          </button>
          
        </div>
      </header>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};