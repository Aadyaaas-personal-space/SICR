// ============================================================
// SICR UNIVERSAL MATCHING CONTROLLER
// ============================================================

const {
    getUniversalProfiles
} = require("../services/matching/universalProfileAdapter");

const {
    searchProfiles
} = require("../services/matching/universalMatchingService");


// ============================================================
// UNIVERSAL SEARCH
// ============================================================

const universalSearch = async (
    req,
    res
) => {

    try {

        const {
            query = "",
            ecosystem = "ALL",
            sourceProfile = null,
            topN = 10
        } = req.body;


        // ----------------------------------------------------
        // Load all eligible ecosystem profiles
        // ----------------------------------------------------

        const profiles =
            await getUniversalProfiles({
                ecosystem: "ALL"
            });


        // ----------------------------------------------------
        // Matching
        // ----------------------------------------------------

        const matchingResult =
            await searchProfiles({
                profiles,
                query,
                sourceProfile,
                ecosystem,
                topN
            });


        // ----------------------------------------------------
        // Response
        // ----------------------------------------------------

        return res.status(200).json({

            success: true,

            search: {

                query,

                requestedEcosystem:
                    ecosystem,

                detectedEcosystem:
                    matchingResult
                        .detectedEcosystem
            },

            matchingEngine:
                matchingResult
                    .matchingEngine ||
                "NODE_KEYWORD_FALLBACK",

            totalResults:
                matchingResult
                    .totalResults,

            results:
                matchingResult.results

        });

    } catch (error) {

        console.error(
            "Universal search error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to perform universal SICR search",

            error:
                error.message

        });
    }
};


// ============================================================
// UNIVERSAL RECOMMENDATIONS
// ============================================================

const universalRecommendations =
    async (
        req,
        res
    ) => {

        try {

            const {
                sourceProfile,
                ecosystem = "ALL",
                topN = 10
            } = req.body;


            if (!sourceProfile) {

                return res.status(400).json({

                    success: false,

                    message:
                        "sourceProfile is required for personalized recommendations"

                });
            }


            // ------------------------------------------------
            // Load profiles
            // ------------------------------------------------

            const profiles =
                await getUniversalProfiles({
                    ecosystem: "ALL"
                });


            // ------------------------------------------------
            // Semantic matching
            // ------------------------------------------------

            const matchingResult =
                await searchProfiles({

                    profiles,

                    query: "",

                    sourceProfile,

                    ecosystem,

                    topN

                });


            // ------------------------------------------------
            // Response
            // ------------------------------------------------

            return res.status(200).json({

                success: true,

                ecosystem:
                    matchingResult
                        .detectedEcosystem,

                matchingEngine:
                    matchingResult
                        .matchingEngine ||
                    "NODE_KEYWORD_FALLBACK",

                totalResults:
                    matchingResult
                        .totalResults,

                recommendations:
                    matchingResult
                        .results

            });

        } catch (error) {

            console.error(
                "Universal recommendation error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to generate personalized recommendations",

                error:
                    error.message

            });
        }
    };


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    universalSearch,

    universalRecommendations

};