import React from 'react';
import { HomeIcon, WritingHandIcon } from './icons';

interface HeaderProps {
    onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="bg-amber-200 dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <WritingHandIcon />
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                <span className="text-blue-600">Secretariaat</span> AI Assistent
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Genereer professionele teksten in seconden</p>
                <p className="font-playfair italic text-gray-600 dark:text-gray-400 mt-2 text-sm">Gemaakt door P. Salem</p>
            </div>
        </div>
        <button
            onClick={onReset}
            className="flex items-center gap-2 bg-amber-300 dark:bg-gray-700 hover:bg-amber-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
            <HomeIcon />
            <span>Home</span>
        </button>
      </div>
    </header>
  );
};

export default Header;