import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { GalleryProvider } from './context/GalleryContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Gallery } from './pages/Gallery';
import { Profile } from './pages/Profile';
import { About } from './pages/About';

function ProtectedLayout({ children }) {
  return (
    <Layout>
      <ProtectedRoute>{children}</ProtectedRoute>
    </Layout>
  );
}

function HomeRedirect() {
  const { user, ready } = useAuth();
  if (!ready) return null;
  return user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <GalleryProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route
                path="/"
                element={
                  <ProtectedLayout>
                    <Dashboard />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/gallery"
                element={
                  <ProtectedLayout>
                    <Gallery />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedLayout>
                    <Profile />
                  </ProtectedLayout>
                }
              />
              <Route path="/welcome" element={<HomeRedirect />} />
              <Route path="*" element={<Navigate to="/welcome" replace />} />
            </Routes>
          </BrowserRouter>
        </GalleryProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
