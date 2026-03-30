import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌴</span>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent">
                GoCeylon
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              Connecting tourists with authentic Sri Lankan experiences through local communities.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary mb-4">Explore</h3>
            <ul className="space-y-2">
              <FooterLink to="/activities">Activities</FooterLink>
              <FooterLink to="/events">Events</FooterLink>
              <FooterLink to="/discover">Discovery Map</FooterLink>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary mb-4">For Providers</h3>
            <ul className="space-y-2">
              <FooterLink to="/register">Become a Provider</FooterLink>
              <FooterLink to="/create-listing">Create Listing</FooterLink>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary mb-4">Platform</h3>
            <ul className="space-y-2">
              <FooterLink to="/login">Sign In</FooterLink>
              <FooterLink to="/register">Sign Up</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-text-secondary text-sm">
            © 2025 GoCeylon.
          </p>
          <div className="flex gap-6 text-text-secondary text-xs">
            <span>Built with React + Spring Boot</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="text-text-secondary text-sm hover:text-primary-light transition-colors duration-200">
        {children}
      </Link>
    </li>
  );
}
