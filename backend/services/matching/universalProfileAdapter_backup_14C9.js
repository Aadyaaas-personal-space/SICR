const StartupProfile = require("../../models/StartupProfile");
const InvestorFunder = require("../../models/InvestorFunder");
const MentorProfile = require("../../models/MentorProfile");
const CorporateProfile = require("../../models/CorporateProfile");
const PartnershipProfile = require("../../models/PartnershipProfile");
const SponsorshipProfile = require("../../models/SponsorshipProfile");
const TBridgeProfile = require("../../models/TBridge/TBridgeProfile");

// ============================================================
// HELPERS
// ============================================================

const clean = (value) => {
    if (value === undefined || value === null) {
        return "";
    }

    return String(value)
        .trim()
        .replace(/\s+/g, " ");
};

const arrayValues = (value) => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map(clean)
        .filter(Boolean);
};

const unique = (values) => {
    return [...new Set(
        values
            .map(clean)
            .filter(Boolean)
    )];
};

const joinValues = (...values) => {
    const result = [];

    values.forEach((value) => {
        if (Array.isArray(value)) {
            result.push(...arrayValues(value));
        } else if (value !== undefined && value !== null) {
            const cleaned = clean(value);

            if (cleaned) {
                result.push(cleaned);
            }
        }
    });

    return unique(result);
};

