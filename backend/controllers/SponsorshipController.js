const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SponsorshipAccount =
    require("../models/SponsorshipAccount");

const SponsorshipOTP =
    require("../models/SponsorshipOTP");

const SponsorshipProfile =
    require("../models/SponsorshipProfile");

const SponsorshipRequest =
    require("../models/SponsorshipRequest");

const SponsorshipApplication =
    require("../models/SponsorshipApplication");

const {
    sendCorporateOTPEmail,
} = require("../utils/emailService");

// =====================================================
// HELPERS
// =====================================================

const JWT_SECRET = process.env.JWT_SECRET;

const hashOTP = (otp) => {
    return crypto
        .createHash("sha256")
        .update(String(otp))
        .digest("hex");
};

const generateToken = (account) => {
    return jwt.sign(
        {
            id: account._id,
            accountType: account.accountType,
            ecosystem: "sponsorship",
        },
        JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

// =====================================================
// PROFILE COMPLETION
// =====================================================

const calculateProfileCompletion = (
    data,
    accountType
) => {
    let fields = [];

    if (accountType === "sponsor") {
        fields = [
            data.companyOrProjectName,
            data.description,
            data.industry,
            data.sponsorshipTypes?.length,
            data.preferredIndustries?.length,
            data.minimumBudget,
            data.maximumBudget,
            data.targetAudience,
            data.preferredLocations?.length,
            data.conditions,
        ];
    } else {
        fields = [
            data.companyOrProjectName,
            data.description,
            data.sponsorshipPurpose,
            data.sponsorshipTypes?.length,
            data.minimumBudget,
            data.maximumBudget,
            data.targetAudience,
            data.benefits,
            data.eventOrProjectDate,
        ];
    }

    const completed = fields.filter(Boolean).length;

    return Math.round(
        (completed / fields.length) * 100
    );
};

// =====================================================
// SEND OTP
// =====================================================

const sendOTP = async (req, res) => {
    try {
        const { email, organizationName = "" } =
            req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const existingAccount =
            await SponsorshipAccount.findOne({
                email: normalizedEmail,
            });

        if (existingAccount) {
            return res.status(409).json({
                message:
                    "An account with this email already exists",
            });
        }

        const otp = crypto.randomInt(
            100000,
            1000000
        );

        const otpHash = hashOTP(otp);

        await SponsorshipOTP.deleteMany({
            email: normalizedEmail,
        });

        await SponsorshipOTP.create({
            email: normalizedEmail,
            otpHash,
            expiresAt: new Date(
                Date.now() + 10 * 60 * 1000
            ),
        });

        await sendCorporateOTPEmail(
            normalizedEmail,
            otp,
            organizationName ||
            "Sponsorship Ecosystem"
        );

        return res.status(200).json({
            message:
                "OTP sent successfully to your email",
        });
    } catch (error) {
        console.error(
            "Sponsorship Send OTP Error:",
            error
        );

        return res.status(500).json({
            message: "Failed to send OTP",
        });
    }
};

// =====================================================
// VERIFY OTP
// =====================================================

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message:
                    "Email and OTP are required",
            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const record =
            await SponsorshipOTP.findOne({
                email: normalizedEmail,
            });

        if (!record) {
            return res.status(400).json({
                message:
                    "OTP not found or expired",
            });
        }

        if (
            record.expiresAt <
            new Date()
        ) {
            await record.deleteOne();

            return res.status(400).json({
                message: "OTP has expired",
            });
        }

        if (record.attempts >= 5) {
            return res.status(429).json({
                message:
                    "Too many incorrect attempts",
            });
        }

        record.attempts += 1;

        const incomingHash =
            hashOTP(otp);

        if (
            incomingHash !==
            record.otpHash
        ) {
            await record.save();

            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

        record.verified = true;

        await record.save();

        return res.status(200).json({
            message:
                "Email verified successfully",
            verified: true,
        });
    } catch (error) {
        console.error(
            "Sponsorship Verify OTP Error:",
            error
        );

        return res.status(500).json({
            message:
                "OTP verification failed",
        });
    }
};

// =====================================================
// REGISTER
// =====================================================

const register = async (req, res) => {
    try {
        const {
            accountType,
            firstName,
            lastName,
            organizationName,
            email,
            phone,
            password,
            confirmPassword,
        } = req.body;

        if (
            !accountType ||
            !["sponsor", "seeker"].includes(
                accountType
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid sponsorship account type",
            });
        }

        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !password
        ) {
            return res.status(400).json({
                message:
                    "Please fill all required fields",
            });
        }

        if (
            password !==
            confirmPassword
        ) {
            return res.status(400).json({
                message:
                    "Passwords do not match",
            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const otpRecord =
            await SponsorshipOTP.findOne({
                email: normalizedEmail,
                verified: true,
            });

        if (!otpRecord) {
            return res.status(400).json({
                message:
                    "Please verify your email first",
            });
        }

        const existing =
            await SponsorshipAccount.findOne({
                email: normalizedEmail,
            });

        if (existing) {
            return res.status(409).json({
                message:
                    "Account already exists",
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                12
            );

        const account =
            await SponsorshipAccount.create({
                accountType,
                firstName,
                lastName,
                organizationName:
                    organizationName || "",
                email: normalizedEmail,
                phone,
                password: hashedPassword,
                emailVerified: true,
                accountStatus: "active",
            });

        await SponsorshipProfile.create({
            accountId: account._id,
            accountType,
            companyOrProjectName:
                organizationName || "",
        });

        await SponsorshipOTP.deleteMany({
            email: normalizedEmail,
        });

        const token =
            generateToken(account);

        return res.status(201).json({
            message:
                "Sponsorship account created successfully",

            token,

            account: {
                id: account._id,
                firstName:
                    account.firstName,
                lastName:
                    account.lastName,
                email: account.email,
                accountType:
                    account.accountType,
            },
        });
    } catch (error) {
        console.error(
            "Sponsorship Register Error:",
            error
        );

        return res.status(500).json({
            message:
                "Registration failed",
        });
    }
};

// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Email and password are required",
            });
        }

        const account =
            await SponsorshipAccount.findOne({
                email:
                    email.toLowerCase().trim(),
            });

        if (!account) {
            return res.status(401).json({
                message:
                    "Invalid email or password",
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                account.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                message:
                    "Invalid email or password",
            });
        }

        const token =
            generateToken(account);

        return res.status(200).json({
            message:
                "Login successful",

            token,

            account: {
                id: account._id,
                firstName:
                    account.firstName,
                lastName:
                    account.lastName,
                email: account.email,
                accountType:
                    account.accountType,
            },
        });
    } catch (error) {
        console.error(
            "Sponsorship Login Error:",
            error
        );

        return res.status(500).json({
            message:
                "Login failed",
        });
    }
};

