import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🌴</span>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent
                           group-hover:from-secondary group-hover:to-primary-light transition-all duration-300">
              GoCeylon
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/activities">Activities</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/discover">Discover Map</NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/bookings">My Bookings</NavLink>
                {user?.role === 'PROVIDER' && (
                  <NavLink to="/create-listing">Create Listing</NavLink>
                )}
                {user?.role === 'ADMIN' && (
                  <NavLink to="/admin">Admin Panel</NavLink>
                )}
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-sm font-semibold">
                    {user?.firstName?.[0]}
                  </div>
                  <span className="text-sm text-text-secondary">{user?.firstName}</span>
                </Link>
                <button onClick={handleLogout}
                  className="px-4 py-2 text-sm rounded-lg border border-white/10 text-text-secondary hover:text-white hover:border-white/20 transition-all">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login"
                  className="px-4 py-2 text-sm rounded-lg text-text-secondary hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register"
                  className="px-5 py-2 text-sm rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-medium
                           hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ?
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> :
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface-light border-t border-white/10 animate-in slide-in-from-top">
          <div className="px-4 py-3 space-y-1">
            <MobileLink to="/activities" onClick={() => setMenuOpen(false)}>Activities</MobileLink>
            <MobileLink to="/events" onClick={() => setMenuOpen(false)}>Events</MobileLink>
            <MobileLink to="/discover" onClick={() => setMenuOpen(false)}>Discover Map</MobileLink>
            {isAuthenticated && (
              <>
                <MobileLink to="/bookings" onClick={() => setMenuOpen(false)}>My Bookings</MobileLink>
                <MobileLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</MobileLink>
                {user?.role === 'PROVIDER' && (
                  <MobileLink to="/create-listing" onClick={() => setMenuOpen(false)}>Create Listing</MobileLink>
                )}
                {user?.role === 'ADMIN' && (
                  <MobileLink to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</MobileLink>
                )}
                <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-danger hover:bg-white/5 rounded-lg transition-colors">
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <MobileLink to="/login" onClick={() => setMenuOpen(false)}>Sign In</MobileLink>
                <MobileLink to="/register" onClick={() => setMenuOpen(false)}>Get Started</MobileLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to}
      className="px-3 py-2 text-sm text-text-secondary hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200">
      {children}
    </Link>
  );
}

function MobileLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link to={to} onClick={onClick}
      className="block px-3 py-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors">
      {children}
    </Link>
  );
}
