// ============================================================
// SICR UNIVERSAL MATCHING SERVICE
// ============================================================

const axios = require("axios");

// ============================================================
// FLASK ML CONFIGURATION
// ============================================================

const FLASK_ML_URL =
    process.env.SICR_ML_URL ||
    "http://127.0.0.1:5001";

const UNIVERSAL_MATCH_ENDPOINT =
    `${FLASK_ML_URL}/universal-match`;


// ============================================================
// STOP WORDS
// ============================================================

const STOP_WORDS = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "for",
    "to",
    "of",
    "in",
    "on",
    "with",
    "near",
    "looking",
    "find",
    "me",
    "need",
    "want",
    "show",
    "someone",
    "people",
    "company",
    "companies",
    "person"
]);


// ============================================================
// TOKENIZER
// ============================================================

const tokenize = (value) => {

    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9+#.\s-]/g, " ")
        .split(/\s+/)
        .map((word) => word.trim())
        .filter(
            (word) =>
                word &&
                word.length >= 2 &&
                !STOP_WORDS.has(word)
        );
};


// ============================================================
// UNIQUE
// ============================================================

const unique = (array) => {

    return [
        ...new Set(
            Array.isArray(array)
                ? array
                : []
        )
    ];
};


// ============================================================
// OVERLAP
// ============================================================

const overlap = (source, target) => {

    const sourceTokens =
        new Set(
            tokenize(source)
        );

    const targetTokens =
        new Set(
            tokenize(target)
        );

    if (
        !sourceTokens.size ||
        !targetTokens.size
    ) {
        return 0;
    }

    let matches = 0;

    for (const token of sourceTokens) {

        if (targetTokens.has(token)) {
            matches++;
        }
    }

    return (
        matches /
        sourceTokens.size
    );
};


// ============================================================
// FIELD TEXT
// ============================================================

const fieldText = (
    profile,
    field
) => {

    if (!profile) {
        return "";
    }

    const value =
        profile[field];

    if (Array.isArray(value)) {
        return value.join(" ");
    }

    return String(
        value || ""
    );
};


// ============================================================
// KEYWORD FALLBACK SCORING
// ============================================================

