import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Ecosystem from "../pages/Ecosystem/Ecosystem";

import StartupDashboard from "../pages/Startup/StartupDashboard";
import InvestorDashboard from "../pages/Investor/InvestorDashboard";
import MentorDashboard from "../pages/Mentor/MentorDashboard";
import CorporateDashboard from "../pages/Corporate/CorporateDashboard";
import PartnershipDashboard from "../pages/Partnership/PartnershipDashboard";
import SponsorshipDashboard from "../pages/Sponsorship/SponsorshipDashboard";
import CareerLanding from "../pages/Career/CareerLanding";
import Onboarding from "../pages/Onboarding/Onboarding";

import StartupRegister from "../pages/Startup/StartupRegister";
import StartupOTP from "../pages/Startup/StartupOTP";
import StartupProfile from "../pages/Startup/StartupProfile";
import StartupLogin from "../pages/Startup/StartupLogin";

import InvestorRegister from "../pages/Investor/InvestorRegister";
import InvestorOTP from "../pages/Investor/InvestorOTP";
import InvestorLogin from "../pages/Investor/InvestorLogin";
import InvestorProfile from "../pages/Investor/InvestorProfile";

import MentorRegister from "../pages/Mentor/MentorRegister";
import MentorOTP from "../pages/Mentor/MentorOTP";
import MentorLogin from "../pages/Mentor/MentorLogin";
import MentorProfile from "../pages/Mentor/MentorProfile";

import CorporateRegister from "../pages/Corporate/CorporateRegister";
import CorporateOTP from "../pages/Corporate/CorporateOTP";
import CorporateLogin from "../pages/Corporate/CorporateLogin";
import CorporateProfile from "../pages/Corporate/CorporateProfile";

import PartnershipRegister from "../pages/Partnership/PartnershipRegister";
import PartnershipOTP from "../pages/Partnership/PartnershipOTP";
import PartnershipLogin from "../pages/Partnership/PartnershipLogin";
import PartnershipProfile from "../pages/Partnership/PartnershipProfile";

import SponsorshipRegister from "../pages/Sponsorship/SponsorshipRegister";
import SponsorshipOTP from "../pages/Sponsorship/SponsorshipOTP";
import SponsorshipLogin from "../pages/Sponsorship/SponsorshipLogin";
import SponsorshipProfile from "../pages/Sponsorship/SponsorshipProfile";
import SponsorshipOpportunities from "../pages/Sponsorship/SponsorshipOpportunities";
import SponsorshipCreateRequest from "../pages/Sponsorship/SponsorshipCreateRequest";

import TBridgeLanding from "../pages/TBridge/TBridgeLanding";
import TBridgeRegister from "../pages/TBridge/TBridgeRegister";
import TBridgeOTP from "../pages/TBridge/TBridgeOTP";
import TBridgeLogin from "../pages/TBridge/TBridgeLogin";
import TBridgeProfile from "../pages/TBridge/TBridgeProfile";
import TBridgeEcosystemSelection from "../pages/TBridge/TBridgeEcosystemSelection";
import TBridgeEcosystemQuestions from "../pages/TBridge/TBridgeEcosystemQuestions";
import TBridgeDashboard from "../pages/TBridge/TBridgeDashboard";
import TBridgeMyEcosystems from "../pages/TBridge/TBridgeMyEcosystems";
import TBridgeJoinEcosystem from "../pages/TBridge/TBridgeJoinEcosystem";
import TBridgeEcosystemDetails from "../pages/TBridge/TBridgeEcosystemDetails";
import TBridgeSettings from "../pages/TBridge/TBridgeSettings";
import TBridgeNotFound from "../pages/TBridge/TBridgeNotFound";
import TBridgeProtectedRoute from "../components/TBridge/TBridgeProtectedRoute";

