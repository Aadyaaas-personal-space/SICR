const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const app = express();
const systemAdminRoutes = require("./routes/systemAdminRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const entrepreneurRoutes = require("./routes/entrepreneurRoutes");
const startupRoutes = require("./routes/startupRoutes");
const investorRoutes = require("./routes/investorRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const mentorshipRoutes = require("./routes/mentorshipRoutes");
const mentorshipFeedbackRoutes = require("./routes/mentorshipFeedbackRoutes");
const startupOTPRoutes = require("./routes/startupOTPRoutes");
const startupProfileRoutes = require("./routes/startupProfileRoutes");
const startupAuthRoutes = require("./routes/startupAuthRoutes");
const investorFunderRoutes = require("./routes/investorFunderRoutes");
const mentorAuthRoutes = require("./routes/mentorAuthRoutes");
const mentorProfileRoutes = require("./routes/mentorProfileRoutes");
const mentorDashboardRoutes = require("./routes/mentorDashboardRoutes");
const corporateRoutes = require("./routes/corporateRoutes");
const partnershipRoutes = require("./routes/partnershipRoutes");
const sponsorshipRoutes = require("./routes/sponsorshipRoutes");
const tBridgeAuthRoutes = require("./routes/TBridge/TBridgeAuthRoutes");
const tBridgeOTPRoutes = require("./routes/TBridge/TBridgeOTPRoutes");
const tBridgeProfileRoutes = require("./routes/TBridge/TBridgeProfileRoutes");
const tBridgeEcosystemRoutes = require("./routes/TBridge/TBridgeEcosystemRoutes");
const tBridgeDashboardRoutes = require("./routes/TBridge/TBridgeDashboardRoutes");
const mlMatchingRoutes = require("./routes/mlMatchingRoutes");
const universalMatchingRoutes = require("./routes/universalMatchingRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const postRoutes = require("./routes/postRoutes");
const profileRoutes = require("./routes/profileRoutes");
const roadmapRoutes = require("./modules/career-roadmap/routes/roadmap");
const messageRoutes = require("./routes/messageRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
const studentRoutes = require("./routes/studentRoutes");
const studentCareerChatRoutes = require("./routes/studentCareerChatRoutes");

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use(
    "/api/system-admin",
    systemAdminRoutes
);

app.use(
    "/api/admin",
    adminDashboardRoutes
);

app.use(
    "/api/entrepreneur",
    entrepreneurRoutes
);

app.use(
    "/api/startups",
    startupRoutes
);

app.use(
    "/api/investor",
    investorRoutes
);

app.use(
    "/api/investments",
    investmentRoutes
);

app.use(
    "/api/mentor",
    mentorRoutes
);

app.use(
    "/api/mentorship",
    mentorshipRoutes
);

app.use(
    "/api/mentorship",
    mentorshipFeedbackRoutes
);

app.use(
    "/api/startup",
    startupOTPRoutes
);

app.use(
    "/api/startup",
    startupProfileRoutes
);

app.use(
    "/api/startup",
    startupAuthRoutes
);

app.use(
    "/api/investor-funder",
    investorFunderRoutes
);

app.use(
    "/api/mentor",
    mentorAuthRoutes
);

app.use(
    "/api/mentor",
    mentorProfileRoutes
);

app.use(
    "/api/mentor",
    mentorDashboardRoutes
);

app.use(
    "/api/corporate",
    corporateRoutes
);

app.use(
    "/api/partnership",
    partnershipRoutes
);

app.use(
    "/api/sponsorship",
    sponsorshipRoutes
);

app.use(
    "/api/tbridge",
    tBridgeAuthRoutes
);

app.use(
    "/api/tbridge/otp",
    tBridgeOTPRoutes
);

app.use(
    "/api/tbridge/profile",
    tBridgeProfileRoutes
);

app.use(
    "/api/tbridge/ecosystems",
    tBridgeEcosystemRoutes
);

app.use(
    "/api/tbridge/dashboard",
    tBridgeDashboardRoutes
);

app.use(
    "/api/matching",
    mlMatchingRoutes
);

app.use(
    "/api/matching",
    universalMatchingRoutes
);

app.use(
    "/api/connections",
    connectionRoutes
);

app.use(
    "/api/notifications",
    notificationRoutes
);

app.use(
    "/api/posts",
    postRoutes
);

app.use("/api/profile", profileRoutes);

app.use("/api/roadmap", roadmapRoutes);

app.use("/api/messages", messageRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/student/chat", studentCareerChatRoutes);

// Test API
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SICR Backend Running ðŸš€"
    });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});
