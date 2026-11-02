from pathlib import Path
import re

path = Path("ml-service/universal_matching_engine.py")
source = path.read_text(encoding="utf-8")

pattern = r"def build_profile_text\(profile\):.*?(?=\n# =+\n# EMBEDDING GENERATION)"

replacement = '''def build_profile_text(profile):
    """
    Build focused semantic text from meaningful SICR profile fields.

    Excludes identifiers, email addresses, authentication metadata,
    profile status fields and other non-descriptive values.
    """

    if not isinstance(profile, dict):
        raise ValueError("Profile must be a dictionary.")

    field_labels = {
        "ecosystem": "Ecosystem",
        "profileType": "Profile type",
        "userType": "User type",
        "type": "Member type",
        "role": "Role",
        "name": "Name",
        "title": "Professional title",
        "organization": "Organization",
        "organizationName": "Organization",
        "companyName": "Company",
        "domain": "Business domain",
        "industry": "Industry",
        "industries": "Industries",
        "sectors": "Sectors",
        "expertise": "Expertise",
        "skills": "Skills",
        "idea": "Startup idea",
        "plannedToBuild": "What the startup plans to build",
        "description": "Description",
        "bio": "Profile introduction",
        "stage": "Startup stage",
        "startupStage": "Startup stage",
        "needs": "Current needs",
        "currentNeeds": "Current needs",
        "requirements": "Requirements",
        "offering": "Offerings",
        "offers": "Offerings",
        "companyOffers": "Company offerings",
        "companyNeeds": "Company needs",
        "fundingType": "Funding type",
        "fundingTypes": "Funding types",
        "fundingRange": "Funding range",
        "minimumInvestment": "Minimum investment",
        "maximumInvestment": "Maximum investment",
        "location": "Location",
        "city": "City",
        "state": "State",
        "country": "Country",
        "experience": "Experience",
        "interests": "Interests",
        "goals": "Goals",
        "connections": "Desired connections",
        "preferredStartupStages": "Preferred startup stages",
        "preferredIndustries": "Preferred industries",
        "preferredCountries": "Preferred countries",
        "preferredRegions": "Preferred regions",
        "mentorshipAreas": "Mentorship areas",
        "areasOfExpertise": "Areas of expertise",
        "supportOffered": "Support offered",
        "collaborationInterests": "Collaboration interests",
        "collaborationNeeds": "Collaboration needs",
        "collaborationRole": "Partnership role",
        "collaborationScale": "Partnership scale",
        "sponsorshipTypes": "Sponsorship types",
        "sponsorshipPurpose": "Sponsorship purpose",
        "targetAudience": "Target audience",
        "benefits": "Benefits offered",
        "professionalType": "Professional type",
        "currentPosition": "Current position",
        "existingResources": "Existing resources",
        "connectionInterests": "Desired connections",
        "opportunityInterests": "Opportunity interests",
        "businessModels": "Business models",
        "fundingRole": "Funding role",
        "fundingConditions": "Funding conditions",
        "riskPreference": "Risk preference",
        "investmentFrequency": "Investment frequency",
        "availability": "Availability",
        "mentorshipMode": "Mentorship mode",
        "geography": "Preferred geography",
        "conditions": "Conditions",
    }

    sections = []

    for field, label in field_labels.items():
        if field not in profile:
            continue

        value = normalize_text(profile.get(field))
        if value:
            sections.append(f"{label}: {value}")

    # Also include the adapter's prepared semantic summary.
    # It contains useful descriptive content, not credentials.
    if "searchText" in profile:
        value = normalize_text(profile.get("searchText"))
        if value:
            sections.append(f"Search summary: {value}")

    return "\\\\n".join(sections)
'''

updated, count = re.subn(pattern, replacement, source, count=1, flags=re.S)

if count != 1:
    raise SystemExit(
        "Safety check failed: expected function boundary not found. "
        "No changes were written."
    )

path.write_text(updated, encoding="utf-8")
print("Updated build_profile_text() successfully.")
