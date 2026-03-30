import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Activity, Event as GCEvent, ApiResponse, CATEGORY_LABELS } from '../types';

export default function HomePage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [events, setEvents] = useState<GCEvent[]>([]);

  useEffect(() => {
    api.get<ApiResponse<Activity[]>>('/activities').then(r => setActivities(r.data.data?.slice(0, 6) || [])).catch(() => {});
    api.get<ApiResponse<GCEvent[]>>('/events?upcoming=true').then(r => setEvents(r.data.data?.slice(0, 3) || [])).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-surface to-surface" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-40 right-40 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-primary-light animate-pulse" />
            Community-Based Tourism Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            <span className="bg-gradient-to-r from-white via-white to-text-secondary bg-clip-text text-transparent">
              Discover Authentic
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-light via-secondary to-primary-light bg-clip-text text-transparent">
              Sri Lankan Experiences
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect directly with local communities. Book village cooking, surfing lessons,
            cultural workshops, and more — all through one trusted platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/activities"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-lg
                       hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1">
              Explore Activities
            </Link>
            <Link to="/register"
              className="px-8 py-3.5 rounded-xl border border-white/20 text-white font-semibold text-lg
                       hover:bg-white/5 hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
              Become a Provider
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { label: 'Experiences', value: '100+' },
              { label: 'Local Providers', value: '50+' },
              { label: 'Happy Tourists', value: '1000+' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-bold text-primary-light">{s.value}</div>
                <div className="text-xs sm:text-sm text-text-secondary mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Explore by Category</h2>
            <p className="text-text-secondary max-w-xl mx-auto">From cultural immersion to thrilling adventures, find your perfect experience</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {Object.entries(CATEGORY_LABELS).slice(0, 5).map(([key, label]) => (
              <Link key={key} to={`/activities?category=${key}`}
                className="p-6 rounded-2xl bg-surface-light border border-white/5 hover:border-primary/30 hover:bg-primary/5
                         text-center transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                <div className="text-3xl mb-3">{label.split(' ')[0]}</div>
                <div className="text-sm font-medium text-text-secondary group-hover:text-white transition-colors">{label.split(' ').slice(1).join(' ')}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      {activities.length > 0 && (
        <section className="py-20 px-4 bg-surface-light/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold">Featured Activities</h2>
                <p className="text-text-secondary mt-2">Popular experiences loved by travelers</p>
              </div>
              <Link to="/activities" className="text-primary-light hover:text-white transition-colors text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map(a => (
                <Link key={a.id} to={`/activities/${a.id}`}
                  className="group rounded-2xl bg-surface-card border border-white/5 overflow-hidden hover:border-primary/30
                           transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl">
                    {a.category === 'CULTURAL' ? '🎭' : a.category === 'ADVENTURE' ? '🏔️' : a.category === 'CULINARY' ? '🍲' : '🌴'}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary-light">{a.category}</span>
                      <span className="text-secondary font-bold">${a.price}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-light transition-colors">{a.title}</h3>
                    <p className="text-text-secondary text-sm line-clamp-2">{a.description}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-text-secondary">
                      <span>📍 {a.locationName || 'Sri Lanka'}</span>
                      {a.durationHours && <span>• {a.durationHours}h</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold">Upcoming Events</h2>
                <p className="text-text-secondary mt-2">Don't miss these local experiences</p>
              </div>
              <Link to="/events" className="text-primary-light hover:text-white transition-colors text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map(e => (
                <Link key={e.id} to={`/events/${e.id}`}
                  className="p-6 rounded-2xl bg-surface-card border border-white/5 hover:border-secondary/30
                           transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary/10">
                  <div className="text-sm text-secondary font-medium mb-2">
                    📅 {new Date(e.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{e.title}</h3>
                  <p className="text-text-secondary text-sm line-clamp-2 mb-3">{e.description}</p>
                  <div className="text-xs text-text-secondary">📍 {e.locationName || 'Sri Lanka'}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-surface-light to-accent/5 border border-white/5">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Share Your Passion with the World</h2>
          <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
            Are you a local expert? Join GoCeylon as a service provider and showcase authentic Sri Lankan experiences to travelers worldwide.
          </p>
          <Link to="/register"
            className="inline-block px-8 py-3.5 rounded-xl bg-gradient-to-r from-secondary to-secondary-light text-surface font-semibold text-lg
                     hover:shadow-2xl hover:shadow-secondary/30 transition-all duration-300 hover:-translate-y-1">
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
}
