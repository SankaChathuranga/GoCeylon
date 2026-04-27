import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Event as GCEvent, ApiResponse, CATEGORY_LABELS } from '../../types';

/**
 * ============================================
 * MEMBER 2 – Activity & Event Listing Management
 * Student ID: IT24103420
 * ============================================
 */
export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState<GCEvent | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get<ApiResponse<GCEvent>>(`/events/${id}`)
      .then(r => setEventData(r.data.data))
      .catch(() => navigate('/events'));
  }, [id]);

  if (!eventData) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-light border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link to="/events" className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-6 transition-colors">
          ← Back to Events
        </Link>

        {/* Header image placeholder */}
        <div className="h-64 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center mb-8 text-8xl">
          🎪
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                  {CATEGORY_LABELS[eventData.category] || eventData.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 text-text-secondary text-sm">
                  📅 {new Date(eventData.eventDate).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{eventData.title}</h1>
              <p className="text-text-secondary">Organized by {eventData.providerName}</p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-light border border-white/5">
              <h3 className="font-semibold mb-3">About this Event</h3>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">{eventData.description}</p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-light border border-white/5">
              <h3 className="font-semibold mb-3">Event Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><span className="text-text-secondary">Location:</span> <span className="ml-2 font-medium">{eventData.locationName || 'Sri Lanka'}</span></div>
                <div><span className="text-text-secondary">Start Time:</span> <span className="ml-2 font-medium">{eventData.startTime}</span></div>
                {eventData.endTime && <div><span className="text-text-secondary">End Time:</span> <span className="ml-2 font-medium">{eventData.endTime}</span></div>}
                {eventData.maxAttendees && <div><span className="text-text-secondary">Max Attendees:</span> <span className="ml-2 font-medium">{eventData.maxAttendees}</span></div>}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 p-6 rounded-2xl bg-surface-light border border-white/5 space-y-4">
              <div className="text-center mb-4">
                {eventData.price ? (
                  <div className="text-3xl font-bold text-secondary">
                    ${eventData.price}
                    <span className="text-base text-text-secondary font-normal block">Entrance Fee</span>
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-success border border-success/30 bg-success/10 rounded-xl py-2">
                    FREE
                    <span className="text-base font-normal block">Entrance</span>
                  </div>
                )}
              </div>
              
              <Link to={`/discover?lat=${eventData.latitude}&lng=${eventData.longitude}`}
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-secondary to-secondary-light text-white font-semibold text-center hover:shadow-lg transition-all">
                View on Map 🗺️
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
