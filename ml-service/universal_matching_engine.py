import numpy as np
from sentence_transformers import SentenceTransformer


# ============================================================
# CONFIGURATION
# ============================================================

MODEL_NAME = "all-MiniLM-L6-v2"

print("=" * 70)
print("SICR UNIVERSAL SEMANTIC MATCHING ENGINE")
print("=" * 70)

print(f"Loading embedding model: {MODEL_NAME}")

model = SentenceTransformer(MODEL_NAME)

print("Embedding model loaded successfully.")


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_text(value):
    """
    Convert any supported value into clean text.
    """

    if value is None:
        return ""

    if isinstance(value, list):
        return ", ".join(
            str(item).strip()
            for item in value
            if item is not None
        )

    if isinstance(value, dict):
        return " ".join(
            f"{key}: {value}"
            for key, value in value.items()
            if value is not None
        )

    return str(value).strip()


# ============================================================
# PROFILE → SEMANTIC TEXT
# ============================================================

def build_profile_text(profile):
    """
    Convert a normalized SICR profile into focused semantic text.
    Only descriptive, matching-relevant fields are included.
    """
    if not isinstance(profile, dict):
        raise ValueError("Profile must be a dictionary.")

    sections = []

    def render_value(value):
        if value is None:
            return ""
        if isinstance(value, dict):
            parts = []
            excluded = {
                "id", "_id", "profileid", "userid", "accountid",
                "email", "password", "token", "profilestatus",
                "profilecompletion"
            }
            for key, item in value.items():
                if str(key).lower() in excluded:
                    continue
                rendered = render_value(item)
                if rendered:
                    parts.append(f"{key}: {rendered}")
            return "; ".join(parts)
        if isinstance(value, (list, tuple, set)):
            return ", ".join(
                rendered
                for item in value
                if (rendered := render_value(item))
            )
        return str(value).strip()

    def add_section(label, value):
        rendered = render_value(value)
        if rendered:
            sections.append(f"{label}: {rendered}")

    field_labels = {
        "profileType": "Ecosystem profile type",
        "role": "Role",
        "domain": "Business domain",
        "industry": "Industry",
        "sectors": "Sectors",
        "expertise": "Expertise",
        "skills": "Skills",
        "description": "Profile description and background",
        "offering": "What this member offers",
        "needs": "Current needs",
        "requirements": "Requirements",
        "stage": "Startup or business stage",
        "location": "Location",
        "interests": "Interests",
        "connections": "Desired connections",
        "opportunities": "Opportunities",
        "collaborationInterests": "Collaboration interests",
        "experience": "Experience",
    }

    for field, label in field_labels.items():
        if field in profile:
            add_section(label, profile.get(field))

    metadata = profile.get("metadata")
    if isinstance(metadata, dict):
        for field, label in {
            "ecosystem": "Ecosystem",
            "title": "Professional title",
            "organization": "Organization",
        }.items():
            add_section(label, metadata.get(field))

    funding = profile.get("funding")
    if isinstance(funding, dict):
        add_section("Funding details", funding)

    return "\n".join(sections)

# ============================================================
# EMBEDDING GENERATION
# ============================================================