// =====================================================
// GET ME
// =====================================================

const getMe = async (req, res) => {
    return res.status(200).json({
        account:
            req.sponsorshipAccount,
    });
};

// =====================================================
// GET PROFILE
// =====================================================

const getProfile = async (
    req,
    res
) => {
    try {
        const profile =
            await SponsorshipProfile.findOne({
                accountId:
                    req.sponsorshipAccount._id,
            });

        if (!profile) {
            return res.status(404).json({
                message:
                    "Sponsorship profile not found",
            });
        }

        return res.status(200).json({
            profile,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message:
                "Failed to fetch profile",
        });
    }
};

// =====================================================
// SAVE PROFILE
// =====================================================

const saveProfile = async (
    req,
    res
) => {
    try {
        const accountType =
            req.sponsorshipAccount
                .accountType;

        const completion =
            calculateProfileCompletion(
                req.body,
                accountType
            );

        const profile =
            await SponsorshipProfile.findOneAndUpdate(
                {
                    accountId:
                        req.sponsorshipAccount
                            ._id,
                },
                {
                    ...req.body,
                    accountId:
                        req.sponsorshipAccount
                            ._id,
                    accountType,
                    profileCompletion:
                        completion,
                    profileStatus:
                        completion >= 80
                            ? "complete"
                            : "incomplete",
                },
                {
                    new: true,
                    upsert: true,
                    runValidators: true,
                }
            );

        return res.status(200).json({
            message:
                "Profile saved successfully",
            profile,
        });
    } catch (error) {
        console.error(
            "Sponsorship Profile Error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to save profile",
        });
    }
};

// =====================================================
// CREATE REQUEST
// =====================================================

const createRequest = async (
    req,
    res
) => {
    try {
        if (
            req.sponsorshipAccount
                .accountType !==
            "seeker"
        ) {
            return res.status(403).json({
                message:
                    "Only sponsorship seekers can create requests",
            });
        }

        const request =
            await SponsorshipRequest.create({
                seekerId:
                    req.sponsorshipAccount
                        ._id,

                title:
                    req.body.title,

                description:
                    req.body.description,

                category:
                    req.body.category,

                requiredAmount:
                    req.body.requiredAmount,

                minimumAmount:
                    req.body.minimumAmount,

                maximumAmount:
                    req.body.maximumAmount,

                targetAudience:
                    req.body.targetAudience,

                location:
                    req.body.location,

                eventDate:
                    req.body.eventDate ||
                    null,

                benefits:
                    req.body.benefits,
            });

        return res.status(201).json({
            message:
                "Sponsorship request created",
            request,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message:
                "Failed to create request",
        });
    }
};

