// ============================================
// Shared TypeScript Types for GoCeylon
// ============================================

// ---- MEMBER 1: Auth & User Management (IT24103772) ----
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'TOURIST' | 'PROVIDER' | 'ADMIN';
  profileImageUrl?: string;
  bio?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'TOURIST' | 'PROVIDER';
}

export interface LoginResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  userId: number;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  profileImageUrl?: string;
}

// ---- MEMBER 2: Activity & Event Listings (IT24103420) ----
export interface Activity {
  id: number;
  providerId: number;
  providerName: string;
  title: string;
  description: string;
  category: string;
  price: number;
  durationHours?: number;
  maxParticipants?: number;
  latitude: number;
  longitude: number;
  locationName?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateActivityRequest {
  title: string;
  description: string;
  category: string;
  price: number;
  durationHours?: number;
  maxParticipants?: number;
  latitude: number;
  longitude: number;
  locationName?: string;
  imageUrl?: string;
}

export interface Event {
  id: number;
  providerId: number;
  providerName: string;
  title: string;
  description: string;
  category: string;
  price?: number;
  eventDate: string;
  startTime: string;
  endTime?: string;
  maxAttendees?: number;
  latitude: number;
  longitude: number;
  locationName?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  category: string;
  price?: number;
  eventDate: string;
  startTime: string;
  endTime?: string;
  maxAttendees?: number;
  latitude: number;
  longitude: number;
  locationName?: string;
  imageUrl?: string;
}

// ---- MEMBER 3: Discovery Map (IT24103524) ----
export interface NearbyActivity {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  latitude: number;
  longitude: number;
  locationName?: string;
  imageUrl?: string;
  providerName: string;
  distance: number;
}

export interface Favorite {
  id: number;
  activityId?: number;
  activityTitle?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  favoriteType: 'ACTIVITY' | 'LOCATION';
  createdAt: string;
}

export interface Itinerary {
  id: number;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  items: ItineraryItem[];
  createdAt: string;
}

export interface ItineraryItem {
  id: number;
  activityId?: number;
  activityTitle?: string;
  dayNumber: number;
  orderIndex: number;
  notes?: string;
}

export interface SearchPreference {
  preferredCategories?: string;
  maxDistanceKm?: number;
  minPrice?: number;
  maxPrice?: number;
}

// ---- MEMBER 4: Bookings (IT24103207) ----
export interface Booking {
  id: number;
  referenceNumber: string;
  touristId: number;
  touristName: string;
  activityId: number;
  activityTitle: string;
  activityLocation?: string;
  bookingDate: string;
  timeSlot?: string;
  numParticipants: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  createdAt: string;
}

export interface CreateBookingRequest {
  activityId: number;
  bookingDate: string;
  timeSlot?: string;
  numParticipants: number;
  notes?: string;
}

// ---- MEMBER 5: Payments (IT24103022) ----
export interface Payment {
  id: number;
  bookingId: number;
  bookingReference: string;
  amount: number;
  commission: number;
  providerAmount: number;
  paymentMethod: string;
  status: string;
  transactionId: string;
  paidAt?: string;
  createdAt: string;
}

export interface PaymentRequest {
  bookingId: number;
  paymentMethod: string;
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  paymentId: number;
  touristName: string;
  totalAmount: number;
  activityTitle: string;
  bookingReference: string;
  issuedAt: string;
}

export interface Payout {
  id: number;
  providerId: number;
  providerName: string;
  amount: number;
  status: string;
  payoutDate?: string;
  createdAt: string;
}

// ---- MEMBER 6: Reviews & Admin (IT24103280) ----
export interface Review {
  id: number;
  touristId: number;
  touristName: string;
  activityId: number;
  activityTitle: string;
  rating: number;
  comment?: string;
  isFlagged: boolean;
  createdAt: string;
}

export interface CreateReviewRequest {
  activityId: number;
  rating: number;
  comment?: string;
}

export interface Analytics {
  totalUsers: number;
  totalTourists: number;
  totalProviders: number;
  totalActivities: number;
  totalEvents: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalReviews: number;
  flaggedReviews: number;
  averageRating: number;
}

// ---- Common ----
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const CATEGORIES = [
  'CULTURAL', 'ADVENTURE', 'CULINARY', 'NATURE', 'CRAFT',
  'WELLNESS', 'WATER_SPORTS', 'WILDLIFE', 'HERITAGE', 'OTHER'
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  CULTURAL: '🎭 Cultural',
  ADVENTURE: '🏔️ Adventure',
  CULINARY: '🍲 Culinary',
  NATURE: '🌿 Nature',
  CRAFT: '🎨 Craft',
  WELLNESS: '🧘 Wellness',
  WATER_SPORTS: '🏄 Water Sports',
  WILDLIFE: '🐘 Wildlife',
  HERITAGE: '🏛️ Heritage',
  OTHER: '📍 Other',
};
