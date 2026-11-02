const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const InvestorFunder = require("../models/InvestorFunder");
const InvestorFunderOTP = require("../models/InvestorFunderOTP");

const generateInvestorFunderToken = require(
    "../utils/generateInvestorFunderToken"
);

// =====================================================
// EMAIL SERVICE
// =====================================================

const {
    sendInvestorFunderOTP,
} = require("../utils/emailService");

// =====================================================
// HELPER - GENERATE OTP
// =====================================================

const generateOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

// =====================================================
// SEND OTP
// POST /api/investor-funder/send-otp
// =====================================================

const sendOTP = async (req, res) => {
    try {
        const {
            email,
            firstName,
            lastName,
            phone,
        } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const normalizedEmail = email
            .toLowerCase()
            .trim();

        const existingUser =
            await InvestorFunder.findOne({
                email: normalizedEmail,
            });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message:
                    "Investor/Funder account already exists",
            });
        }

        const otp = generateOTP();

        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        await InvestorFunderOTP.deleteMany({
            email: normalizedEmail,
            purpose: "REGISTRATION",
        });

        await InvestorFunderOTP.create({
            email: normalizedEmail,
            otp,
            purpose: "REGISTRATION",
            expiresAt,
        });

        if (typeof sendInvestorFunderOTP === "function") {
            await sendInvestorFunderOTP(
                normalizedEmail,
                otp,
                firstName,
                lastName
            );
        } else {
            console.log(
                "Investor/Funder OTP:",
                otp
            );
        }

        return res.status(200).json({
            success: true,
            message:
                "OTP sent successfully to your email",
        });
    } catch (error) {
        console.error(
            "Send Investor/Funder OTP Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to send OTP",
        });
    }
};

// =====================================================
// VERIFY OTP
// POST /api/investor-funder/verify-otp
// =====================================================

const verifyOTP = async (req, res) => {
    try {
        const {
            email,
            otp,
            firstName,
            lastName,
            phone,
            password,
        } = req.body;

        if (
            !email ||
            !otp ||
            !firstName ||
            !lastName ||
            !phone ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "All required registration fields are required",
            });
        }

        const normalizedEmail = email
            .toLowerCase()
            .trim();

        const otpRecord =
            await InvestorFunderOTP.findOne({
                email: normalizedEmail,
                purpose: "REGISTRATION",
                verified: false,
            }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message:
                    "OTP not found or already used",
            });
        }

        if (
            new Date() >
            new Date(otpRecord.expiresAt)
        ) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired",
            });
        }

        if (otpRecord.attempts >= 5) {
            return res.status(400).json({
                success: false,
                message:
                    "Maximum OTP attempts exceeded",
            });
        }

        if (otpRecord.otp !== otp) {
            otpRecord.attempts += 1;

            await otpRecord.save();

            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        const existingUser =
            await InvestorFunder.findOne({
                email: normalizedEmail,
            });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message:
                    "Investor/Funder account already exists",
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 12);

        const investorFunder =
            await InvestorFunder.create({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: normalizedEmail,
                phone: phone.trim(),
                password: hashedPassword,

                role: "INVESTOR_FUNDER",

                isEmailVerified: true,

                status: "ACTIVE",

                profileCompleted: false,

                profileCompletionPercentage: 0,
            });

        otpRecord.verified = true;

        await otpRecord.save();

        const token =
            generateInvestorFunderToken(
                investorFunder
            );

        return res.status(201).json({
            success: true,
            message:
                "Investor/Funder registered successfully",
            token,
            investorFunder: {
                id: investorFunder._id,
                firstName:
                    investorFunder.firstName,
                lastName:
                    investorFunder.lastName,
                email:
                    investorFunder.email,
                phone:
                    investorFunder.phone,
                role:
                    investorFunder.role,
                profileCompleted:
                    investorFunder.profileCompleted,
            },
        });
    } catch (error) {
        console.error(
            "Investor/Funder Verify OTP Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to verify OTP",
        });
    }
};

// =====================================================
// LOGIN
// POST /api/investor-funder/login
// =====================================================

