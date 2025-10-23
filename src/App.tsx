import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

// Layouts
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";

// Dashboard Pages
import { EntrepreneurDashboard } from "./pages/dashboard/EntrepreneurDashboard";
import { InvestorDashboard } from "./pages/dashboard/InvestorDashboard";
import { AdminDashboard } from "./pages/dashboard/AdminDashboard";

// Profile Pages
import { EntrepreneurProfile } from "./pages/profile/EntrepreneurProfile";
import { InvestorProfile } from "./pages/profile/InvestorProfile";

// Feature Pages
import { InvestorsPage } from "./pages/investors/InvestorsPage";
import { EntrepreneursPage } from "./pages/entrepreneurs/EntrepreneursPage";
import { MessagesPage } from "./pages/messages/MessagesPage";
import { NotificationsPage } from "./pages/notifications/NotificationsPage";
import { DocumentsPage } from "./pages/documents/DocumentsPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { HelpPage } from "./pages/help/HelpPage";
import { DealsPage } from "./pages/deals/DealsPage";

// Chat Pages
import { ChatPage } from "./pages/chat/ChatPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
//import { VideoCall } from "./components/webRTC/Videocall";
//import { AudioCall } from "./components/webRTC/AudioCall";
import { Toaster } from "react-hot-toast";
import { UserManagement } from "./pages/admin/UserManagement";
import { Activities } from "./pages/admin/activities";
import { Entrepreneurj } from "./pages/admin/entrepreneur";
import { Investors } from "./pages/admin/investors";
import { Campaigns } from "./pages/admin/campaigns";
import { HomePage } from "./pages/home/HomePage";
import { LoginWithOAuthPage } from "./pages/auth/LoginWithOAuthPage";

function App() {
  return (
    //  <div>
    //   <h1>WebRTC Test</h1>
    //   <VideoCall roomId="room123" />
    // </div>
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/login-with-oauth" element={<LoginWithOAuthPage />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="entrepreneur" element={<EntrepreneurDashboard />} />
              <Route path="investor" element={<InvestorDashboard />} />
              <Route path="admin" element={<AdminDashboard />} />
            </Route>

            <Route path="/admin" element={<DashboardLayout />}>
              <Route path="users" element={<UserManagement />} />
              <Route path="activities" element={<Activities />} />
              <Route path="entrepreneur" element={<Entrepreneurj />} />
              <Route path="investors" element={<Investors />} />
              <Route path="campaigns" element={<Campaigns />} />
            </Route>

            {/* Profile Routes */}
            <Route path="/profile" element={<DashboardLayout />}>
              <Route
                path="entrepreneur/:id"
                element={<EntrepreneurProfile />}
              />
              <Route path="investor/:id" element={<InvestorProfile />} />
            </Route>

            {/* Feature Routes */}
            <Route path="/investors" element={<DashboardLayout />}>
              <Route index element={<InvestorsPage />} />
            </Route>

            <Route path="/entrepreneurs" element={<DashboardLayout />}>
              <Route index element={<EntrepreneursPage />} />
            </Route>

            <Route path="/messages" element={<DashboardLayout />}>
              <Route index element={<MessagesPage />} />
            </Route>

            <Route path="/notifications" element={<DashboardLayout />}>
              <Route index element={<NotificationsPage />} />
            </Route>

            <Route path="/documents" element={<DashboardLayout />}>
              <Route index element={<DocumentsPage />} />
            </Route>

            <Route path="/settings" element={<DashboardLayout />}>
              <Route index element={<SettingsPage />} />
            </Route>

            <Route path="/help" element={<DashboardLayout />}>
              <Route index element={<HelpPage />} />
            </Route>

            <Route path="/call" element={<DashboardLayout />}></Route>

            <Route path="/deals" element={<DashboardLayout />}>
              <Route index element={<DealsPage />} />
            </Route>

            {/* Chat Routes */}
            <Route path="/chat" element={<DashboardLayout />}>
              <Route path=":userId" element={<ChatPage />} />
            </Route>

            {/* Redirect root to login */}
            <Route path="/home" element={<HomePage />} />

            {/* Catch all other routes and redirect to login */}
            <Route
              path="/dashboard/entreprenuer"
              element={<Navigate to="/login" replace />}
            />
          </Routes>
        </Router>
        <Toaster position="top-right" reverseOrder={false} />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
