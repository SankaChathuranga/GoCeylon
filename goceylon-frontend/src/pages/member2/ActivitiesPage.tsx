import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import { Activity, ApiResponse, CATEGORIES, CATEGORY_LABELS } from '../../types';

/**
 * ============================================
 * MEMBER 2 – Activity & Event Listing Management
 * Student ID: IT24103420
 * ============================================
 */
export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const url = selectedCategory ? `/activities?category=${selectedCategory}` : '/activities';
    api.get<ApiResponse<Activity[]>>(url)
      .then(r => setActivities(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Activities</h1>
          <p className="text-text-secondary">Discover authentic Sri Lankan experiences offered by local communities</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setSearchParams({})}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              !selectedCategory ? 'bg-primary text-white' : 'bg-surface-light text-text-secondary hover:text-white border border-white/10'
            }`}>All</button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setSearchParams({ category: cat })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat ? 'bg-primary text-white' : 'bg-surface-light text-text-secondary hover:text-white border border-white/10'
              }`}>{CATEGORY_LABELS[cat]}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary-light border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏝️</div>
            <h3 className="text-xl font-semibold mb-2">No activities found</h3>
            <p className="text-text-secondary">Check back later or try a different category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map(a => (
              <Link key={a.id} to={`/activities/${a.id}`}
                className="group rounded-2xl bg-surface-card border border-white/5 overflow-hidden hover:border-primary/30
                         transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                  <span className="text-6xl">{
                    a.category === 'CULTURAL' ? '🎭' : a.category === 'ADVENTURE' ? '🏔️' :
                    a.category === 'CULINARY' ? '🍲' : a.category === 'NATURE' ? '🌿' :
                    a.category === 'CRAFT' ? '🎨' : a.category === 'WATER_SPORTS' ? '🏄' : '🌴'
                  }</span>
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-xs text-white">
                    {CATEGORY_LABELS[a.category] || a.category}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">by {a.providerName}</span>
                    <span className="text-lg font-bold text-secondary">${a.price}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-light transition-colors">{a.title}</h3>
                  <p className="text-text-secondary text-sm line-clamp-2 mb-3">{a.description}</p>
                  <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <span>📍 {a.locationName || 'Sri Lanka'}</span>
                    {a.durationHours && <span>⏱ {a.durationHours}h</span>}
                    {a.maxParticipants && <span>👥 Max {a.maxParticipants}</span>}
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