const login = async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required",
            });
        }

        const normalizedEmail = email
            .toLowerCase()
            .trim();

        const investorFunder =
            await InvestorFunder.findOne({
                email: normalizedEmail,
            });

        if (!investorFunder) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }

        if (
            investorFunder.status ===
            "BLOCKED"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Your account has been blocked",
            });
        }

        if (
            investorFunder.status ===
            "SUSPENDED"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Your account has been suspended",
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                investorFunder.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }

        investorFunder.lastLogin =
            new Date();

        await investorFunder.save();

        const token =
            generateInvestorFunderToken(
                investorFunder
            );

        return res.status(200).json({
            success: true,
            message:
                "Login successful",

            token,

            investorFunder: {
                id:
                    investorFunder._id,
                firstName:
                    investorFunder.firstName,
                lastName:
                    investorFunder.lastName,
                email:
                    investorFunder.email,
                phone:
                    investorFunder.phone,
                role:
                    investorFunder.role,
                profileType:
                    investorFunder.profileType,
                profileCompleted:
                    investorFunder.profileCompleted,
                profileCompletionPercentage:
                    investorFunder.profileCompletionPercentage,
                status:
                    investorFunder.status,
            },
        });
    } catch (error) {
        console.error(
            "Investor/Funder Login Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Login failed",
        });
    }
};

// =====================================================
// GET PROFILE
// GET /api/investor-funder/profile
// =====================================================

const getProfile = async (req, res) => {
    try {
        const investorFunder =
            await InvestorFunder.findById(
                req.investorFunder._id
            ).select("-password");

        return res.status(200).json({
            success: true,
            investorFunder,
        });
    } catch (error) {
        console.error(
            "Get Investor/Funder Profile Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch profile",
        });
    }
};

// =====================================================
// UPDATE PROFILE
// PUT /api/investor-funder/profile
// =====================================================

const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "profileType",
            "fundingRole",
            "fundingConditions",
            "profilePhoto",
            "gender",
            "dateOfBirth",

            "country",
            "state",
            "city",
            "address",

            "organizationName",
            "organizationType",
            "designation",
            "website",
            "organizationDescription",

            "fundingTypes",
            "preferredStartupStages",

            "industries",
            "sectors",

            "minimumInvestment",
            "maximumInvestment",
            "preferredCurrency",

            "preferredCountries",
            "preferredRegions",

            "yearsOfExperience",
            "expertise",
            "bio",

            "portfolioCount",
            "previousInvestments",

            "riskPreference",
            "investmentFrequency",
            "businessModels",
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (
                req.body[field] !== undefined
            ) {
                updates[field] =
                    req.body[field];
            }
        });

        const updatedInvestorFunder =
            await InvestorFunder.findByIdAndUpdate(
                req.investorFunder._id,
                updates,
                {
                    new: true,
                    runValidators: true,
                }
            ).select("-password");

        if (!updatedInvestorFunder) {
            return res.status(404).json({
                success: false,
                message:
                    "Investor/Funder not found",
            });
        }

        const percentage =
            calculateProfileCompletion(
                updatedInvestorFunder
            );

        updatedInvestorFunder.profileCompletionPercentage =
            percentage;

        updatedInvestorFunder.profileCompleted =
            percentage >= 100;

        await updatedInvestorFunder.save();

        return res.status(200).json({
            success: true,
            message:
                "Profile updated successfully",
            profileCompletionPercentage:
                percentage,
            profileCompleted:
                updatedInvestorFunder.profileCompleted,
            investorFunder:
                updatedInvestorFunder,
        });
    } catch (error) {
        console.error(
            "Update Investor/Funder Profile Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update profile",
            error: error.message,
        });
    }
};

// =====================================================
// PROFILE COMPLETION CALCULATOR
// =====================================================

// =====================================================
// PROFILE COMPLETION CALCULATOR
// 5 QUESTIONS = 100%
// =====================================================

