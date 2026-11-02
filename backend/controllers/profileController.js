
const StartupAccount = require("../models/StartupAccount");
const Investor = require("../models/Investor");
const InvestorFunder = require("../models/InvestorFunder");
const MentorAccount = require("../models/MentorAccount");
const Mentor = require("../models/Mentor");

// =====================================================
// HELPERS
// =====================================================

const getInvestorModel = (identity) => {
    const tokenRole = String(
        identity?.token?.role || ""
    ).trim().toUpperCase();

    if (tokenRole === "INVESTOR_FUNDER") {
        return InvestorFunder;
    }

    return Investor;
};

const getInvestorName = (investor, model) => {
    if (model === InvestorFunder) {
        return {
            firstName: investor.firstName || "",
            lastName: investor.lastName || "",
        };
    }

    const parts = String(investor.fullName || "")
        .trim()
        .split(/\s+/);

    return {
        firstName: parts.shift() || "",
        lastName: parts.join(" "),
    };
};

const makeProfile = (account, ecosystem, model) => {
    let names;

    if (
        ecosystem === "STARTUP" ||
        ecosystem === "MENTOR"
    ) {
        names = {
            firstName: account.firstName || "",
            lastName: account.lastName || "",
        };
    } else {
        names = getInvestorName(account, model);
    }

    return {
        id: account._id,
        ecosystem,
        firstName: names.firstName,
        lastName: names.lastName,
        email: account.email || "",
        phone: account.phone || "",
        profilePhoto: account.profilePhoto || null,
    };
};

// Find Mentor in the correct collection.
// Mentor is the primary model used by OTP registration.
const findMentorAccount = async (mentorId) => {
    let mentor = await Mentor.findById(mentorId);

    if (mentor) {
        return {
            mentor,
            model: Mentor,
        };
    }

    mentor = await MentorAccount.findById(mentorId);

    if (mentor) {
        return {
            mentor,
            model: MentorAccount,
        };
    }

    return {
        mentor: null,
        model: null,
    };
};
// =====================================================
// GET PROFILE
// GET /api/profile
// =====================================================

const getProfile = async (req, res) => {
    try {
        const identity = req.connectionIdentity;

        if (!identity) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        // =============================================
        // STARTUP
        // =============================================

        if (identity.type === "STARTUP") {
            const account = await StartupAccount
                .findById(identity.id)
                .select("-password");

            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: "Startup account not found",
                });
            }

            return res.status(200).json({
                success: true,
                profile: makeProfile(
                    account,
                    "STARTUP",
                    StartupAccount
                ),
            });
        }

        // =============================================
        // INVESTOR
        // =============================================

        if (identity.type === "INVESTOR") {
            const InvestorModel = getInvestorModel(identity);

            const investor = await InvestorModel
                .findById(identity.id)
                .select("-password");

            if (!investor) {
                return res.status(404).json({
                    success: false,
                    message:
                        InvestorModel === InvestorFunder
                            ? "Investor/Funder account not found"
                            : "Investor account not found",
                });
            }

            return res.status(200).json({
                success: true,
                profile: makeProfile(
                    investor,
                    "INVESTOR",
                    InvestorModel
                ),
            });
        }

        // =============================================
        // MENTOR
        // =============================================

        if (identity.type === "MENTOR") {
            const result = await findMentorAccount(identity.id);

            if (!result.mentor) {
                return res.status(404).json({
                    success: false,
                    message: "Mentor account not found",
                });
            }

            return res.status(200).json({
                success: true,
                profile: makeProfile(
                    result.mentor,
                    "MENTOR",
                    result.model
                ),
            });
        }

        return res.status(400).json({
            success: false,
            message:
                `${identity.type} profile is not implemented yet`,
        });

    } catch (error) {
        console.error("GET PROFILE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
        });
    }
};

// =====================================================
// UPDATE PROFILE
// PUT /api/profile
// =====================================================

