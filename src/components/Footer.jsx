import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12">
      <div className="container mx-auto px-6 py-8 glass rounded-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">© 2024 Neihgboor. Tous droits réservés.</span>
          <div className="flex gap-4 text-sm">
            <a href="#" className="link-primary">Facebook</a>
            <a href="#" className="link-primary">Twitter</a>
            <a href="#" className="link-primary">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

