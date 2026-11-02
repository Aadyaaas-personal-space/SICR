from pathlib import Path
import re
import shutil
import subprocess
import sys
from datetime import datetime

target = Path("ml-service/universal_matching_engine.py")
source = target.read_text(encoding="utf-8")

start = source.find("def semantic_search(")
if start == -1:
    raise SystemExit("ERROR: semantic_search() was not found. No changes made.")

next_function = re.search(r"(?m)^def\s+\w+\s*\(", source[start + 1:])
if next_function:
    end = start + 1 + next_function.start()
else:
    end = len(source)

old_function = source[start:end]

if '"candidateIndex"' not in old_function or 'results.sort(' not in old_function:
    raise SystemExit("ERROR: The function structure was unexpected. No changes made.")

new_function = '''def semantic_search(query, candidate_profiles, top_n=10):
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
'''

backup = target.with_name(
    target.name + ".backup-before-intent-ranking-" +
    datetime.now().strftime("%Y%m%d-%H%M%S")
)
shutil.copy2(target, backup)

updated = source[:start] + new_function.rstrip() + "\n\n" + source[end:].lstrip("\n")
target.write_text(updated, encoding="utf-8")

python_exe = sys.executable
check = subprocess.run(
    [python_exe, "-m", "py_compile", str(target)],
    capture_output=True,
    text=True
)

if check.returncode != 0:
    shutil.copy2(backup, target)
    print(check.stderr)
    raise SystemExit(
        f"Syntax check failed. Original file restored from: {backup}"
    )

print("SUCCESS: semantic_search() updated.")
print(f"Backup: {backup}")
print("Python syntax check passed.")