const buildSearchText = (profile) => {
    return [
        profile.name,
        profile.title,
        profile.organization,
        profile.role,
        profile.domain,
        profile.industries.join(" "),
        profile.skills.join(" "),
        profile.expertise.join(" "),
        profile.needs.join(" "),
        profile.offers.join(" "),
        profile.interests.join(" "),
        profile.goals.join(" "),
        profile.bio,
        profile.location,
        profile.ecosystem
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
};

// ============================================================
// NORMALIZERS
// ============================================================

const normalizeStartup = (profile) => {
    const normalized = {
        id: profile._id,

        ecosystem: "STARTUP",

        role: clean(profile.role) || "FOUNDER",

        name: clean(profile.email),

        title: clean(profile.currentPosition),

        organization: "",

        domain: "",

        location: "",

        industries: [],

        skills: [],

        expertise: [],

        needs: joinValues(
            profile.currentNeeds
        ),

        offers: joinValues(
            profile.existingResources
        ),

        interests: joinValues(
            profile.connectionInterests,
            profile.opportunityInterests
        ),

        goals: joinValues(
            profile.plannedToBuild
        ),

        bio: [
            profile.currentPosition,
            profile.plannedToBuild,
            profile.existingResources,
            profile.currentNeeds,
            profile.connectionInterests,
            profile.opportunityInterests
        ]
            .map(clean)
            .filter(Boolean)
            .join(" "),

        profileCompletion:
            Number(profile.profileCompletion) || 0,

        profileStatus:
            clean(profile.profileStatus).toUpperCase()
    };

    normalized.searchText =
        buildSearchText(normalized);

    return normalized;
};

const normalizeInvestor = (profile) => {
    const normalized = {
        id: profile._id,

        ecosystem: "INVESTOR",

        role:
            clean(profile.profileType) ||
            "INVESTOR_FUNDER",

        name:
            [
                profile.firstName,
                profile.lastName
            ]
                .map(clean)
                .filter(Boolean)
                .join(" ") ||
            clean(profile.organizationName) ||
            clean(profile.email),

        title: clean(profile.designation),

        organization:
            clean(profile.organizationName),

        domain: joinValues(
            profile.industries,
            profile.sectors
        ).join(", "),

        location:
            [
                profile.city,
                profile.state,
                profile.country
            ]
                .map(clean)
                .filter(Boolean)
                .join(", "),

        industries:
            joinValues(
                profile.industries,
                profile.sectors
            ),

        skills: [],

        expertise:
            joinValues(profile.expertise),

        needs: [],

        offers:
            joinValues(
                profile.fundingRole,
                profile.fundingConditions,
                profile.fundingTypes
            ),

        interests:
            joinValues(
                profile.preferredStartupStages,
                profile.businessModels,
                profile.preferredCountries,
                profile.preferredRegions,
                profile.riskPreference
            ),

        goals: [],

        bio: clean(profile.bio),

        profileCompletion:
            Number(profile.profileCompletionPercentage) || 0,

        profileStatus:
            profile.profileCompleted
                ? "COMPLETED"
                : "INCOMPLETE"
    };

    normalized.searchText =
        buildSearchText(normalized);

    return normalized;
};

const normalizeMentor = (profile) => {
    const normalized = {
        id: profile._id,

        ecosystem: "MENTOR",

        role:
            clean(profile.mentorType) ||
            "MENTOR",

        name:
            clean(profile.organization) ||
            clean(profile.email),

        title:
            clean(profile.currentPosition),

        organization:
            clean(profile.organization),

        domain:
            joinValues(
                profile.industries,
                profile.areasOfExpertise
            ).join(", "),

        location:
            [
                profile.location,
                profile.geography
            ]
                .map(clean)
                .filter(Boolean)
                .join(", "),

        industries:
            joinValues(
                profile.industries
            ),

        skills:
            joinValues(
                profile.skills
            ),

        expertise:
            joinValues(
                profile.areasOfExpertise,
                profile.mentorshipAreas
            ),

        needs: [],

        offers:
            joinValues(
                profile.supportOffered,
                profile.mentorshipAreas
            ),

        interests:
            joinValues(
                profile.interestedIn,
                profile.preferredStartupStages,
                profile.mentorshipMode
            ),

        goals: [],

        bio: clean(profile.bio),

        profileCompletion:
            Number(profile.profileCompletionPercentage) || 0,

        profileStatus:
            profile.profileCompleted
                ? "COMPLETED"
                : clean(profile.profileStatus).toUpperCase()
    };

    normalized.searchText =
        buildSearchText(normalized);

    return normalized;
};

const normalizeCorporate = (profile) => {
    const normalized = {
        id: profile._id,

        ecosystem: "CORPORATE",

        role:
            joinValues(
                profile.ecosystemRole
            ).join(", ") ||
            "CORPORATE",

        name:
            clean(profile.companyName) ||
            clean(profile.email),

        title: "",

        organization:
            clean(profile.companyName),

        domain:
            clean(profile.industryDomain),

        location: "",

        industries:
            joinValues(
                profile.industryDomain
            ),

        skills: [],

        expertise: [],

        needs:
            joinValues(
                profile.companyNeeds
            ),

        offers:
            joinValues(
                profile.companyOffers
            ),

        interests:
            joinValues(
                profile.collaborationInterests
            ),

        goals: [],

        bio: [
            profile.industryDomain,
            ...(profile.companyOffers || []),
            ...(profile.companyNeeds || []),
            ...(profile.collaborationInterests || [])
        ]
            .map(clean)
            .filter(Boolean)
            .join(" "),

        profileCompletion:
            Number(profile.profileCompletion) || 0,

        profileStatus:
            clean(profile.profileStatus).toUpperCase()
    };

    normalized.searchText =
        buildSearchText(normalized);

    return normalized;
};

const normalizePartnership = (profile) => {
    const normalized = {
        id: profile._id,

        ecosystem: "PARTNERSHIP",

        role:
            clean(profile.collaborationRole) ||
            "PARTNERSHIP",

        name:
            clean(profile.email),

        title:
            clean(profile.collaborationRole),

        organization: "",

        domain:
            joinValues(
                profile.sectors
            ).join(", "),

        location: "",

        industries:
            joinValues(
                profile.sectors
            ),

        skills: [],

        expertise: [],

        needs:
            joinValues(
                profile.collaborationNeeds
            ),

        offers:
            joinValues(
                profile.offerings
            ),

        interests:
            joinValues(
                profile.sectors,
                profile.collaborationScale
            ),

        goals: [],

        bio: [
            profile.collaborationRole,
            ...(profile.offerings || []),
            ...(profile.collaborationNeeds || []),
            ...(profile.sectors || []),
            profile.collaborationScale
        ]
            .map(clean)
            .filter(Boolean)
            .join(" "),

        profileCompletion:
            Number(profile.profileCompletion) || 0,

        profileStatus:
            clean(profile.profileStatus).toUpperCase()
    };

    normalized.searchText =
        buildSearchText(normalized);

    return normalized;
};

const normalizeSponsorship = (profile) => {
    const normalized = {
        id: profile._id,

        ecosystem: "SPONSORSHIP",

        role:
            clean(profile.accountType) ||
            "SPONSORSHIP",

        name:
            clean(profile.companyOrProjectName) ||
            "Sponsorship Profile",

        title:
            clean(profile.sponsorshipPurpose),

        organization:
            clean(profile.companyOrProjectName),

        domain:
            clean(profile.industry),

        location:
            joinValues(
                profile.preferredLocations
            ).join(", "),

        industries:
            joinValues(
                profile.industry,
                profile.preferredIndustries
            ),

        skills: [],

        expertise: [],

        needs: [],

        offers:
            joinValues(
                profile.sponsorshipTypes,
                profile.benefits
            ),

        interests:
            joinValues(
                profile.preferredIndustries,
                profile.targetAudience,
                profile.preferredLocations
            ),

        goals:
            joinValues(
                profile.sponsorshipPurpose
            ),

        bio: [
            profile.description,
            profile.sponsorshipPurpose,
            profile.benefits,
            profile.conditions
        ]
            .map(clean)
            .filter(Boolean)
            .join(" "),

        profileCompletion:
            Number(profile.profileCompletion) || 0,

        profileStatus:
            clean(profile.profileStatus).toUpperCase()
    };

    normalized.searchText =
        buildSearchText(normalized);

    return normalized;
};

const normalizeTBridge = (profile) => {
    const normalized = {
        id: profile._id,

        ecosystem: "TBRIDGE",

        role:
            clean(profile.professionalType) ||
            "TBRIDGE_MEMBER",

        name:
            clean(profile.email),

        title:
            clean(profile.professionalType),

        organization: "",

        domain: "",

        location:
            clean(profile.location),

        industries: [],

        skills: [],

        expertise: [],

        needs: [],

        offers: [],

        interests:
            joinValues(
                profile.interests
            ),

        goals: [],

        bio:
            clean(profile.bio),

        profileCompletion:
            Number(profile.profileCompletion) || 0,

        profileStatus:
            clean(profile.profileStatus).toUpperCase()
    };

    normalized.searchText =
        buildSearchText(normalized);

    return normalized;
};

// ============================================================
// LOAD ALL SEARCHABLE PROFILES
// ============================================================

const getUniversalProfiles = async ({
    ecosystem = "ALL"
} = {}) => {
    const target =
        clean(ecosystem).toUpperCase();

    const profiles = [];

    // --------------------------------------------------------
    // STARTUPS
    // --------------------------------------------------------

    if (
        target === "ALL" ||
        target === "STARTUP" ||
        target === "STARTUPS"
    ) {
        const startups =
            await StartupProfile
                .find({
                    profileStatus: "COMPLETED"
                })
                .lean();

        profiles.push(
            ...startups.map(normalizeStartup)
        );
    }

    // --------------------------------------------------------
    // INVESTORS
    // --------------------------------------------------------

    if (
        target === "ALL" ||
        target === "INVESTOR" ||
        target === "INVESTORS" ||
        target === "INVESTOR_FUNDER"
    ) {
        const investors =
            await InvestorFunder
                .find({
                    status: "ACTIVE",
                    profileCompleted: true
                })
                .select("-password")
                .lean();

        profiles.push(
            ...investors.map(normalizeInvestor)
        );
    }

    // --------------------------------------------------------
    // MENTORS
    // --------------------------------------------------------

    if (
        target === "ALL" ||
        target === "MENTOR" ||
        target === "MENTORS"
    ) {
        const mentors =
            await MentorProfile
                .find({
                    profileCompleted: true
                })
                .lean();

        profiles.push(
            ...mentors.map(normalizeMentor)
        );
    }

    // --------------------------------------------------------
    // CORPORATES
    // --------------------------------------------------------

    if (
        target === "ALL" ||
        target === "CORPORATE" ||
        target === "CORPORATES"
    ) {
        const corporates =
            await CorporateProfile
                .find({
                    profileStatus: "complete"
                })
                .lean();

        profiles.push(
            ...corporates.map(normalizeCorporate)
        );
    }

    // --------------------------------------------------------
    // PARTNERSHIPS
    // --------------------------------------------------------

    if (
        target === "ALL" ||
        target === "PARTNERSHIP" ||
        target === "PARTNERSHIPS"
    ) {
        const partnerships =
            await PartnershipProfile
                .find({
                    profileStatus: "complete"
                })
                .lean();

        profiles.push(
            ...partnerships.map(normalizePartnership)
        );
    }

    // --------------------------------------------------------
    // SPONSORSHIPS
    // --------------------------------------------------------

    if (
        target === "ALL" ||
        target === "SPONSORSHIP" ||
        target === "SPONSORSHIPS"
    ) {
        const sponsorships =
            await SponsorshipProfile
                .find({
                    profileStatus: "complete"
                })
                .lean();

        profiles.push(
            ...sponsorships.map(normalizeSponsorship)
        );
    }

    // --------------------------------------------------------
    // T-BRIDGE
    // --------------------------------------------------------

    if (
        target === "ALL" ||
        target === "TBRIDGE" ||
        target === "T-BRIDGE"
    ) {
        const tBridgeProfiles =
            await TBridgeProfile
                .find({
                    profileStatus: "complete"
                })
                .lean();

        profiles.push(
            ...tBridgeProfiles.map(normalizeTBridge)
        );
    }

    return profiles;
};

module.exports = {
    getUniversalProfiles,

    normalizeStartup,
    normalizeInvestor,
    normalizeMentor,
    normalizeCorporate,
    normalizePartnership,
    normalizeSponsorship,
    normalizeTBridge
};