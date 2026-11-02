from pathlib import Path

path = Path(r"ml-service/universal_matching_engine.py")
source = path.read_text(encoding="utf-8")

marker = "def semantic_search(query, candidate_profiles, top_n=10):"

if source.count(marker) != 1:
    raise SystemExit(
        "Expected exactly one semantic_search function. "
        "No changes were written."
    )

helper = '''def _intent_ranking_adjustment(query, profile):
    """
    Small ranking bonus for clear ecosystem and funding intent.
    The original cosine similarity remains available separately.
    """
    query_text = str(query or "").lower()

    profile_type = str(
        profile.get("profileType")
        or profile.get("ecosystem")
        or ""
    ).upper().replace("-", "_")

    def flatten(value):
        if value is None:
            return ""
        if isinstance(value, dict):
            return " ".join(
                flatten(key) + " " + flatten(item)
                for key, item in value.items()
            )
        if isinstance(value, (list, tuple, set)):
            return " ".join(flatten(item) for item in value)
        return str(value).lower()

    needs_text = flatten(profile.get("needs"))
    requirements_text = flatten(profile.get("requirements"))
    offers_text = flatten(
        profile.get("offering") or profile.get("offers")
    )

    adjustment = 0.0

    funding_intent = any(term in query_text for term in (
        "investor", "investors", "funder", "funders",
        "funding", "venture capital", "angel investor",
        "raise capital", "investment"
    ))

    if funding_intent:
        if profile_type in ("INVESTOR", "INVESTOR_FUNDER", "FUNDER"):
            adjustment = max(adjustment, 0.10)

        startup_needs = needs_text + " " + requirements_text
        if (
            profile_type == "STARTUP"
            and any(term in startup_needs for term in (
                "funding", "investor", "investment",
                "capital", "financial support", "grant"
            ))
        ):
            adjustment = max(adjustment, 0.08)

        if any(term in offers_text for term in (
            "funding", "investment", "venture capital",
            "angel investment", "financial support"
        )):
            adjustment = max(adjustment, 0.04)

    intent_groups = (
        (
            ("mentor", "mentoring", "mentorship"),
            ("MENTOR",),
        ),
        (
            ("partnership", "collaboration", "collaborate"),
            ("PARTNERSHIP",),
        ),
        (
            ("sponsor", "sponsorship", "sponsoring"),
            ("SPONSORSHIP",),
        ),
        (
            ("corporate partner", "corporate collaboration"),
            ("CORPORATE",),
        ),
        (
            ("startup", "startups", "founder", "founders"),
            ("STARTUP",),
        ),
    )

    for terms, profile_types in intent_groups:
        if any(term in query_text for term in terms):
            if profile_type in profile_types:
                adjustment = max(adjustment, 0.08)

    return adjustment


'''

source = source.replace(marker, helper + marker, 1)

old_block = '''            results.append({
                "candidateIndex": index,
                "similarity": round(similarity, 6),
                "matchPercentage": round(
                    max(0.0, similarity) * 100,
                    2
                ),
                "profile": candidate
            })
'''

new_block = '''            intent_adjustment = _intent_ranking_adjustment(
                query_text,
                candidate
            )

            ranking_score = max(
                -1.0,
                min(1.0, similarity + intent_adjustment)
            )

            results.append({
                "candidateIndex": index,
                "similarity": round(similarity, 6),
                "rankingScore": round(ranking_score, 6),
                "intentAdjustment": round(intent_adjustment, 4),
                "matchPercentage": round(
                    max(0.0, ranking_score) * 100,
                    2
                ),
                "profile": candidate
            })
'''

if source.count(old_block) != 1:
    raise SystemExit(
        "Could not find the exact result block. "
        "The backup exists, but the source was not changed."
    )

source = source.replace(old_block, new_block, 1)

old_sort = '''    results.sort(
        key=lambda item: item["similarity"],
        reverse=True
    )
'''

new_sort = '''    results.sort(
        key=lambda item: item.get(
            "rankingScore",
            item["similarity"]
        ),
        reverse=True
    )
'''

if source.count(old_sort) != 1:
    raise SystemExit(
        "Could not find the exact sort block. "
        "The source was not changed."
    )

source = source.replace(old_sort, new_sort, 1)

path.write_text(source, encoding="utf-8")
print("Intent-aware ranking added successfully.")