// =====================================================
// GET OPPORTUNITIES
// =====================================================

const getRequests = async (
    req,
    res
) => {
    try {
        const requests =
            await SponsorshipRequest.find({
                status: "open",
            })
                .populate(
                    "seekerId",
                    "firstName lastName organizationName"
                )
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            requests,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message:
                "Failed to fetch opportunities",
        });
    }
};

// =====================================================
// APPLY
// =====================================================

const applyForSponsorship =
    async (req, res) => {
        try {
            if (
                req.sponsorshipAccount
                    .accountType !==
                "sponsor"
            ) {
                return res.status(403).json({
                    message:
                        "Only sponsors can apply",
                });
            }

            const {
                requestId,
                proposedAmount,
                message,
            } = req.body;

            if (
                !requestId ||
                !proposedAmount
            ) {
                return res.status(400).json({
                    message:
                        "Request ID and proposed amount are required",
                });
            }

            const application =
                await SponsorshipApplication.create(
                    {
                        requestId,
                        sponsorId:
                            req.sponsorshipAccount
                                ._id,
                        proposedAmount,
                        message:
                            message || "",
                    }
                );

            return res.status(201).json({
                message:
                    "Sponsorship application submitted",
                application,
            });
        } catch (error) {
            if (
                error.code === 11000
            ) {
                return res.status(409).json({
                    message:
                        "You have already applied for this opportunity",
                });
            }

            console.error(error);

            return res.status(500).json({
                message:
                    "Application failed",
            });
        }
    };

// =====================================================
// APPLICATIONS
// =====================================================

const getApplications =
    async (req, res) => {
        try {
            let filter = {};

            if (
                req.sponsorshipAccount
                    .accountType ===
                "sponsor"
            ) {
                filter.sponsorId =
                    req.sponsorshipAccount
                        ._id;
            }

            const applications =
                await SponsorshipApplication
                    .find(filter)
                    .populate(
                        "requestId"
                    )
                    .populate(
                        "sponsorId",
                        "firstName lastName organizationName email"
                    )
                    .sort({
                        createdAt: -1,
                    });

            return res.status(200).json({
                applications,
            });
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message:
                    "Failed to fetch applications",
            });
        }
    };

// =====================================================
// DASHBOARD
// =====================================================

const getDashboard =
    async (req, res) => {
        try {
            const account =
                req.sponsorshipAccount;

            const profile =
                await SponsorshipProfile.findOne(
                    {
                        accountId:
                            account._id,
                    }
                );

            if (
                account.accountType ===
                "seeker"
            ) {
                const requests =
                    await SponsorshipRequest.find(
                        {
                            seekerId:
                                account._id,
                        }
                    );

                const requestIds =
                    requests.map(
                        (item) =>
                            item._id
                    );

                const applications =
                    await SponsorshipApplication.find(
                        {
                            requestId: {
                                $in: requestIds,
                            },
                        }
                    );

                return res.status(200).json({
                    account,
                    profile,

                    stats: {
                        activeRequests:
                            requests.filter(
                                (item) =>
                                    item.status ===
                                    "open"
                            ).length,

                        applicationsReceived:
                            applications.length,

                        shortlisted:
                            applications.filter(
                                (item) =>
                                    item.status ===
                                    "shortlisted"
                            ).length,

                        activeSponsorships:
                            applications.filter(
                                (item) =>
                                    item.status ===
                                    "accepted"
                            ).length,
                    },
                });
            }

            const applications =
                await SponsorshipApplication.find(
                    {
                        sponsorId:
                            account._id,
                    }
                );

            const opportunities =
                await SponsorshipRequest.countDocuments(
                    {
                        status: "open",
                    }
                );

            return res.status(200).json({
                account,
                profile,

                stats: {
                    availableOpportunities:
                        opportunities,

                    applicationsSent:
                        applications.length,

                    shortlisted:
                        applications.filter(
                            (item) =>
                                item.status ===
                                "shortlisted"
                        ).length,

                    activeSponsorships:
                        applications.filter(
                            (item) =>
                                item.status ===
                                "accepted"
                        ).length,

                    totalProposed:
                        applications.reduce(
                            (
                                total,
                                item
                            ) =>
                                total +
                                Number(
                                    item.proposedAmount ||
                                    0
                                ),
                            0
                        ),
                },
            });
        } catch (error) {
            console.error(
                "Sponsorship Dashboard Error:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to load dashboard",
            });
        }
    };

module.exports = {
    sendOTP,
    verifyOTP,
    register,
    login,
    getMe,
    getProfile,
    saveProfile,
    createRequest,
    getRequests,
    applyForSponsorship,
    getApplications,
    getDashboard,
};