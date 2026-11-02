from flask import Flask, request, jsonify
from flask_cors import CORS

# ============================================================
# EXISTING INVESTOR ML SYSTEM
# ============================================================

from sicr_matching_engine import recommend_investors


# ============================================================
# UNIVERSAL MATCHING SYSTEM
# ============================================================

from universal_matching_engine import (
    universal_match,
    semantic_search
)

from universal_profile_adapter import (
    create_universal_profile,
    universal_profile_to_text
)


# ============================================================
# FLASK CONFIGURATION
# ============================================================

app = Flask(__name__)

CORS(app)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def health():

    return jsonify({
        "success": True,
        "service": "SICR ML Matching Service",
        "status": "running"
    })


# ============================================================
# EXISTING INVESTOR RECOMMENDATION API
# ============================================================

@app.post("/recommend-investors")
def recommend():

    try:

        data = request.get_json(
            silent=True
        ) or {}

        idea = data.get(
            "idea"
        )

        stage = data.get(
            "stage",
            "MVP"
        )

        required_funding = data.get(
            "required_funding",
            0
        )

        location = data.get(
            "location",
            ""
        )

        investors = data.get(
            "investors",
            []
        )

        top_n = data.get(
            "top_n",
            10
        )

        if not idea:

            return jsonify({
                "success": False,
                "message": "idea is required"
            }), 400

        result = recommend_investors(

            idea=idea,

            stage=stage,

            required_funding=required_funding,

            location=location,

            investors=investors,

            top_n=top_n
        )

        return jsonify({

            "success": True,

            "detected_domains":
                result.get(
                    "detected_domains",
                    []
                ),

            "recommendations":
                result.get(
                    "recommendations",
                    []
                )
        })

    except Exception as e:

        print(
            "ML ERROR:",
            repr(e)
        )

        return jsonify({

            "success": False,

            "message":
                "ML recommendation failed",

            "error":
                str(e)

        }), 500


# ============================================================
# UNIVERSAL MATCH API
# ============================================================

@app.post("/universal-match")
def universal_match_api():

    try:

        data = request.get_json(
            silent=True
        ) or {}

        # ----------------------------------------------------
        # INPUT
        # ----------------------------------------------------

        source_profile = data.get(
            "source_profile"
        )

        candidate_profiles = data.get(
            "candidate_profiles",
            []
        )

        top_n = data.get(
            "top_n",
            10
        )

        # ----------------------------------------------------
        # VALIDATION
        # ----------------------------------------------------

        if not isinstance(
            source_profile,
            dict
        ):

            return jsonify({

                "success": False,

                "message":
                    "source_profile must be an object"

            }), 400

        if not isinstance(
            candidate_profiles,
            list
        ):

            return jsonify({

                "success": False,

                "message":
                    "candidate_profiles must be an array"

            }), 400

        # ----------------------------------------------------
        # SOURCE PROFILE TYPE
        # ----------------------------------------------------

        source_type = (
            source_profile.get(
                "profileType"
            )
            or source_profile.get(
                "userType"
            )
            or source_profile.get(
                "type"
            )
        )

        if not source_type:

            return jsonify({

                "success": False,

                "message":
                    "source_profile profileType is required"

            }), 400

        # ----------------------------------------------------
        # ADAPT SOURCE PROFILE
        # ----------------------------------------------------

        universal_source = create_universal_profile(

            source_type,

            source_profile
        )

        # ----------------------------------------------------
        # ADAPT CANDIDATE PROFILES
        # ----------------------------------------------------

        universal_candidates = []

        skipped_candidates = []

        for index, candidate in enumerate(
            candidate_profiles
        ):

            try:

                if not isinstance(
                    candidate,
                    dict
                ):

                    skipped_candidates.append({
                        "index": index,
                        "reason":
                            "Candidate must be an object"
                    })

                    continue

                candidate_type = (

                    candidate.get(
                        "profileType"
                    )

                    or candidate.get(
                        "userType"
                    )

                    or candidate.get(
                        "type"
                    )
                )

                if not candidate_type:

                    skipped_candidates.append({
                        "index": index,
                        "reason":
                            "profileType is required"
                    })

                    continue

                universal_candidate = (
                    create_universal_profile(
                        candidate_type,
                        candidate
                    )
                )

                universal_candidates.append(
                    universal_candidate
                )

            except Exception as candidate_error:

                skipped_candidates.append({

                    "index": index,

                    "reason":
                        str(candidate_error)
                })

        # ----------------------------------------------------
        # CHECK SOURCE CONTENT
        # ----------------------------------------------------

        source_text = universal_profile_to_text(
            universal_source
        )

        if not source_text.strip():

            return jsonify({

                "success": False,

                "message":
                    "Source profile does not contain usable information."

            }), 400

        # ----------------------------------------------------
        # MATCH
        # ----------------------------------------------------

        matches = universal_match(

            universal_source,

            universal_candidates
        )

        # ----------------------------------------------------
        # TOP N
        # ----------------------------------------------------

        try:

            top_n = int(
                top_n
            )

        except (
            TypeError,
            ValueError
        ):

            top_n = 10

        if top_n < 1:

            top_n = 1

        matches = matches[
            :top_n
        ]

        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return jsonify({

            "success": True,

            "engine":
                "SICR Universal Semantic Matching Engine",

            "source_profile":
                universal_source,

            "candidate_count":
                len(universal_candidates),

            "skipped_candidates":
                skipped_candidates,

            "matches":
                matches

        })

    except Exception as e:

        print(
            "UNIVERSAL MATCH ERROR:",
            repr(e)
        )

        return jsonify({

            "success": False,

            "message":
                "Universal matching failed",

            "error":
                str(e)

        }), 500

