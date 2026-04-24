import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import SetupPage from "./pages/SetupPage";
import InterviewPage from "./pages/InterviewPage";
import ResultsPage from "./pages/ResultsPage";
import AdminPage from "./pages/AdminPage";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // render nothing — AppLoader handles the spinner
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function AppLoader({ children }) {
  const { loading } = useAuth();
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          gap: 16,
          background: "var(--navy)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "3px solid var(--navy-4)",
            borderTopColor: "var(--accent)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Loading…
        </span>
      </div>
    );
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLoader>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/setup"
              element={
                <PrivateRoute>
                  <SetupPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/interview/:sessionId"
              element={
                <PrivateRoute>
                  <InterviewPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/results/:sessionId"
              element={
                <PrivateRoute>
                  <ResultsPage />
                </PrivateRoute>
              }
            />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLoader>
      </BrowserRouter>
    </AuthProvider>
  );
}
