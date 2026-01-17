import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { NotificationProvider } from "./context/NotificationContext";

// Layouts
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";

// Dashboard Pages
import { EntrepreneurDashboard } from "./pages/dashboard/EntrepreneurDashboard";
import { EntrepreneurRequests } from "./pages/dashboard/EntrepreneurRequests";
import { ManageTeam } from "./pages/dashboard/ManageTeam";
import { InvestorDashboard } from "./pages/dashboard/InvestorDashboard";

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

// Chat Pages
import { ChatPage } from "./pages/chat/ChatPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { VideoCall } from "./pages/webRTC/Videocall";
import { AudioCall } from "./pages/webRTC/AudioCall";
import { Toaster } from "react-hot-toast";
import { HomePage } from "./pages/home/HomePage";
import { Supporters } from "./pages/admin/supporters";
import { Users } from "./pages/admin/Users";
import { Campaigns } from "./pages/admin/Campaigns";
import { DealsPage } from "./pages/deals/DealsPage";
import { CampaignsPage } from "./pages/campaignPage/CampaignPage";
import { CampaignDetailPage } from "./pages/campaignPage/CampaignDetailPage";
import { FundraisePage } from "./pages/fundraises/Fundraises-Page";
import { AdminDashboard } from "./pages/dashboard/AdminDashboard";
import { Activities } from "./pages/admin/activities";
import { Investors } from "./pages/admin/investors";
import { FraudAndRiskDetection } from "./pages/admin/FraudAndRiskDetection";
import { ViewDeals } from "./pages/viewdeals/ViewDeal";
import { TwoFactorAuthPage } from "./pages/auth/TwoFactorAuthPage";
import { UserDetails } from "./components/user/UserDetails";
import { UserApprovals } from "./pages/admin/UserApprovals";
import { AccountUnderReviewPage } from "./pages/auth/AccountUnderReviewPage";
import { AccountRejectedPage } from "./pages/auth/AccountRejectedPage";
import { SuspendedUserPage } from "./pages/auth/SuspendedUserPage";
import { BlockedUserPage } from "./pages/auth/BlockedUserPage";
import ScrollToTop from "./components/common/ScrollToTop";
import { SuspendedBlockedUsers } from "./pages/admin/SuspendedBlockedUsers";
import { TermsOfService } from "./pages/legal/TermsOfService";
import { CommunityGuidelines } from "./pages/legal/CommunityGuidelines";
import SendMassNotification from "./pages/admin/SendMassNotification";
import { DashboardCampaigns } from "./pages/dashCamp/DashboardCampaigns";
import { DashboardCampaignDetail } from "./pages/dashCamp/DashboardCampaignDetail";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/account-under-review" element={<AccountUnderReviewPage />} />
              <Route path="/account-rejected" element={<AccountRejectedPage />} />
              <Route path="/account-suspended" element={<SuspendedUserPage />} />
              <Route path="/account-blocked" element={<BlockedUserPage />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/guidelines" element={<CommunityGuidelines />} />

              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route path="entrepreneur" element={<EntrepreneurDashboard />} />
                <Route
                  path="entrepreneur/requests"
                  element={<EntrepreneurRequests />}
                />
                <Route
                  path="entrepreneur/team"
                  element={<ManageTeam />}
                />
                <Route path="investor" element={<InvestorDashboard />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="campaigns" element={<DashboardCampaigns />} />
                <Route path="campaigns/:id" element={<DashboardCampaignDetail />} />
              </Route>

              <Route path="/admin" element={<DashboardLayout />}>
                <Route path="activities" element={<Activities />} />
                <Route path="all-users" element={<Users />} />
                <Route path="investors" element={<Investors />} />
                <Route path="campaigns" element={<Campaigns />} />
                <Route path="supporters" element={<Supporters />} />
                <Route path="suspended-blocked" element={<SuspendedBlockedUsers />} />
                <Route
                  path="fraud-and-risk-detection"
                  element={<FraudAndRiskDetection />}
                />
                <Route path="send-notification" element={<SendMassNotification />} />
              </Route>

              <Route path="/dashboard/admin" element={<DashboardLayout />}>
                <Route path="approvals" element={<UserApprovals />} />
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
                <Route path="sent-deals" element={<DealsPage />} />
                <Route path="view-deals" element={<ViewDeals />} />
              </Route>

              {/* Chat Routes */}
              <Route path="/chat" element={<DashboardLayout />}>
                <Route
                  path=":userId/audio-call/:roomId/:isIncommingCall"
                  element={<AudioCall />}
                />
                <Route
                  path=":userId/video-call/:roomId/:isIncommingCall"
                  element={<VideoCall />}
                />
                <Route path=":userId" element={<ChatPage />} />
              </Route>

              {/* Redirect root to homepage */}
              <Route path="/" element={<HomePage />} />
              <Route path="/All-Campaigns" element={<CampaignsPage />} />
              <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
              <Route path="/Fundraises" element={<FundraisePage />} />
              <Route path="/verify-2fa" element={<TwoFactorAuthPage />} />
              <Route path="/fill-details" element={<UserDetails />} />
              {/* Catch all other routes and redirect to login */}
              <Route
                path="/dashboard/entreprenuer"
                element={<Navigate to="/login" replace />}
              />
            </Routes>
          </Router>
          <Toaster position="top-right" reverseOrder={false} />
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