import UniversalSearch from "../pages/Search/UniversalSearch";
import Connections from "../pages/Connections/Connections";
import Notifications from "../pages/Notifications/Notifications";
import StartupNotifications from "../pages/Startup/StartupNotifications";

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Posts from "../pages/Post/Posts";
import Profile from "../pages/Profile/Profile";
import Messenger from "../pages/Messenger/Messenger";
import Ideas from "../pages/Ideas/ideas";
import StudentRegister from "../pages/Career/StudentRegister";
import StudentLogin from "../pages/Career/StudentLogin";
import StudentOnboarding from "../pages/Career/StudentOnboarding";
import StudentDashboard from "../pages/Career/StudentDashboard";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* =========================
                    PUBLIC
                ========================== */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =========================
                    MAIN DASHBOARD
                ========================== */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />


                {/* =========================
                    STARTUP
                ========================== */}

                <Route
                    path="/startup"
                    element={<StartupRegister />}
                />

                <Route
                    path="/startup/register"
                    element={<StartupRegister />}
                />

                <Route
                    path="/startup/verify-otp"
                    element={<StartupOTP />}
                />

                <Route
                    path="/startup/startup-profile"
                    element={<StartupProfile />}
                />

                <Route
                    path="/startup/login"
                    element={<StartupLogin />}
                />

                {/* PROTECTED STARTUP DASHBOARD */}

                <Route
                    path="/startup/dashboard"
                    element={
                        <ProtectedRoute ecosystem="startup">
                            <StartupDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    INVESTOR
                ========================== */}

                <Route
                    path="/investor"
                    element={<InvestorRegister />}
                />

                <Route
                    path="/investor/verify-otp"
                    element={<InvestorOTP />}
                />

                <Route
                    path="/investor/login"
                    element={<InvestorLogin />}
                />

                <Route
                    path="/investor/profile"
                    element={<Profile />}
                />

                <Route
                    path="/investor/dashboard"
                    element={
                        <ProtectedRoute ecosystem="investor">
                            <InvestorDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    MENTOR
                ========================== */}

                <Route
                    path="/mentor/register"
                    element={<MentorRegister />}
                />

                <Route
                    path="/mentor/verify-otp"
                    element={<MentorOTP />}
                />

                <Route
                    path="/mentor/login"
                    element={<MentorLogin />}
                />

                <Route
                    path="/mentor/profile"
                    element={
                        <ProtectedRoute ecosystem="mentor">
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
    path="/mentor/professional-profile"
    element={
        <ProtectedRoute ecosystem="mentor">
            <MentorProfile />
        </ProtectedRoute>
    }
/>

                <Route
                    path="/mentor/dashboard"
                    element={
                        <ProtectedRoute ecosystem="mentor">
                            <MentorDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    CORPORATE
                ========================== */}

                <Route
                    path="/corporate/register"
                    element={<CorporateRegister />}
                />

                <Route
                    path="/corporate/otp"
                    element={<CorporateOTP />}
                />

                <Route
                    path="/corporate/login"
                    element={<CorporateLogin />}
                />

                <Route
                    path="/corporate/dashboard"
                    element={
                        <ProtectedRoute ecosystem="corporate">
                            <CorporateDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* =========================
                    PARTNERSHIP
                ========================== */}

                <Route
                    path="/partnership/register"
                    element={<PartnershipRegister />}
                />

                <Route
                    path="/partnership/otp"
                    element={<PartnershipOTP />}
                />

                <Route
                    path="/partnership/login"
                    element={<PartnershipLogin />}
                />

                <Route
                    path="/partnership/profile"
                    element={<PartnershipProfile />}
                />

                <Route
                    path="/partnership/dashboard"
                    element={
                        <ProtectedRoute ecosystem="partnership">
                            <PartnershipDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    SPONSORSHIP
                ========================== */}

                <Route
                    path="/sponsorship/register"
                    element={<SponsorshipRegister />}
                />

                <Route
                    path="/sponsorship/otp"
                    element={<SponsorshipOTP />}
                />

                <Route
                    path="/sponsorship/login"
                    element={<SponsorshipLogin />}
                />

                <Route
                    path="/sponsorship/profile"
                    element={<SponsorshipProfile />}
                />

                <Route
                    path="/sponsorship/dashboard"
                    element={
                        <ProtectedRoute ecosystem="sponsorship">
                            <SponsorshipDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/sponsorship/opportunities"
                    element={<SponsorshipOpportunities />}
                />

                <Route
                    path="/sponsorship/create-request"
                    element={<SponsorshipCreateRequest />}
                />


                {/* =========================
                    T-BRIDGE
                ========================== */}

                <Route
                    path="/tbridge"
                    element={<TBridgeLanding />}
                />

                <Route
                    path="/tbridge/register"
                    element={<TBridgeRegister />}
                />

                <Route
                    path="/tbridge/otp"
                    element={<TBridgeOTP />}
                />

                <Route
                    path="/tbridge/login"
                    element={<TBridgeLogin />}
                />

                <Route
                    path="/tbridge/profile"
                    element={
                        <TBridgeProtectedRoute>
                            <TBridgeProfile />
                        </TBridgeProtectedRoute>
                    }
                />

                <Route
                    path="/tbridge/ecosystems"
                    element={
                        <TBridgeProtectedRoute>
                            <TBridgeEcosystemSelection />
                        </TBridgeProtectedRoute>
                    }
                />

                <Route
                    path="/tbridge/ecosystem-questions"
                    element={
                        <TBridgeProtectedRoute>
                            <TBridgeEcosystemQuestions />
                        </TBridgeProtectedRoute>
                    }
                />

                <Route
                    path="/tbridge/dashboard"
                    element={
                        <TBridgeProtectedRoute>
                            <TBridgeDashboard />
                        </TBridgeProtectedRoute>
                    }
                />

                <Route
                    path="/tbridge/my-ecosystems"
                    element={
                        <TBridgeProtectedRoute>
                            <TBridgeMyEcosystems />
                        </TBridgeProtectedRoute>
                    }
                />

                <Route
                    path="/tbridge/join"
                    element={
                        <TBridgeProtectedRoute>
                            <TBridgeJoinEcosystem />
                        </TBridgeProtectedRoute>
                    }
                />

                <Route
                    path="/tbridge/ecosystem/:ecosystem"
                    element={
                        <TBridgeProtectedRoute>
                            <TBridgeEcosystemDetails />
                        </TBridgeProtectedRoute>
                    }
                />

                <Route
                    path="/tbridge/settings"
                    element={
                        <TBridgeProtectedRoute>
                            <TBridgeSettings />
                        </TBridgeProtectedRoute>
                    }
                />

                <Route
                    path="/startup/messenger"
                    element={
                        <ProtectedRoute ecosystem="startup">
                            <Messenger />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tbridge/*"
                    element={<TBridgeNotFound />}
                />

                {/* =========================
                    OTHER
                ========================== */}

                <Route
                    path="/ecosystem"
                    element={<Ecosystem />}
                />

                <Route
                    path="/career"
                    element={<CareerLanding />}
                />

                <Route
                    path="/onboarding"
                    element={<Onboarding />}
                />

                <Route
                    path="/search"
                    element={<UniversalSearch />}
                />

                <Route
                    path="/connections"
                    element={<Connections />}
                />

                <Route
                    path="/startup/notifications"
                    element={<StartupNotifications />}
                />

                <Route
    path="/investor/notifications"
    element={<Notifications />}
/>

{/* =========================
    STUDENT CAREER INTELLIGENCE
========================== */}

<Route
    path="/student/register"
    element={<StudentRegister />}
/>

<Route path="/student/login" element={<StudentLogin />} />

<Route path="/student/onboarding" element={<StudentOnboarding />} />

<Route path="/student/dashboard" element={<StudentDashboard />} />

                <Route
                    path="/notifications"
                    element={<Notifications />}
                />

                <Route path="/startup/post" element={<Posts />} />

                <Route path="/startup/profile"element={<Profile />}
            />

{/* STARTUP IDEAS */}
<Route
    path="/startup/ideas"
    element={
        <ProtectedRoute ecosystem="startup">
            <Ideas />
        </ProtectedRoute>
    }
/>

{/* INVESTOR IDEAS */}
<Route
    path="/investor/ideas"
    element={
        <ProtectedRoute ecosystem="investor">
            <Ideas />
        </ProtectedRoute>
    }
/>

<Route
    path="/startup/messenger"
    element={
        <ProtectedRoute ecosystem="startup">
            <Messenger />
        </ProtectedRoute>
    }
/>

<Route
    path="/investor/messenger"
    element={
        <ProtectedRoute ecosystem="investor">
            <Messenger />
        </ProtectedRoute>
    }
/>

{/* MENTOR IDEAS */}
<Route
    path="/mentor/ideas"
    element={
        <ProtectedRoute ecosystem="mentor">
            <Ideas />
        </ProtectedRoute>
    }
/>

{/* MENTOR DISCOVER */}
<Route
    path="/mentor/discover"
    element={
        <ProtectedRoute ecosystem="mentor">
            <UniversalSearch />
        </ProtectedRoute>
    }
/>

{/* MENTOR CONNECTIONS */}
<Route
    path="/mentor/connections"
    element={
        <ProtectedRoute ecosystem="mentor">
            <Connections />
        </ProtectedRoute>
    }
/>

{/* MENTOR MESSENGER */}
<Route
    path="/mentor/messenger"
    element={
        <ProtectedRoute ecosystem="mentor">
            <Messenger />
        </ProtectedRoute>
    }
/>

{/* MENTOR NOTIFICATIONS */}
<Route
    path="/mentor/notifications"
    element={
        <ProtectedRoute ecosystem="mentor">
            <Notifications />
        </ProtectedRoute>
    }
/>

{/* CORPORATE IDEAS */}
<Route
    path="/corporate/ideas"
    element={
        <ProtectedRoute ecosystem="corporate">
            <Ideas />
        </ProtectedRoute>
    }
/>

{/* CORPORATE NOTIFICATIONS */}
<Route
    path="/corporate/notifications"
    element={
        <ProtectedRoute ecosystem="corporate">
            <Notifications />
        </ProtectedRoute>
    }
/>

{/* CORPORATE MESSENGER */}
<Route
    path="/corporate/messenger"
    element={
        <ProtectedRoute ecosystem="corporate">
            <Messenger />
        </ProtectedRoute>
    }
/>

{/* CORPORATE PROFILE */}
<Route
    path="/corporate/profile"
    element={
        <ProtectedRoute ecosystem="corporate">
            <CorporateProfile />
        </ProtectedRoute>
    }
/>

            </Routes>
        </BrowserRouter>
    );
}


export default AppRoutes;