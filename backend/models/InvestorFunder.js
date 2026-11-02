const mongoose = require("mongoose");

const investorFunderSchema = new mongoose.Schema(
    {
        // =====================================================
        // BASIC ACCOUNT INFORMATION
        // =====================================================

        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        // =====================================================
        // ROLE
        // =====================================================

        role: {
            type: String,
            default: "INVESTOR_FUNDER",
            enum: ["INVESTOR_FUNDER"],
        },

        profileType: {
            type: String,
            enum: [
                "ANGEL_INVESTOR",
                "VENTURE_CAPITAL",
                "INDIVIDUAL_INVESTOR",
                "CORPORATE_INVESTOR",
                "FAMILY_OFFICE",
                "GOVERNMENT_FUNDER",
                "INSTITUTIONAL_FUNDER",
                "GRANT_PROVIDER",
                "BANK_FINANCIAL_INSTITUTION",
                "CROWDFUNDING",
                "OTHER",
            ],
        },

        // =====================================================
        // PROFILE
        // =====================================================

        profilePhoto: {
            type: String,
            default: "",
        },

        gender: {
            type: String,
            enum: ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"],
        },

        dateOfBirth: {
            type: Date,
        },

        // =====================================================
        // LOCATION
        // =====================================================

        country: {
            type: String,
            trim: true,
        },

        state: {
            type: String,
            trim: true,
        },

        city: {
            type: String,
            trim: true,
        },

        address: {
            type: String,
            trim: true,
        },

        // =====================================================
        // ORGANIZATION
        // =====================================================

        organizationName: {
            type: String,
            trim: true,
        },

        organizationType: {
            type: String,
            trim: true,
        },

        designation: {
            type: String,
            trim: true,
        },

        website: {
            type: String,
            trim: true,
        },

        organizationDescription: {
            type: String,
            trim: true,
        },

        // =====================================================
        // INVESTMENT / FUNDING INFORMATION
        // =====================================================

        fundingRole: {
            type: String,
            trim: true,
        },

        fundingConditions: {
            type: String,
            trim: true,
        },

        fundingTypes: [
            {
                type: String,
                enum: [
                    "EQUITY",
                    "DEBT",
                    "GRANT",
                    "CONVERTIBLE_NOTE",
                    "SAFE",
                    "REVENUE_BASED",
                    "LOAN",
                    "OTHER",
                ],
            },
        ],

        preferredStartupStages: [
            {
                type: String,
                enum: [
                    "IDEA",
                    "PRE_SEED",
                    "SEED",
                    "EARLY_STAGE",
                    "GROWTH",
                    "SERIES_A",
                    "SERIES_B",
                    "SERIES_C",
                    "LATE_STAGE",
                    "ANY_STAGE",
                ],
            },
        ],

        industries: [
            {
                type: String,
                trim: true,
            },
        ],

        sectors: [
            {
                type: String,
                trim: true,
            },
        ],

        minimumInvestment: {
            type: Number,
            min: 0,
        },

        maximumInvestment: {
            type: Number,
            min: 0,
        },

        preferredCurrency: {
            type: String,
            default: "USD",
            trim: true,
        },

        // =====================================================
        // GEOGRAPHIC INVESTMENT PREFERENCE
        // =====================================================

        preferredCountries: [
            {
                type: String,
                trim: true,
            },
        ],

        preferredRegions: [
            {
                type: String,
                trim: true,
            },
        ],

        // =====================================================
        // EXPERIENCE & EXPERTISE
        // =====================================================

        yearsOfExperience: {
            type: Number,
            min: 0,
        },

        expertise: [
            {
                type: String,
                trim: true,
            },
        ],

        bio: {
            type: String,
            trim: true,
        },

        // =====================================================
        // PORTFOLIO
        // =====================================================

        portfolioCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        previousInvestments: [
            {
                startupName: {
                    type: String,
                    trim: true,
                },

                industry: {
                    type: String,
                    trim: true,
                },

                investmentAmount: {
                    type: Number,
                    min: 0,
                },

                investmentYear: {
                    type: Number,
                },

                website: {
                    type: String,
                    trim: true,
                },
            },
        ],

        // =====================================================
        // INVESTMENT PREFERENCES
        // =====================================================

        riskPreference: {
            type: String,
            enum: [
                "LOW",
                "MODERATE",
                "HIGH",
                "VERY_HIGH",
            ],
        },

        investmentFrequency: {
            type: String,
            enum: [
                "OCCASIONAL",
                "QUARTERLY",
                "MONTHLY",
                "FREQUENT",
            ],
        },

        businessModels: [
            {
                type: String,
                trim: true,
            },
        ],

        // =====================================================
        // VERIFICATION
        // =====================================================

        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        isPhoneVerified: {
            type: Boolean,
            default: false,
        },

        isIdentityVerified: {
            type: Boolean,
            default: false,
        },

        isOrganizationVerified: {
            type: Boolean,
            default: false,
        },

        verificationStatus: {
            type: String,
            enum: [
                "PENDING",
                "UNDER_REVIEW",
                "VERIFIED",
                "REJECTED",
            ],
            default: "PENDING",
        },

        // =====================================================
        // PROFILE COMPLETION
        // =====================================================

        profileCompleted: {
            type: Boolean,
            default: false,
        },

        profileCompletionPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        // =====================================================
        // ACCOUNT STATUS
        // =====================================================

        status: {
            type: String,
            enum: [
                "PENDING",
                "ACTIVE",
                "SUSPENDED",
                "BLOCKED",
                "REJECTED",
            ],
            default: "PENDING",
        },

        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "InvestorFunder",
    investorFunderSchema
);