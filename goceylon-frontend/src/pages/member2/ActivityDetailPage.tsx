import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Activity, Review, ApiResponse, CATEGORY_LABELS } from '../../types';
import { useAuth } from '../../context/AuthContext';

/**
 * ============================================
 * MEMBER 2 – Activity & Event Listing Management (IT24103420)
 * + MEMBER 6 – Reviews display (IT24103280)
 * + MEMBER 4 – Booking link (IT24103207)
 * ============================================
 */
export default function ActivityDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    if (!id) return;
    api.get<ApiResponse<Activity>>(`/activities/${id}`).then(r => setActivity(r.data.data)).catch(() => navigate('/activities'));
    api.get<ApiResponse<Review[]>>(`/reviews/activity/${id}`).then(r => setReviews(r.data.data || [])).catch(() => {});
    api.get<ApiResponse<number>>(`/reviews/activity/${id}/rating`).then(r => setAvgRating(r.data.data || 0)).catch(() => {});
  }, [id]);

  if (!activity) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-light border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link to="/activities" className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-6 transition-colors">
          ← Back to Activities
        </Link>

        {/* Header image */}
        <div className="h-64 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-8 text-8xl">
          {activity.category === 'CULTURAL' ? '🎭' : activity.category === 'ADVENTURE' ? '🏔️' :
           activity.category === 'CULINARY' ? '🍲' : activity.category === 'NATURE' ? '🌿' : '🌴'}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary-light text-sm">{CATEGORY_LABELS[activity.category]}</span>
                {avgRating > 0 && <span className="text-secondary">★ {avgRating}</span>}
              </div>
              <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
              <p className="text-text-secondary">by {activity.providerName}</p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-light border border-white/5">
              <h3 className="font-semibold mb-3">Description</h3>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">{activity.description}</p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-light border border-white/5">
              <h3 className="font-semibold mb-3">Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-text-secondary">Location:</span> <span className="ml-2">{activity.locationName || 'Sri Lanka'}</span></div>
                {activity.durationHours && <div><span className="text-text-secondary">Duration:</span> <span className="ml-2">{activity.durationHours} hours</span></div>}
                {activity.maxParticipants && <div><span className="text-text-secondary">Max Participants:</span> <span className="ml-2">{activity.maxParticipants}</span></div>}
                <div><span className="text-text-secondary">Coordinates:</span> <span className="ml-2">{activity.latitude}, {activity.longitude}</span></div>
              </div>
            </div>

            {/* Reviews */}
            <div className="p-6 rounded-2xl bg-surface-light border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Reviews ({reviews.length})</h3>
                {isAuthenticated && user?.role === 'TOURIST' && (
                  <Link to={`/reviews/write?activityId=${activity.id}`}
                    className="text-sm text-primary-light hover:underline">Write a Review</Link>
                )}
              </div>
              {reviews.length === 0 ? (
                <p className="text-text-secondary text-sm">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r.id} className="p-4 rounded-xl bg-surface border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{r.touristName}</span>
                        <span className="text-secondary">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      </div>
                      {r.comment && <p className="text-text-secondary text-sm">{r.comment}</p>}
                      <p className="text-xs text-text-secondary mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 p-6 rounded-2xl bg-surface-light border border-white/5 space-y-4">
              <div className="text-3xl font-bold text-secondary">${activity.price}<span className="text-base text-text-secondary font-normal"> / person</span></div>
              {isAuthenticated ? (
                <Link to={`/book/${activity.id}`}
                  className="block w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-center
                           hover:shadow-lg hover:shadow-primary/25 transition-all">
                  Book Now
                </Link>
              ) : (
                <Link to="/login"
                  className="block w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-center
                           hover:shadow-lg hover:shadow-primary/25 transition-all">
                  Sign in to Book
                </Link>
              )}
              <Link to={`/discover?lat=${activity.latitude}&lng=${activity.longitude}`}
                className="block w-full py-3 rounded-xl border border-white/10 text-text-secondary text-center hover:text-white hover:border-white/20 transition-all">
                View on Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