def generate_embedding(text):
    """
    Generate a normalized semantic embedding.
    """

    if not text or not text.strip():
        raise ValueError(
            "Cannot generate embedding from empty text."
        )

    embedding = model.encode(
        text,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    return embedding


# ============================================================
# COSINE SIMILARITY
# ============================================================

def semantic_similarity(text_a, text_b):
    """
    Calculate semantic similarity between two pieces of text.

    Because embeddings are normalized, the dot product is
    equivalent to cosine similarity.
    """

    embedding_a = generate_embedding(text_a)
    embedding_b = generate_embedding(text_b)

    similarity = float(
        np.dot(embedding_a, embedding_b)
    )

    return similarity


# ============================================================
# PROFILE SIMILARITY
# ============================================================

def profile_similarity(profile_a, profile_b):
    """
    Compare two SICR profiles semantically.
    """

    text_a = build_profile_text(profile_a)
    text_b = build_profile_text(profile_b)

    similarity = semantic_similarity(
        text_a,
        text_b
    )

    return {
        "similarity": round(similarity, 6),
        "percentage": round(
            max(0.0, similarity) * 100,
            2
        ),
        "profileA": text_a,
        "profileB": text_b
    }


# ============================================================
# UNIVERSAL MATCH
# ============================================================

def universal_match(source_profile, candidate_profiles):
    """
    Compare one source profile against multiple candidate
    profiles.

    This function is ecosystem-independent.

    candidate_profiles can eventually contain:
        - Investors
        - Mentors
        - Corporates
        - Partnerships
        - Sponsors
        - T-Bridge users
        - Other SICR ecosystem profiles
    """

    if not isinstance(source_profile, dict):
        raise ValueError(
            "source_profile must be a dictionary."
        )

    if not isinstance(candidate_profiles, list):
        raise ValueError(
            "candidate_profiles must be a list."
        )

    source_text = build_profile_text(
        source_profile
    )

    if not source_text:
        raise ValueError(
            "Source profile does not contain usable information."
        )

    source_embedding = generate_embedding(
        source_text
    )

    results = []

    for index, candidate in enumerate(candidate_profiles):

        if not isinstance(candidate, dict):
            continue

        candidate_text = build_profile_text(
            candidate
        )

        if not candidate_text:
            continue

        candidate_embedding = generate_embedding(
            candidate_text
        )

        similarity = float(
            np.dot(
                source_embedding,
                candidate_embedding
            )
        )

        results.append({
            "candidateIndex": index,
            "similarity": round(
                similarity,
                6
            ),
            "matchPercentage": round(
                max(0.0, similarity) * 100,
                2
            ),
            "profile": candidate
        })

    results.sort(
        key=lambda item: item["similarity"],
        reverse=True
    )

    return results


# ============================================================
# TEST PROFILES
# ============================================================

if __name__ == "__main__":

    print("\n")
    print("=" * 70)
    print("RUNNING UNIVERSAL SEMANTIC ENGINE TEST")
    print("=" * 70)

    startup = {
        "userType": "STARTUP",
        "role": "Founder",
        "domain": "Automobile",
        "industry": "Electric Vehicles",
        "idea": (
            "AI powered automobile accident detection "
            "platform using intelligent cameras and sensors"
        ),
        "stage": "MVP",
        "needs": [
            "Funding",
            "Automobile industry expertise",
            "Technical mentorship"
        ],
        "location": "Mumbai"
    }

    candidates = [

        {
            "userType": "INVESTOR",
            "role": "Angel Investor",
            "domain": "Automobile",
            "industry": "Electric Vehicles",
            "expertise": [
                "Automotive technology",
                "EV startups",
                "Mobility"
            ],
            "offering": [
                "Startup funding",
                "Business networking"
            ],
            "location": "Mumbai"
        },

        {
            "userType": "MENTOR",
            "role": "Automobile Technology Expert",
            "domain": "Automobile",
            "industry": "Automotive Engineering",
            "expertise": [
                "Vehicle safety",
                "Automotive systems",
                "AI",
                "Computer vision"
            ],
            "offering": [
                "Technical mentorship",
                "Product validation"
            ],
            "location": "Mumbai"
        },

        {
            "userType": "CORPORATE",
            "role": "Software Services Company",
            "domain": "Information Technology",
            "industry": "Enterprise Software",
            "expertise": [
                "Web development",
                "Cloud computing",
                "ERP"
            ],
            "offering": [
                "Software outsourcing"
            ],
            "location": "Pune"
        }
    ]

    print("\nSOURCE PROFILE")
    print("-" * 70)

    print(
        build_profile_text(startup)
    )

    print("\nGENERATING UNIVERSAL MATCHES...")
    print("-" * 70)

    matches = universal_match(
        startup,
        candidates
    )

    for rank, result in enumerate(
        matches,
        start=1
    ):

        profile = result["profile"]

        print(
            f"\n#{rank} "
            f"{profile.get('userType', 'UNKNOWN')}"
        )

        print(
            f"Role: "
            f"{profile.get('role', 'N/A')}"
        )

        print(
            f"Similarity: "
            f"{result['similarity']}"
        )

        print(
            f"Match: "
            f"{result['matchPercentage']}%"
        )

    print("\n")
    print("=" * 70)
    print("UNIVERSAL SEMANTIC ENGINE TEST COMPLETED")
    print("=" * 70)
    
    # ============================================================
# SEMANTIC GLOBAL SEARCH
# ============================================================

def semantic_search(query, candidate_profiles, top_n=10):
    """
    Semantic global search across SICR ecosystem profiles.
    Uses cosine similarity plus a small query-intent ranking adjustment.
    The resulting matchPercentage is a ranking score, not a probability.
    """

    if not query or not str(query).strip():
        return []

    if not isinstance(candidate_profiles, list):
        return []

    query_text = normalize_text(query)
    if not query_text:
        return []

    # Keep the original wording for intent detection.
    intent_query = str(query).lower()
    query_embedding = generate_embedding(query_text)
    results = []

    def flatten(value):
        if isinstance(value, dict):
            return " ".join(flatten(v) for v in value.values())
        if isinstance(value, (list, tuple, set)):
            return " ".join(flatten(v) for v in value)
        if value is None:
            return ""
        return str(value)

    def intent_adjustment(profile):
        ecosystem = str(
            profile.get("ecosystem")
            or profile.get("profileType")
            or profile.get("userType")
            or ""
        ).upper().replace("-", "_").replace(" ", "_")

        needs_text = flatten(
            profile.get("needs")
            or profile.get("requirements")
            or profile.get("currentNeeds")
        ).lower()

        offers_text = flatten(
            profile.get("offering")
            or profile.get("offers")
            or profile.get("funding")
        ).lower()

        boost = 0.0

        investor_intent = any(term in intent_query for term in (
            "investor", "investors", "funder", "funders",
            "funding", "venture capital", "angel investor",
            "investment", "investments", "raise capital"
        ))

        mentor_intent = any(term in intent_query for term in (
            "mentor", "mentorship", "guidance", "career advice"
        ))

        sponsor_intent = any(term in intent_query for term in (
            "sponsor", "sponsors", "sponsorship"
        ))

        partnership_intent = any(term in intent_query for term in (
            "partner", "partners", "partnership", "collaboration"
        ))

        corporate_intent = any(term in intent_query for term in (
            "corporate", "company", "companies", "business organization"
        ))

        startup_intent = any(term in intent_query for term in (
            "startup", "startups", "founder", "founders", "entrepreneur"
        ))

        investor_types = ("INVESTOR", "INVESTOR_FUNDER", "FUNDER")

        if investor_intent:
            if any(kind in ecosystem for kind in investor_types):
                boost += 0.12

            funding_need_terms = (
                "funding", "investor", "investment", "capital",
                "financial support", "grant"
            )
            if ecosystem == "STARTUP" and any(
                term in needs_text for term in funding_need_terms
            ):
                boost += 0.08

            if any(term in offers_text for term in (
                "funding", "investment", "grant", "capital"
            )):
                boost += 0.03

        if mentor_intent and "MENTOR" in ecosystem:
            boost += 0.10

        if sponsor_intent and "SPONSOR" in ecosystem:
            boost += 0.10

        if partnership_intent and "PARTNERSHIP" in ecosystem:
            boost += 0.10

        if corporate_intent and "CORPORATE" in ecosystem:
            boost += 0.10

        if startup_intent and "STARTUP" in ecosystem:
            boost += 0.10

        return boost

    for index, candidate in enumerate(candidate_profiles):
        try:
            if not isinstance(candidate, dict):
                continue

            candidate_text = build_profile_text(candidate)
            if not candidate_text or not candidate_text.strip():
                continue

            candidate_embedding = generate_embedding(candidate_text)

            similarity = float(
                np.dot(query_embedding, candidate_embedding)
            )
            similarity = max(-1.0, min(1.0, similarity))

            adjustment = intent_adjustment(candidate)
            ranking_score = max(0.0, min(1.0, similarity + adjustment))

            results.append({
                "candidateIndex": index,
                "similarity": round(similarity, 6),
                "intentAdjustment": round(adjustment, 4),
                "rankingScore": round(ranking_score, 6),
                "matchPercentage": round(ranking_score * 100, 2),
                "profile": candidate
            })

        except Exception as error:
            print(
                f"Semantic search skipped candidate {index}:",
                repr(error)
            )

    # Rank using semantic similarity plus the small intent adjustment.
    results.sort(
        key=lambda item: item.get("rankingScore", item["similarity"]),
        reverse=True
    )

    try:
        top_n = int(top_n)
    except (TypeError, ValueError):
        top_n = 10

    if top_n < 1:
        top_n = 1

    return results[:top_n]