const updateProfile = async (req, res) => {
    try {
        const identity = req.connectionIdentity;

        if (!identity) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const {
            firstName,
            lastName,
            email,
            phone,
            profilePhoto,
        } = req.body;

        if (
            typeof firstName !== "string" ||
            !firstName.trim() ||
            typeof lastName !== "string" ||
            !lastName.trim() ||
            typeof email !== "string" ||
            !email.trim() ||
            typeof phone !== "string" ||
            !phone.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "First name, last name, email and phone are required",
            });
        }

        const normalizedEmail = email
            .trim()
            .toLowerCase();

        // =============================================
        // STARTUP
        // =============================================

        if (identity.type === "STARTUP") {
            const account = await StartupAccount
                .findById(identity.id);

            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: "Startup account not found",
                });
            }

            const existingEmail = await StartupAccount.findOne({
                email: normalizedEmail,
                _id: { $ne: identity.id },
            });

            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    message: "This email is already registered",
                });
            }

            account.firstName = firstName.trim();
            account.lastName = lastName.trim();
            account.email = normalizedEmail;
            account.phone = phone.trim();

            if (
                profilePhoto === null ||
                profilePhoto === ""
            ) {
                account.profilePhoto = null;
            } else if (typeof profilePhoto === "string") {
                account.profilePhoto = profilePhoto;
            }

            await account.save();

            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                profile: makeProfile(
                    account,
                    "STARTUP",
                    StartupAccount
                ),
            });
        }

        // =============================================
        // INVESTOR / INVESTOR-FUNDER
        // =============================================

        if (identity.type === "INVESTOR") {
            const InvestorModel = getInvestorModel(identity);

            const investor = await InvestorModel
                .findById(identity.id);

            if (!investor) {
                return res.status(404).json({
                    success: false,
                    message:
                        InvestorModel === InvestorFunder
                            ? "Investor/Funder account not found"
                            : "Investor account not found",
                });
            }

            const existingEmail = await InvestorModel.findOne({
                email: normalizedEmail,
                _id: { $ne: identity.id },
            });

            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    message: "This email is already registered",
                });
            }

            if (InvestorModel === InvestorFunder) {
                investor.firstName = firstName.trim();
                investor.lastName = lastName.trim();
            } else {
                investor.fullName =
                    `${firstName.trim()} ${lastName.trim()}`;
            }

            investor.email = normalizedEmail;
            investor.phone = phone.trim();

            if (
                profilePhoto === null ||
                profilePhoto === ""
            ) {
                investor.profilePhoto = null;
            } else if (typeof profilePhoto === "string") {
                investor.profilePhoto = profilePhoto;
            }

            await investor.save();

            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                profile: makeProfile(
                    investor,
                    "INVESTOR",
                    InvestorModel
                ),
            });
        }

        // =============================================
        // MENTOR
        // =============================================

        if (identity.type === "MENTOR") {
            const result = await findMentorAccount(identity.id);

            const mentor = result.mentor;
            const MentorModel = result.model;

            if (!mentor) {
                return res.status(404).json({
                    success: false,
                    message: "Mentor account not found",
                });
            }

            // Check email uniqueness across both Mentor collections.
            const existingMentorEmail = await Mentor.findOne({
                email: normalizedEmail,
                _id: { $ne: identity.id },
            });

            const existingMentorAccountEmail =
                await MentorAccount.findOne({
                    email: normalizedEmail,
                    _id: { $ne: identity.id },
                });

            if (
                existingMentorEmail ||
                existingMentorAccountEmail
            ) {
                return res.status(409).json({
                    success: false,
                    message: "This email is already registered",
                });
            }

            mentor.firstName = firstName.trim();
            mentor.lastName = lastName.trim();

            mentor.email = normalizedEmail;
            mentor.phone = phone.trim();

            mentor.fullName =
                `${firstName.trim()} ${lastName.trim()}`;

            if (
                profilePhoto === null ||
                profilePhoto === ""
            ) {
                mentor.profilePhoto = null;
            } else if (typeof profilePhoto === "string") {
                mentor.profilePhoto = profilePhoto;
            }

            await mentor.save();

            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                profile: makeProfile(
                    mentor,
                    "MENTOR",
                    MentorModel
                ),
            });
        }

        return res.status(400).json({
            success: false,
            message:
                `${identity.type} profile is not implemented yet`,
        });

    } catch (error) {
        console.error("UPDATE PROFILE ERROR:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This email is already registered",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
};
