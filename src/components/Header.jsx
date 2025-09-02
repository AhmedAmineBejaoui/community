import React from "react";

export default function Header() {
  return (
    <header className="navbar">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <a href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-brand-500">Neihgboor</a>
        <nav>
          <ul className="flex gap-6 text-gray-800 dark:text-gray-100">
            <li><a href="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary-600/40 transition-colors">Accueil</a></li>
            <li><a href="/about" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary-600/40 transition-colors">À propos</a></li>
            <li><a href="/contact" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary-600/40 transition-colors">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

