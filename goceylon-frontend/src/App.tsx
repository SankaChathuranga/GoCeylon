import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';

// Member 1 – Auth & User Management (IT24103772)
import LoginPage from './pages/member1/LoginPage';
import RegisterPage from './pages/member1/RegisterPage';
import ProfilePage from './pages/member1/ProfilePage';

// Member 2 – Activity & Event Listings (IT24103420)
import ActivitiesPage from './pages/member2/ActivitiesPage';
import ActivityDetailPage from './pages/member2/ActivityDetailPage';
import EventsPage from './pages/member2/EventsPage';
import CreateListingPage from './pages/member2/CreateListingPage';

// Member 3 – Discovery Map (IT24103524)
import DiscoveryMapPage from './pages/member3/DiscoveryMapPage';
import FavoritesPage from './pages/member3/FavoritesPage';

// Member 4 – Bookings (IT24103207)
import BookingPage from './pages/member4/BookingPage';
import BookingHistoryPage from './pages/member4/BookingHistoryPage';

// Member 5 – Payments (IT24103022)
import PaymentPage from './pages/member5/PaymentPage';
import TransactionHistoryPage from './pages/member5/TransactionHistoryPage';

// Member 6 – Reviews & Admin (IT24103280)
import WriteReviewPage from './pages/member6/WriteReviewPage';
import AdminDashboardPage from './pages/member6/AdminDashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />

              {/* Member 1 – Auth (IT24103772) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              {/* Member 2 – Listings (IT24103420) */}
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/activities/:id" element={<ActivityDetailPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/create-listing" element={
                <ProtectedRoute requiredRole="PROVIDER"><CreateListingPage /></ProtectedRoute>
              } />

              {/* Member 3 – Discovery (IT24103524) */}
              <Route path="/discover" element={<DiscoveryMapPage />} />
              <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />

              {/* Member 4 – Bookings (IT24103207) */}
              <Route path="/book/:activityId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
              <Route path="/bookings" element={<ProtectedRoute><BookingHistoryPage /></ProtectedRoute>} />

              {/* Member 5 – Payments (IT24103022) */}
              <Route path="/pay/:bookingId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/transactions" element={<ProtectedRoute><TransactionHistoryPage /></ProtectedRoute>} />

              {/* Member 6 – Reviews & Admin (IT24103280) */}
              <Route path="/reviews/write" element={<ProtectedRoute><WriteReviewPage /></ProtectedRoute>} />
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="ADMIN"><AdminDashboardPage /></ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
