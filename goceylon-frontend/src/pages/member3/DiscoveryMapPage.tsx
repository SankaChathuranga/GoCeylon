import { useEffect, useState, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import api from '../../api/axios';
import { NearbyActivity, ApiResponse, CATEGORY_LABELS } from '../../types';
import { Link, useSearchParams } from 'react-router-dom';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

/**
 * ============================================
 * MEMBER 3 – Interactive Location-Based Activity Discovery Map
 * Student ID: IT24103524
 * ============================================
 */
export default function DiscoveryMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [activities, setActivities] = useState<NearbyActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [lat, setLat] = useState(searchParams.get('lat') || '7.8731');
  const [lng, setLng] = useState(searchParams.get('lng') || '80.7718');
  const [radius, setRadius] = useState('50');
  const [selectedActivity, setSelectedActivity] = useState<NearbyActivity | null>(null);

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [parseFloat(lng), parseFloat(lat)],
      zoom: 8,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      'top-right'
    );

    // Click on map to set search location
    map.current.on('click', (e) => {
      setLat(e.lngLat.lat.toFixed(4));
      setLng(e.lngLat.lng.toFixed(4));
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Fly to new lat/lng when search coordinates change
  useEffect(() => {
    if (map.current) {
      map.current.flyTo({
        center: [parseFloat(lng), parseFloat(lat)],
        zoom: 10,
        duration: 1500,
      });
    }
  }, [lat, lng]);

  // Update markers when activities change
  const updateMarkers = useCallback((acts: NearbyActivity[]) => {
    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (!map.current) return;

    // Add center marker (search location)
    const centerEl = document.createElement('div');
    centerEl.innerHTML = '📍';
    centerEl.style.fontSize = '28px';
    centerEl.style.cursor = 'pointer';
    centerEl.title = 'Search center';

    const centerMarker = new mapboxgl.Marker({ element: centerEl })
      .setLngLat([parseFloat(lng), parseFloat(lat)])
      .setPopup(new mapboxgl.Popup({ offset: 25, className: 'gc-popup' }).setHTML(
        `<div style="color:#0f172a;padding:4px"><strong>Search Center</strong><br/><span style="font-size:12px">${lat}, ${lng}</span></div>`
      ))
      .addTo(map.current);
    markersRef.current.push(centerMarker);

    // Add activity markers
    acts.forEach((a) => {
      const categoryEmoji = getCategoryEmoji(a.category);
      const el = document.createElement('div');
      el.innerHTML = categoryEmoji;
      el.style.fontSize = '24px';
      el.style.cursor = 'pointer';
      el.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
      el.title = a.title;

      const popup = new mapboxgl.Popup({ offset: 25, className: 'gc-popup', maxWidth: '260px' }).setHTML(`
        <div style="color:#0f172a;padding:6px">
          <strong style="font-size:14px">${a.title}</strong>
          <p style="font-size:12px;color:#64748b;margin:4px 0">${a.description.substring(0, 80)}${a.description.length > 80 ? '...' : ''}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
            <span style="font-size:11px;color:#64748b">${a.distance} km away</span>
            <span style="font-size:14px;font-weight:bold;color:#f59e0b">$${a.price}</span>
          </div>
          <a href="/activities/${a.id}" style="display:block;text-align:center;margin-top:8px;padding:6px;border-radius:8px;background:#0f766e;color:white;font-size:12px;font-weight:600;text-decoration:none">
            View Details
          </a>
        </div>
      `);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([a.longitude, a.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener('click', () => setSelectedActivity(a));
      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (acts.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([parseFloat(lng), parseFloat(lat)]);
      acts.forEach(a => bounds.extend([a.longitude, a.latitude]));
      map.current.fitBounds(bounds, { padding: 60, maxZoom: 13, duration: 1000 });
    }
  }, [lat, lng]);

  // Initial search
  useEffect(() => { search(); }, []);

  const search = () => {
    setLoading(true);
    setSelectedActivity(null);
    api.get<ApiResponse<NearbyActivity[]>>(`/discovery/nearby?lat=${lat}&lng=${lng}&radius=${radius}`)
      .then(r => {
        const data = r.data.data || [];
        setActivities(data);
        updateMarkers(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setLat(pos.coords.latitude.toFixed(4));
        setLng(pos.coords.longitude.toFixed(4));
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🗺️ Discovery Map</h1>
          <p className="text-text-secondary">Find activities near any location in Sri Lanka — click the map to set a search point</p>
        </div>

        {/* Search Panel */}
        <div className="p-6 rounded-2xl bg-surface-light border border-white/5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Latitude</label>
              <input type="number" step="any" value={lat} onChange={e => setLat(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-white text-sm outline-none focus:border-primary-light transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Longitude</label>
              <input type="number" step="any" value={lng} onChange={e => setLng(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-white text-sm outline-none focus:border-primary-light transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Radius (km)</label>
              <input type="number" min="1" max="500" value={radius} onChange={e => setRadius(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-white/10 text-white text-sm outline-none focus:border-primary-light transition-all" />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={search}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-medium text-sm hover:shadow-lg transition-all">
                Search
              </button>
              <button onClick={detectLocation}
                className="px-3 py-2 rounded-lg border border-white/10 text-text-secondary hover:text-white text-sm transition-all" title="Use my location">
                📍
              </button>
            </div>
          </div>
        </div>

        {/* Map + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Interactive Map */}
          <div className="lg:col-span-3 h-[550px] rounded-2xl overflow-hidden border border-white/10 relative">
            <div ref={mapContainer} className="w-full h-full" />
            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 px-3 py-2 rounded-xl bg-surface/80 backdrop-blur-sm border border-white/10 text-xs text-text-secondary">
              <span className="text-white font-medium">Tip:</span> Click map to set search point
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-lg">
              {loading ? 'Searching...' : `${activities.length} activities found`}
            </h3>

            {/* Selected Activity Preview */}
            {selectedActivity && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{getCategoryEmoji(selectedActivity.category)}</span>
                  <h4 className="font-semibold text-primary-light">{selectedActivity.title}</h4>
                </div>
                <p className="text-text-secondary text-sm line-clamp-2">{selectedActivity.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-text-secondary">📍 {selectedActivity.distance} km</span>
                  <Link to={`/activities/${selectedActivity.id}`}
                    className="text-xs text-primary-light hover:underline font-medium">View Details →</Link>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-2 border-primary-light border-t-transparent rounded-full animate-spin" />
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-text-secondary">No activities found in this area. Try increasing the radius.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                {activities.map(a => (
                  <div key={a.id}
                    onClick={() => {
                      setSelectedActivity(a);
                      map.current?.flyTo({ center: [a.longitude, a.latitude], zoom: 13, duration: 800 });
                    }}
                    className={`block p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selectedActivity?.id === a.id
                        ? 'bg-primary/10 border-primary/30'
                        : 'bg-surface border-white/5 hover:border-primary/30 hover:bg-primary/5'
                    }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span>{getCategoryEmoji(a.category)}</span>
                          <h4 className="font-medium">{a.title}</h4>
                        </div>
                        <p className="text-text-secondary text-sm line-clamp-1">{a.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                          <span>{CATEGORY_LABELS[a.category]}</span>
                          <span>📍 {a.distance} km away</span>
                        </div>
                      </div>
                      <span className="text-secondary font-bold">${a.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    CULTURAL: '🎭', ADVENTURE: '🏔️', CULINARY: '🍲', NATURE: '🌿',
    CRAFT: '🎨', WELLNESS: '🧘', WATER_SPORTS: '🏄', WILDLIFE: '🐘',
    HERITAGE: '🏛️', OTHER: '📍',
  };
  return map[category] || '📍';
}
