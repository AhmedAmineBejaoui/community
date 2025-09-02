import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-20 text-center animate-fadeIn">
        <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-white/70 dark:bg-neutral-900/60 border border-white/30 dark:border-neutral-800 shadow-soft">
          <span className="h-2 w-2 rounded-full bg-primary-600" />
          Building stronger neighborhoods
        </p>
        <h1 className="mt-6 text-5xl md:text-6xl font-extrabold tracking-tight">
          <span className="gradient-text">Neighborhood Hub</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Connect with neighbors, share updates, organize tasks, and grow a thriving community together.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="btn-primary text-lg px-8 py-3">Sign In</Link>
          <Link href="/join" className="btn-secondary text-lg px-8 py-3">Join Community</Link>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card card-hover text-left">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-brand-500 text-white flex items-center justify-center shadow-glow">
              {/* Users icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m10-4.13a4 4 0 11-8 0 4 4 0 018 0zM7 7a4 4 0 108 0 4 4 0 00-8 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Community</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Join your neighborhood community and stay connected with nearby residents.
            </p>
          </div>

          <div className="card card-hover text-left">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-brand-500 text-white flex items-center justify-center shadow-glow">
              {/* Megaphone icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-5l12-2v9l-12-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12H5a2 2 0 00-2 2v1a2 2 0 002 2h2" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Updates</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Share announcements, events, and important information with your community.
            </p>
          </div>

          <div className="card card-hover text-left">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-brand-500 text-white flex items-center justify-center shadow-glow">
              {/* Handshake icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11l4-4 4 4m0 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m12 0H4" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Services</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Offer help, request services, and trade items with trusted neighbors.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