const scoreProfile = ({
    query,
    sourceProfile,
    target
}) => {

    const queryText =
        String(query || "")
            .trim()
            .toLowerCase();

    let score = 0;

    const reasons = [];


    // ========================================================
    // QUERY MATCHING
    // ========================================================

    if (queryText) {

        const searchText =
            target.searchText || "";

        const queryTokens =
            unique(
                tokenize(queryText)
            );

        let matchedTokens = 0;

        queryTokens.forEach(
            (token) => {

                if (
                    searchText
                        .toLowerCase()
                        .includes(token)
                ) {
                    matchedTokens++;
                }
            }
        );

        if (queryTokens.length) {

            const queryMatch =
                matchedTokens /
                queryTokens.length;

            score +=
                queryMatch * 55;

            if (queryMatch >= 0.75) {

                reasons.push(
                    "Strong search relevance"
                );

            } else if (queryMatch >= 0.4) {

                reasons.push(
                    "Relevant to your search"
                );
            }
        }


        // Exact phrase bonus

        if (
            queryText.length >= 4 &&
            searchText
                .toLowerCase()
                .includes(queryText)
        ) {

            score += 12;

            reasons.push(
                "Exact phrase match"
            );
        }
    }


    // ========================================================
    // SOURCE PROFILE COMPATIBILITY
    // ========================================================

    if (sourceProfile) {

        const sourceIndustries =
            fieldText(
                sourceProfile,
                "industries"
            );

        const sourceSkills =
            fieldText(
                sourceProfile,
                "skills"
            );

        const sourceExpertise =
            fieldText(
                sourceProfile,
                "expertise"
            );

        const sourceNeeds =
            fieldText(
                sourceProfile,
                "needs"
            );

        const sourceOffers =
            fieldText(
                sourceProfile,
                "offers"
            );

        const sourceInterests =
            fieldText(
                sourceProfile,
                "interests"
            );


        const targetIndustries =
            fieldText(
                target,
                "industries"
            );

        const targetSkills =
            fieldText(
                target,
                "skills"
            );

        const targetExpertise =
            fieldText(
                target,
                "expertise"
            );

        const targetNeeds =
            fieldText(
                target,
                "needs"
            );

        const targetOffers =
            fieldText(
                target,
                "offers"
            );

        const targetInterests =
            fieldText(
                target,
                "interests"
            );


        // ----------------------------------------------------
        // Industry
        // ----------------------------------------------------

        const industryScore =
            overlap(
                sourceIndustries,
                targetIndustries
            );

        if (industryScore > 0) {

            score +=
                industryScore * 12;

            reasons.push(
                "Industry alignment"
            );
        }


        // ----------------------------------------------------
        // Skills / expertise
        // ----------------------------------------------------

        const skillScore =
            Math.max(
                overlap(
                    sourceSkills,
                    targetSkills
                ),

                overlap(
                    sourceSkills,
                    targetExpertise
                ),

                overlap(
                    sourceExpertise,
                    targetSkills
                ),

                overlap(
                    sourceExpertise,
                    targetExpertise
                )
            );

        if (skillScore > 0) {

            score +=
                skillScore * 10;

            reasons.push(
                "Expertise alignment"
            );
        }


        // ----------------------------------------------------
        // Need → Offer
        // ----------------------------------------------------

        const needOfferScore =
            Math.max(
                overlap(
                    sourceNeeds,
                    targetOffers
                ),

                overlap(
                    targetNeeds,
                    sourceOffers
                )
            );

        if (needOfferScore > 0) {

            score +=
                needOfferScore * 15;

            reasons.push(
                "Need and offering alignment"
            );
        }


        // ----------------------------------------------------
        // Interests
        // ----------------------------------------------------

        const interestScore =
            Math.max(
                overlap(
                    sourceInterests,
                    targetInterests
                ),

                overlap(
                    sourceInterests,
                    targetOffers
                )
            );

        if (interestScore > 0) {

            score +=
                interestScore * 8;

            reasons.push(
                "Interest alignment"
            );
        }


        // ----------------------------------------------------
        // Location
        // ----------------------------------------------------

        const sourceLocation =
            fieldText(
                sourceProfile,
                "location"
            );

        const targetLocation =
            fieldText(
                target,
                "location"
            );

        const locationScore =
            overlap(
                sourceLocation,
                targetLocation
            );

        if (locationScore > 0) {

            score +=
                locationScore * 5;

            reasons.push(
                "Location compatibility"
            );
        }


        // ----------------------------------------------------
        // Profile quality
        // ----------------------------------------------------

        const completion =
            Number(
                target.profileCompletion
            ) || 0;

        score +=
            Math.min(
                completion,
                100
            ) * 0.05;

        if (completion >= 80) {

            reasons.push(
                "High profile completeness"
            );
        }
    }


    score =
        Math.min(
            Math.round(
                score * 100
            ) / 100,
            100
        );

    return {
        score,
        reasons:
            unique(reasons)
    };
};


// ============================================================
// ECOSYSTEM DETECTION
// ============================================================

const detectEcosystemFromQuery = (
    query
) => {

    const text =
        String(query || "")
            .toLowerCase();


    if (
        text.includes("investor") ||
        text.includes("funder") ||
        text.includes("funding") ||
        text.includes("venture capital") ||
        text.includes("vc") ||
        text.includes("angel")
    ) {
        return "INVESTOR";
    }


    if (
        text.includes("mentor") ||
        text.includes("mentoring") ||
        text.includes("expert")
    ) {
        return "MENTOR";
    }


    if (
        text.includes("corporate") ||
        text.includes("company") ||
        text.includes("industry")
    ) {
        return "CORPORATE";
    }


    if (
        text.includes("partner") ||
        text.includes("partnership") ||
        text.includes("collaboration")
    ) {
        return "PARTNERSHIP";
    }


    if (
        text.includes("sponsor") ||
        text.includes("sponsorship")
    ) {
        return "SPONSORSHIP";
    }


    if (
        text.includes("tbridge") ||
        text.includes("t-bridge")
    ) {
        return "TBRIDGE";
    }


    if (
        text.includes("startup") ||
        text.includes("founder")
    ) {
        return "STARTUP";
    }


    return "ALL";
};


// ============================================================
// PREPARE PROFILE FOR FLASK
// ============================================================

const prepareProfileForFlask = (
    profile
) => {

    if (!profile) {
        return null;
    }

    return {
        ...profile,

        profileType:
            String(
                profile.profileType ||
                profile.ecosystem ||
                profile.userType ||
                profile.type ||
                "TBRIDGE"
            ).toUpperCase()
    };
};


// ============================================================
// FLASK SEMANTIC MATCHING
// ============================================================

