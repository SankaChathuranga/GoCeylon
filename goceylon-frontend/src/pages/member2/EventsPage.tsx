import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Event as GCEvent, ApiResponse, CATEGORY_LABELS } from '../../types';

/**
 * ============================================
 * MEMBER 2 – Activity & Event Listing Management
 * Student ID: IT24103420
 * ============================================
 */
export default function EventsPage() {
  const [events, setEvents] = useState<GCEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ApiResponse<GCEvent[]>>('/events?upcoming=true')
      .then(r => setEvents(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upcoming Events</h1>
          <p className="text-text-secondary">Local cultural events and gatherings across Sri Lanka</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary-light border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎪</div>
            <h3 className="text-xl font-semibold mb-2">No upcoming events</h3>
            <p className="text-text-secondary">Check back later for new events</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(e => (
              <Link key={e.id} to={`/events/${e.id}`}
                className="group rounded-2xl bg-surface-card border border-white/5 overflow-hidden hover:border-secondary/30
                         transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary/10">
                <div className="h-40 bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center relative">
                  <span className="text-5xl">🎪</span>
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-xs text-white">
                    {CATEGORY_LABELS[e.category] || e.category}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded-lg bg-secondary/10 text-secondary text-xs font-medium">
                      📅 {new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-xs text-text-secondary">{e.startTime}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-secondary transition-colors">{e.title}</h3>
                  <p className="text-text-secondary text-sm line-clamp-2 mb-3">{e.description}</p>
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>📍 {e.locationName || 'Sri Lanka'}</span>
                    {e.price != null && <span className="text-secondary font-bold text-base">${e.price}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