const calculateProfileCompletion = (profile) => {

    let completed = 0;

    // =====================================================
    // QUESTION 1
    // Describe your role in funding or investing
    // Frontend field: bio
    // =====================================================

    if (
        profile.bio &&
        profile.bio.trim() !== ""
    ) {
        completed++;
    }

    // =====================================================
    // QUESTION 2
    // What type of funding do you provide?
    // Frontend field: fundingTypes
    // =====================================================

    if (
        Array.isArray(profile.fundingTypes) &&
        profile.fundingTypes.length > 0
    ) {
        completed++;
    }

    // =====================================================
    // QUESTION 3
    // Industries / Business Areas
    // Frontend field: industries
    // =====================================================

    if (
        Array.isArray(profile.industries) &&
        profile.industries.length > 0
    ) {
        completed++;
    }

    // =====================================================
    // QUESTION 4
    // Funding Range
    // Frontend fields:
    // minimumInvestment
    // maximumInvestment
    // preferredCurrency
    // =====================================================

    const hasMinimum =
        profile.minimumInvestment !== undefined &&
        profile.minimumInvestment !== null &&
        profile.minimumInvestment !== "";

    const hasMaximum =
        profile.maximumInvestment !== undefined &&
        profile.maximumInvestment !== null &&
        profile.maximumInvestment !== "";

    const hasCurrency =
        profile.preferredCurrency &&
        profile.preferredCurrency.trim() !== "";

    if (
        hasMinimum &&
        hasMaximum &&
        hasCurrency
    ) {
        completed++;
    }

    // =====================================================
    // QUESTION 5
    // Funding decision conditions
    // Frontend field: investmentConditions
    //
    // NOTE:
    // We store this in fundingConditions because
    // InvestorFunder schema already has that field.
    // =====================================================

    if (
        profile.fundingConditions &&
        profile.fundingConditions.trim() !== ""
    ) {
        completed++;
    }

    // =====================================================
    // CALCULATE
    // =====================================================

    return Math.round(
        (completed / 5) * 100
    );
};

// =====================================================
// PROFILE STATUS
// GET /api/investor-funder/profile/status
// =====================================================

const getProfileStatus = async (
    req,
    res
) => {
    try {
        const investorFunder =
            await InvestorFunder.findById(
                req.investorFunder._id
            ).select("-password");

        const percentage =
            calculateProfileCompletion(
                investorFunder
            );

        investorFunder.profileCompletionPercentage =
            percentage;

        investorFunder.profileCompleted =
            percentage >= 100;

        await investorFunder.save();

        return res.status(200).json({
            success: true,

            profileCompleted:
                investorFunder.profileCompleted,

            profileCompletionPercentage:
                percentage,

            status:
                investorFunder.status,
        });
    } catch (error) {
        console.error(
            "Profile Status Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch profile status",
        });
    }
};

// =====================================================
// DASHBOARD
// GET /api/investor-funder/dashboard
// =====================================================

// =====================================================
// DASHBOARD
// GET /api/investor-funder/dashboard
// =====================================================

const dashboard = async (req, res) => {
    try {
        const investorFunder =
            await InvestorFunder.findById(
                req.investorFunder._id
            ).select("-password");

        if (!investorFunder) {
            return res.status(404).json({
                success: false,
                message:
                    "Investor/Funder not found",
            });
        }

        // =================================================
        // ALWAYS RECALCULATE PROFILE COMPLETION
        // =================================================

        const percentage =
            calculateProfileCompletion(
                investorFunder
            );

        investorFunder.profileCompletionPercentage =
            percentage;

        investorFunder.profileCompleted =
            percentage >= 100;

        await investorFunder.save();

        return res.status(200).json({
            success: true,

            message:
                "Investor/Funder dashboard",

            investorFunder: {
                id:
                    investorFunder._id,

                firstName:
                    investorFunder.firstName,

                lastName:
                    investorFunder.lastName,

                name:
                    `${investorFunder.firstName} ${investorFunder.lastName}`,

                email:
                    investorFunder.email,

                phone:
                    investorFunder.phone,

                role:
                    investorFunder.role,

                profileType:
                    investorFunder.profileType,

                profileCompleted:
                    investorFunder.profileCompleted,

                profileCompletionPercentage:
                    investorFunder.profileCompletionPercentage,

                verificationStatus:
                    investorFunder.verificationStatus,

                status:
                    investorFunder.status,
            },
        });

    } catch (error) {

        console.error(
            "Investor/Funder Dashboard Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load dashboard",
        });
    }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    sendOTP,
    verifyOTP,
    login,
    getProfile,
    updateProfile,
    getProfileStatus,
    dashboard,
};