# ============================================================
# SEMANTIC GLOBAL SEARCH API
# ============================================================

@app.post("/semantic-search")
def semantic_search_api():

    try:
        data = request.get_json(silent=True) or {}

        query = data.get("query", "")
        candidate_profiles = data.get(
            "candidate_profiles",
            []
        )
        top_n = data.get("top_n", 10)

        # ----------------------------------------------------
        # VALIDATION
        # ----------------------------------------------------

        if not isinstance(query, str) or not query.strip():
            return jsonify({
                "success": False,
                "message": "query is required"
            }), 400

        if not isinstance(candidate_profiles, list):
            return jsonify({
                "success": False,
                "message": "candidate_profiles must be an array"
            }), 400

        # ----------------------------------------------------
        # ADAPT PROFILES
        # ----------------------------------------------------

        universal_candidates = []
        skipped_candidates = []

        for index, candidate in enumerate(candidate_profiles):

            try:

                if not isinstance(candidate, dict):
                    skipped_candidates.append({
                        "index": index,
                        "reason": "Candidate must be an object"
                    })
                    continue

                candidate_type = (
                    candidate.get("profileType")
                    or candidate.get("userType")
                    or candidate.get("type")
                    or candidate.get("ecosystem")
                )

                if not candidate_type:
                    skipped_candidates.append({
                        "index": index,
                        "reason": "profileType is required"
                    })
                    continue

                universal_candidate = create_universal_profile(
                    candidate_type,
                    candidate
                )

                universal_candidates.append(
                    universal_candidate
                )

            except Exception as candidate_error:

                skipped_candidates.append({
                    "index": index,
                    "reason": str(candidate_error)
                })

        # ----------------------------------------------------
        # SEMANTIC SEARCH
        # ----------------------------------------------------

        matches = semantic_search(
            query=query,
            candidate_profiles=universal_candidates,
            top_n=top_n
        )

        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return jsonify({
            "success": True,
            "engine": "SICR Universal Semantic Search Engine",
            "query": query,
            "candidate_count": len(universal_candidates),
            "skipped_candidates": skipped_candidates,
            "matches": matches
        })

    except Exception as e:

        print(
            "SEMANTIC SEARCH ERROR:",
            repr(e)
        )

        return jsonify({
            "success": False,
            "message": "Semantic search failed",
            "error": str(e)
        }), 500

# ============================================================
# START FLASK
# ============================================================

if __name__ == "__main__":

    app.run(

        host="127.0.0.1",

        port=5001,

        debug=False
    )