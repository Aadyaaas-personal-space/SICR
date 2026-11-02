from pathlib import Path
import re

path = Path("ml-service/universal_matching_engine.py")
source = path.read_text(encoding="utf-8")
pattern = r"def build_profile_text\(profile\):.*?(?=\n# =+\n# EMBEDDING GENERATION)"

replacement = r'''def build_profile_text(profile):
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
'''

updated, count = re.subn(
    pattern, lambda _: replacement, source, count=1, flags=re.S
)
if count != 1:
    raise SystemExit(
        "Safety check failed: function boundary not found. No changes written."
    )

path.write_text(updated, encoding="utf-8")
print("Updated semantic profile text successfully.")
