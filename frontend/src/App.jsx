import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";

//authentication pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import ContactPage from "./pages/ContactPage";

//dashboards
import MasterDashboard from "./dashboards/MasterDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import UserDashboard from "./dashboards/UserDashboard";

//components
import ProtectedRoute from "./components/ProtectedRoute";

//Master Admin pages
import MasterRegister from "./pages/Masters/MasterRegister";
import AllAdminControl from "./pages/Masters/AllAdminControl";
import AllUserReports from "./pages/Masters/AllUserReports";

//Admin pages
import AdminRegister from "./pages/Admins/AdminRegister";
import UserControl from "./pages/Admins/UserControl";
import MyUserReports from "./pages/Admins/MyUserReports";

//User pages
import UserSubmitForm from "./pages/Users/UserSubmitForm";

// =====================
// Auto Logout Wrapper
// =====================
function AutoLogoutWrapper({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    let logoutTimer;

    const startTimer = () => {
      clearTimeout(logoutTimer);

      // Auto logout after 5 minutes (300000ms)
      logoutTimer = setTimeout(() => {
        localStorage.removeItem("user");
        localStorage.setItem("sessionExpired", "true"); // flag for login page
        navigate("/login");
      }, 30000000);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, startTimer));

    startTimer(); // start immediately

    return () => {
      events.forEach((event) => window.removeEventListener(event, startTimer));
      clearTimeout(logoutTimer);
    };
  }, [navigate]);

  return children;
}


// =====================
// Main App Component
// =====================
export default function App() {
  return (
    <Router>
      <AutoLogoutWrapper>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Contact-Page" element={<ContactPage />} />

          {/* MASTER REGISTER (requires access code) */}
          <Route
            path="/master-register"
            element={
              <ProtectedRoute requireAccessCode={true}>
                <MasterRegister />
              </ProtectedRoute>
            }
          />

          {/* ADMIN ONLY ROUTES */}
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/My-User-Reports"
            element={
              <ProtectedRoute roles={["admin"]}>
                <MyUserReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-control"
            element={
              <ProtectedRoute roles={["admin"]}>
                <UserControl />
              </ProtectedRoute>
            }
          />

          {/* USER ROUTES */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute roles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/User-Submit-Form"
            element={
              <ProtectedRoute roles={["user"]}>
                <UserSubmitForm />
              </ProtectedRoute>
            }
          />

          {/* MASTER ADMIN ONLY ROUTES */}
          <Route
            path="/master-dashboard"
            element={
              <ProtectedRoute roles={["masteradmin"]}>
                <MasterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-admin-control"
            element={
              <ProtectedRoute roles={["masteradmin"]}>
                <AllAdminControl />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-user-reports"
            element={
              <ProtectedRoute roles={["masteradmin"]}>
                <AllUserReports />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AutoLogoutWrapper>
    </Router>
  );
}
