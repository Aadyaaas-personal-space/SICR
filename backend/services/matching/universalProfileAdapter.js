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

const objectValues = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return [];
    }

    return Object.values(value)
        .map((item) => {
            if (Array.isArray(item)) {
                return item.join(" ");
            }

            if (item && typeof item === "object") {
                return Object.values(item).join(" ");
            }

            return item;
        })
        .map(clean)
        .filter(Boolean);
};

const buildSearchText = (profile) => {
    return [
        profile.name,
        profile.title,
        profile.organization,
        profile.role,

        profile.domain,
        profile.location,

        profile.industries.join(" "),
        profile.skills.join(" "),
        profile.expertise.join(" "),
        profile.needs.join(" "),
        profile.offers.join(" "),
        profile.interests.join(" "),
        profile.goals.join(" "),

        profile.bio,

        profile.ecosystem
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
};

// ============================================================
// NORMALIZERS
// ============================================================

const normalizeStartup = (profile) => {
    const plannedToBuild = clean(profile.plannedToBuild);
    const currentNeeds = clean(profile.currentNeeds);
    const existingResources = clean(profile.existingResources);
    const currentPosition = clean(profile.currentPosition);
    const connectionInterests = clean(profile.connectionInterests);
    const opportunityInterests = clean(profile.opportunityInterests);

    const normalized = {
        // IMPORTANT:
        // Connections, notifications and authentication use
        // StartupAccount._id as the canonical Startup identity.
        //
        // StartupProfile._id is only the profile document ID.
        id: profile.account?._id || profile.account || profile._id,

        // Keep profile ID separately for profile-related operations.
        profileId: profile._id,

        ecosystem: "STARTUP",

        role:
            clean(profile.role) ||
            "FOUNDER",

        name:
            clean(profile.email),

        title:
            currentPosition,

        organization:
            "",

        /*
         * StartupProfile does not currently have a dedicated
         * industry/domain field.
         *
         * We therefore expose the strongest semantic startup
         * information through domain and expertise instead of
         * inventing a domain.
         */
        domain:
            joinValues(
                plannedToBuild,
                existingResources
            ).join(", "),

        location:
            "",

        industries:
            [],

        skills:
            joinValues(
                existingResources
            ),

        expertise:
            joinValues(
                plannedToBuild,
                currentPosition
            ),

        needs:
            joinValues(
                currentNeeds
            ),

        offers:
            joinValues(
                existingResources
            ),

        interests:
            joinValues(
                connectionInterests,
                opportunityInterests
            ),

        goals:
            joinValues(
                plannedToBuild
            ),

        bio:
            [
                currentPosition,
                plannedToBuild,
                existingResources,
                currentNeeds,
                connectionInterests,
                opportunityInterests
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

// ============================================================
// INVESTOR / FUNDER
// ============================================================

const normalizeInvestor = (profile) => {
    const locationParts = [
        profile.city,
        profile.state,
        profile.country
    ]
        .map(clean)
        .filter(Boolean);

    const fundingTypes = joinValues(
        profile.fundingTypes
    );

    const preferredStages = joinValues(
        profile.preferredStartupStages
    );

    const businessModels = joinValues(
        profile.businessModels
    );

    const preferredCountries = joinValues(
        profile.preferredCountries
    );

    const preferredRegions = joinValues(
        profile.preferredRegions
    );

    const industries = joinValues(
        profile.industries,
        profile.sectors
    );

    const fundingDetails = joinValues(
        profile.fundingRole,
        profile.fundingConditions,
        fundingTypes,
        profile.minimumInvestment,
        profile.maximumInvestment,
        profile.preferredCurrency
    );

    const normalized = {
        id: profile._id,

        ecosystem: "INVESTOR",

        role:
            clean(profile.profileType) ||
            clean(profile.role) ||
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

        title:
            clean(profile.designation),

        organization:
            clean(profile.organizationName),

        domain:
            industries.join(", "),

        location:
            locationParts.join(", "),

        industries:
            industries,

        /*
         * Investor does not have a literal "skills" field.
         * We expose investment-related capabilities here.
         */
        skills:
            joinValues(
                profile.expertise,
                profile.businessModels,
                profile.investmentFrequency
            ),

        expertise:
            joinValues(
                profile.expertise,
                profile.sectors,
                profile.industries
            ),

        /*
         * These are not "needs" in the startup sense.
         * However, preferred stages, regions and risk profile
         * are useful semantic signals for investor matching.
         */
        needs:
            joinValues(
                preferredStages,
                preferredCountries,
                preferredRegions
            ),

        offers:
            fundingDetails,

        interests:
            joinValues(
                preferredStages,
                businessModels,
                preferredCountries,
                preferredRegions,
                profile.riskPreference,
                profile.investmentFrequency
            ),

        goals:
            joinValues(
                profile.fundingRole,
                profile.portfolioCount,
                profile.previousInvestments
            ),

        bio:
            [
                profile.bio,
                profile.organizationDescription,
                profile.fundingRole,
                profile.fundingConditions,
                fundingTypes.join(" "),
                industries.join(" "),
                profile.expertise
            ]
                .map((value) => {
                    if (Array.isArray(value)) {
                        return value.join(" ");
                    }

                    return clean(value);
                })
                .filter(Boolean)
                .join(" "),

        profileCompletion:
            Number(profile.profileCompletionPercentage) || 0,

        profileStatus:
            profile.profileCompleted
                ? "COMPLETED"
                : clean(profile.profileStatus).toUpperCase() ||
                "INCOMPLETE"
    };

    normalized.searchText =
        buildSearchText(normalized);

    return normalized;
};

// ============================================================
// MENTOR
// ============================================================

const normalizeMentor = (profile) => {
    const expertise = joinValues(
        profile.areasOfExpertise,
        profile.mentorshipAreas
    );

    const industries = joinValues(
        profile.industries
    );

    const skills = joinValues(
        profile.skills
    );

    const support = joinValues(
        profile.supportOffered
    );

    const interests = joinValues(
        profile.interestedIn,
        profile.preferredStartupStages,
        profile.mentorshipMode
    );

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
                industries,
                expertise
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
            industries,

        skills:
            skills,

        expertise:
            expertise,

        needs:
            [],

        offers:
            joinValues(
                support,
                profile.mentorshipAreas
            ),

        interests:
            interests,

        goals:
            joinValues(
                profile.availability,
                profile.preferredStartupStages
            ),

        bio:
            [
                profile.bio,
                profile.currentPosition,
                profile.organization,
                expertise,
                skills,
                support
            ]
                .map((value) => {
                    if (Array.isArray(value)) {
                        return value.join(" ");
                    }

                    return clean(value);
                })
                .filter(Boolean)
                .join(" "),

        profileCompletion:
            Number(profile.profileCompletionPercentage) || 0,

        profileStatus:
            profile.profileCompleted
                ? "COMPLETED"
                : clean(profile.profileStatus).toUpperCase() ||
                "INCOMPLETE"
    };

    normalized.searchText =
        buildSearchText(normalized);

    return normalized;
};

// ============================================================
// CORPORATE
// ============================================================

const normalizeCorporate = (profile) => {
    const ecosystemRoles = joinValues(
        profile.ecosystemRole
    );

    const offers = joinValues(
        profile.companyOffers
    );

    const needs = joinValues(
        profile.companyNeeds
    );

    const collaborationInterests = joinValues(
        profile.collaborationInterests
    );

    const industry = clean(
        profile.industryDomain
    );

    const normalized = {
        id: profile._id,

        ecosystem: "CORPORATE",

        role:
            ecosystemRoles.join(", ") ||
            "CORPORATE",

        name:
            clean(profile.companyName) ||
            clean(profile.email),

        title:
            ecosystemRoles.join(", "),

        organization:
            clean(profile.companyName),

        domain:
            industry,

        location:
            "",

        industries:
            joinValues(
                industry
            ),

        skills:
            joinValues(
                offers
            ),

        expertise:
            joinValues(
                industry,
                ecosystemRoles,
                collaborationInterests
            ),

        needs:
            needs,

        offers:
            offers,

        interests:
            collaborationInterests,

        goals:
            joinValues(
                collaborationInterests,
                offers
            ),

        bio:
            [
                industry,
                ecosystemRoles,
                offers,
                needs,
                collaborationInterests
            ]
                .map((value) => {
                    if (Array.isArray(value)) {
                        return value.join(" ");
                    }

                    return clean(value);
                })
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

// ============================================================
// PARTNERSHIP
// ============================================================

const normalizePartnership = (profile) => {
    const sectors = joinValues(
        profile.sectors
    );

    const offerings = joinValues(
        profile.offerings
    );

    const needs = joinValues(
        profile.collaborationNeeds
    );

    const collaborationRole =
        clean(profile.collaborationRole);

    const collaborationScale =
        clean(profile.collaborationScale);

    const normalized = {
        id: profile._id,

        ecosystem: "PARTNERSHIP",

        role:
            collaborationRole ||
            "PARTNERSHIP",

        name:
            clean(profile.email),

        title:
            collaborationRole,

        organization:
            "",

        domain:
            sectors.join(", "),

        location:
            "",

        industries:
            sectors,

        skills:
            joinValues(
                offerings
            ),

        expertise:
            joinValues(
                sectors,
                collaborationRole
            ),

        needs:
            needs,

        offers:
            offerings,

        interests:
            joinValues(
                sectors,
                collaborationScale
            ),

        goals:
            joinValues(
                collaborationScale,
                needs
            ),

        bio:
            [
                collaborationRole,
                offerings,
                needs,
                sectors,
                collaborationScale
            ]
                .map((value) => {
                    if (Array.isArray(value)) {
                        return value.join(" ");
                    }

                    return clean(value);
                })
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

// ============================================================
// SPONSORSHIP
// ============================================================

const normalizeSponsorship = (profile) => {
    const industry =
        clean(profile.industry);

    const preferredIndustries =
        joinValues(profile.preferredIndustries);

    const sponsorshipTypes =
        joinValues(profile.sponsorshipTypes);

    const preferredLocations =
        joinValues(profile.preferredLocations);

    const benefits =
        joinValues(profile.benefits);

    const conditions =
        clean(profile.conditions);

    const targetAudience =
        clean(profile.targetAudience);

    const sponsorshipPurpose =
        clean(profile.sponsorshipPurpose);

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
            sponsorshipPurpose,

        organization:
            clean(profile.companyOrProjectName),

        domain:
            industry,

        location:
            preferredLocations.join(", "),

        industries:
            joinValues(
                industry,
                preferredIndustries
            ),

        skills:
            joinValues(
                sponsorshipTypes,
                benefits
            ),

        expertise:
            joinValues(
                industry,
                preferredIndustries,
                sponsorshipTypes
            ),

        /*
         * For sponsorship seekers, company/project needs are
         * represented through purpose, audience and conditions.
         * For sponsors, these same fields become semantic
         * compatibility signals.
         */
        needs:
            joinValues(
                sponsorshipPurpose,
                targetAudience,
                conditions
            ),

        offers:
            joinValues(
                sponsorshipTypes,
                benefits
            ),

        interests:
            joinValues(
                preferredIndustries,
                targetAudience,
                preferredLocations
            ),

        goals:
            joinValues(
                sponsorshipPurpose,
                benefits
            ),

        bio:
            [
                profile.description,
                sponsorshipPurpose,
                industry,
                sponsorshipTypes,
                preferredIndustries,
                targetAudience,
                benefits,
                conditions
            ]
                .map((value) => {
                    if (Array.isArray(value)) {
                        return value.join(" ");
                    }

                    return clean(value);
                })
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

// ============================================================
// T-BRIDGE
// ============================================================

const normalizeTBridge = (profile) => {
    const interests =
        joinValues(profile.interests);

    const professionalType =
        clean(profile.professionalType);

    const bio =
        clean(profile.bio);

    const normalized = {
        id: profile._id,

        ecosystem: "TBRIDGE",

        role:
            professionalType ||
            "TBRIDGE_MEMBER",

        name:
            clean(profile.email),

        title:
            professionalType,

        organization:
            "",

        domain:
            professionalType,

        location:
            clean(profile.location),

        industries:
            [],

        skills:
            interests,

        expertise:
            joinValues(
                professionalType,
                interests
            ),

        needs:
            [],

        offers:
            [],

        interests:
            interests,

        goals:
            joinValues(
                interests
            ),

        bio:
            [
                professionalType,
                bio,
                interests
            ]
                .map((value) => {
                    if (Array.isArray(value)) {
                        return value.join(" ");
                    }

                    return clean(value);
                })
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

// ============================================================
// LOAD ALL SEARCHABLE PROFILES
// ============================================================

const getUniversalProfiles = async ({
    ecosystem = "ALL"
} = {}) => {

    const target =
        clean(ecosystem).toUpperCase();

    const profiles = [];

    // ========================================================
    // STARTUPS
    // ========================================================

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
                .populate({
                    path: "account",
                    select: "_id"
                })
                .lean();

        profiles.push(
            ...startups.map(normalizeStartup)
        );
    }

    // ========================================================
    // INVESTORS / FUNDERS
    // ========================================================

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

    // ========================================================
    // MENTORS
    // ========================================================

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

    // ========================================================
    // CORPORATES
    // ========================================================

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

    // ========================================================
    // PARTNERSHIPS
    // ========================================================

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

    // ========================================================
    // SPONSORSHIPS
    // ========================================================

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

    // ========================================================
    // T-BRIDGE
    // ========================================================

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

// ============================================================
// EXPORTS
// ============================================================

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