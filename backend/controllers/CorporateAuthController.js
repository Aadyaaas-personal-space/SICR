const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const CorporateAccount = require("../models/CorporateAccount");


// =====================================================
// CORPORATE REGISTER
// =====================================================

const registerCorporate = async (req, res) => {

    try {

        const {
            companyName,
            officialEmail,
            phone,
            password,
        } = req.body;


        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (
            !companyName ||
            !officialEmail ||
            !phone ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Company name, official email, phone and password are required",

            });

        }


        const normalizedEmail =
            officialEmail.toLowerCase().trim();


        // -------------------------------------------------
        // CHECK EXISTING ACCOUNT
        // -------------------------------------------------

        const existingCorporate =
            await CorporateAccount.findOne({

                officialEmail:
                    normalizedEmail,

            });


        if (existingCorporate) {

            if (existingCorporate.emailVerified) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Company email is already registered",

                });

            }

            // Allow an unverified account to continue
            // with OTP verification.

            existingCorporate.companyName =
                companyName.trim();

            existingCorporate.phone =
                phone.trim();

            existingCorporate.password =
                await bcrypt.hash(password, 10);

            existingCorporate.accountStatus =
                "pending";

            await existingCorporate.save();


            return res.status(200).json({

                success: true,

                message:
                    "Corporate registration updated. Please verify your email.",

                email:
                    normalizedEmail,

            });

        }


        // -------------------------------------------------
        // HASH PASSWORD
        // -------------------------------------------------

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // -------------------------------------------------
        // CREATE CORPORATE ACCOUNT
        // -------------------------------------------------

        const corporate =
            await CorporateAccount.create({

                companyName:
                    companyName.trim(),

                officialEmail:
                    normalizedEmail,

                phone:
                    phone.trim(),

                password:
                    hashedPassword,

                website:
                    req.body.website?.trim() || "",

                location:
                    req.body.location?.trim() || "",

                companyType:
                    req.body.companyType || "",

                emailVerified:
                    false,

                accountStatus:
                    "pending",

            });


        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        return res.status(201).json({

            success: true,

            message:
                "Corporate account created successfully. Please verify your official email.",

            email:
                corporate.officialEmail,

            corporateId:
                corporate._id,

        });

    } catch (error) {

        console.error(
            "Corporate Registration Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Corporate registration failed",

            error:
                error.message,

        });

    }
};

// =====================================================
// CORPORATE LOGIN
// =====================================================

const loginCorporate = async (req, res) => {

    try {

        const {
            officialEmail,
            password,
        } = req.body;


        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!officialEmail || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Official email and password are required",

            });

        }


        const normalizedEmail =
            officialEmail.toLowerCase().trim();


        // -------------------------------------------------
        // FIND ACCOUNT
        // -------------------------------------------------

        const corporate =
            await CorporateAccount.findOne({

                officialEmail:
                    normalizedEmail,

            });


        if (!corporate) {

            return res.status(404).json({

                success: false,

                message:
                    "Corporate account not found",

            });

        }


        // -------------------------------------------------
        // EMAIL VERIFICATION
        // -------------------------------------------------

        if (!corporate.emailVerified) {

            return res.status(403).json({

                success: false,

                message:
                    "Please verify your official company email first",

            });

        }


        // -------------------------------------------------
        // ACCOUNT STATUS
        // -------------------------------------------------

        if (
            corporate.accountStatus &&
            corporate.accountStatus !== "active"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    `Account is ${corporate.accountStatus}`,

            });

        }


        // -------------------------------------------------
        // PASSWORD
        // -------------------------------------------------

        const passwordMatch =
            await bcrypt.compare(
                password,
                corporate.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid password",

            });

        }


        // -------------------------------------------------
        // JWT
        // -------------------------------------------------

        const token =
            jwt.sign(

                {
                    id:
                        corporate._id,

                    corporateId:
                        corporate._id,

                    officialEmail:
                        corporate.officialEmail,

                    companyName:
                        corporate.companyName,

                    role:
                        "corporate",
                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "7d",
                }

            );


        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "Corporate login successful",

            token,

            corporate: {

                id:
                    corporate._id,

                companyName:
                    corporate.companyName,

                officialEmail:
                    corporate.officialEmail,

                emailVerified:
                    corporate.emailVerified,

                accountStatus:
                    corporate.accountStatus,

            },

        });

    } catch (error) {

        console.error(
            "Corporate Login Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Corporate login failed",

            error:
                error.message,

        });

    }
};


// =====================================================
// GET CORPORATE ME
// =====================================================

const getCorporateMe = async (
    req,
    res
) => {

    try {

        const corporate =
            await CorporateAccount.findById(
                req.corporate.id
            ).select("-password");


        if (!corporate) {

            return res.status(404).json({

                success: false,

                message:
                    "Corporate account not found",

            });

        }


        return res.status(200).json({

            success: true,

            corporate,

        });

    } catch (error) {

        console.error(
            "Get Corporate Me Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch corporate account",

        });

    }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    registerCorporate,

    loginCorporate,

    getCorporateMe,

};