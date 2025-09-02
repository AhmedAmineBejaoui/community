import React from "react";

export default function Home() {
  return (
    <main className="container mx-auto py-12 px-6">
      <section className="text-center animate-fadeIn">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          <span className="gradient-text">Bienvenue sur Neihgboor</span>
        </h2>
        <p className="mt-3 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Découvrez votre voisinage, connectez-vous et partagez des moments uniques.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary px-6 py-3 text-lg">Commencer</button>
          <a href="#features" className="btn-secondary px-6 py-3 text-lg">En savoir plus</a>
        </div>
      </section>

      <section id="features" className="mt-14 grid md:grid-cols-3 gap-6">
        <div className="card card-hover text-left">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-brand-500 text-white flex items-center justify-center shadow-glow">
            {/* Users icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m10-4.13a4 4 0 11-8 0 4 4 0 018 0zM7 7a4 4 0 108 0 4 4 0 00-8 0z" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-semibold">Communauté</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Rejoignez votre communauté locale et restez connectés.</p>
        </div>

        <div className="card card-hover text-left">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-brand-500 text-white flex items-center justify-center shadow-glow">
            {/* Megaphone icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-5l12-2v9l-12-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12H5a2 2 0 00-2 2v1a2 2 0 002 2h2" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-semibold">Actualités</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Partagez annonces, événements et informations utiles.</p>
        </div>

        <div className="card card-hover text-left">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-brand-500 text-white flex items-center justify-center shadow-glow">
            {/* Handshake icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11l4-4 4 4m0 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m12 0H4" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-semibold">Services</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Proposez de l’aide, demandez des services et échangez.</p>
        </div>
      </section>
    </main>
  );
}

