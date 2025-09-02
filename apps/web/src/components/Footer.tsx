import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container-page py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          © {year} Neighborhood Hub. Built with <span aria-hidden="true">♥</span> for the community.
        </p>
        <p className="mt-2 font-display">
          <span className="gradient-text font-semibold">Join, Connect, Grow</span>
        </p>
        <p className="mt-4 space-x-4">
          <Link href="/services" className="link-primary">
            Services
          </Link>
          <Link href="/market" className="link-primary">
            Market
          </Link>
          <Link href="/polls" className="link-primary">
            Polls
          </Link>
        </p>
      </div>
    </footer>
  );
}