const semanticMatchProfiles = async ({
    sourceProfile,
    profiles,
    topN = 10
}) => {

    const flaskSource =
        prepareProfileForFlask(
            sourceProfile
        );

    const flaskCandidates =
        Array.isArray(profiles)
            ? profiles.map(
                prepareProfileForFlask
            )
            : [];


    if (!flaskSource) {

        throw new Error(
            "sourceProfile is required for semantic matching"
        );
    }


    const response =
        await axios.post(
            UNIVERSAL_MATCH_ENDPOINT,
            {
                source_profile:
                    flaskSource,

                candidate_profiles:
                    flaskCandidates,

                top_n:
                    Number(topN) || 10
            },
            {
                timeout: 30000,
                headers: {
                    "Content-Type":
                        "application/json"
                }
            }
        );


    return response.data;
};


// ============================================================
// KEYWORD FALLBACK SEARCH
// ============================================================

const keywordSearchProfiles = ({
    profiles,
    query = "",
    sourceProfile = null,
    ecosystem = "ALL",
    topN = 10
}) => {

    const detectedEcosystem =
        ecosystem &&
        String(ecosystem).toUpperCase() !== "ALL"

            ? String(
                ecosystem
            ).toUpperCase()

            : detectEcosystemFromQuery(
                query
            );


    let candidates =
        Array.isArray(profiles)
            ? profiles
            : [];


    if (
        detectedEcosystem !== "ALL"
    ) {

        candidates =
            candidates.filter(
                (profile) =>
                    String(
                        profile.ecosystem || ""
                    ).toUpperCase() ===
                    detectedEcosystem
            );
    }


    const results =
        candidates
            .map(
                (target) => {

                    const scoring =
                        scoreProfile({
                            query,
                            sourceProfile,
                            target
                        });

                    return {
                        ...target,

                        matchScore:
                            scoring.score,

                        matchReasons:
                            scoring.reasons,

                        matchingEngine:
                            "NODE_KEYWORD_FALLBACK"
                    };
                }
            )

            .filter(
                (profile) =>
                    profile.matchScore > 0 ||
                    (
                        !query &&
                        sourceProfile
                    )
            )

            .sort(
                (a, b) =>
                    b.matchScore -
                    a.matchScore
            )

            .slice(
                0,
                Math.max(
                    1,
                    Number(topN) || 10
                )
            );


    return {
        detectedEcosystem,
        totalResults:
            results.length,
        results
    };
};


// ============================================================
// UNIVERSAL SEARCH / RECOMMENDATIONS
// ============================================================

const searchProfiles = async ({
    profiles,
    query = "",
    sourceProfile = null,
    ecosystem = "ALL",
    topN = 10
}) => {

    // ========================================================
    // Personalized recommendation
    // ========================================================

    if (
        sourceProfile &&
        !String(query).trim()
    ) {

        try {

            const semanticResult =
                await semanticMatchProfiles({
                    sourceProfile,
                    profiles,
                    topN
                });


            const results =
                Array.isArray(
                    semanticResult.matches
                )
                    ? semanticResult.matches
                    : [];


            return {
                detectedEcosystem:
                    ecosystem &&
                    String(
                        ecosystem
                    ).toUpperCase() !== "ALL"

                        ? String(
                            ecosystem
                        ).toUpperCase()

                        : "ALL",

                totalResults:
                    results.length,

                results:
                    results.map(
                        (item) => ({
                            ...item.profile,

                            matchScore:
                                item.matchPercentage,

                            semanticSimilarity:
                                item.similarity,

                            matchReasons: [
                                "Semantic profile similarity"
                            ],

                            matchingEngine:
                                "FLASK_SENTENCETRANSFORMER"
                        })
                    ),

                matchingEngine:
                    "FLASK_SENTENCETRANSFORMER"
            };

        } catch (error) {

            console.warn(
                "Flask semantic matcher unavailable. Using Node keyword fallback.",
                error.message
            );

            const fallback =
                keywordSearchProfiles({
                    profiles,
                    query,
                    sourceProfile,
                    ecosystem,
                    topN
                });

            return {
                ...fallback,

                matchingEngine:
                    "NODE_KEYWORD_FALLBACK",

                fallbackReason:
                    "Flask ML service unavailable"
            };
        }
    }


    // ========================================================
    // Normal search
    //
    // Until semantic query-search endpoint is added,
    // keep the existing keyword search behavior.
    // ========================================================

    return keywordSearchProfiles({
        profiles,
        query,
        sourceProfile,
        ecosystem,
        topN
    });
};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    searchProfiles,

    semanticMatchProfiles,

    scoreProfile,

    detectEcosystemFromQuery
};