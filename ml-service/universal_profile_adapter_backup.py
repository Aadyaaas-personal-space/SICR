"""
SICR Universal Profile Adapter

Converts different SICR ecosystem profiles into one common
semantic representation.

This module does NOT connect to MongoDB.
It only handles profile normalization.
"""

from typing import Any, Dict, List


# ============================================================
# BASIC HELPERS
# ============================================================

def clean_value(value: Any) -> str:
    """
    Convert a value into clean text.
    """

    if value is None:
        return ""

    if isinstance(value, list):
        values = []

        for item in value:
            cleaned = clean_value(item)

            if cleaned:
                values.append(cleaned)

        return ", ".join(values)

    if isinstance(value, dict):
        values = []

        for key, item in value.items():

            cleaned = clean_value(item)

            if cleaned:
                values.append(
                    f"{key}: {cleaned}"
                )

        return "; ".join(values)

    return str(value).strip()


def clean_list(value: Any) -> List[str]:
    """
    Convert a value into a clean list of strings.
    """

    if value is None:
        return []

    if isinstance(value, list):

        result = []

        for item in value:

            cleaned = clean_value(item)

            if cleaned:
                result.append(cleaned)

        return result

    cleaned = clean_value(value)

    if not cleaned:
        return []

    return [cleaned]


def first_value(profile: Dict[str, Any], *fields) -> str:
    """
    Return the first non-empty field.
    """

    for field in fields:

        value = clean_value(
            profile.get(field)
        )

        if value:
            return value

    return ""


# ============================================================
# UNIVERSAL PROFILE FACTORY
# ============================================================

def create_universal_profile(
    profile_type: str,
    profile: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Convert an SICR profile into the Universal Profile format.
    """

    profile_type = (
        str(profile_type)
        .strip()
        .upper()
    )

    if not isinstance(profile, dict):
        raise ValueError(
            "profile must be a dictionary"
        )

    if profile_type == "STARTUP":

        return adapt_startup(profile)

    if profile_type in [
        "INVESTOR",
        "FUNDER",
        "INVESTOR_FUNDER"
    ]:

        return adapt_investor_funder(profile)

    if profile_type == "MENTOR":

        return adapt_mentor(profile)

    if profile_type == "CORPORATE":

        return adapt_corporate(profile)

    raise ValueError(
        f"Unsupported profile type: {profile_type}"
    )


# ============================================================
# STARTUP ADAPTER
# ============================================================

def adapt_startup(
    profile: Dict[str, Any]
) -> Dict[str, Any]:

    universal = {

        "profileId": first_value(
            profile,
            "_id",
            "id",
            "account"
        ),

        "profileType": "STARTUP",

        "role": first_value(
            profile,
            "role"
        ) or "Founder",

        "domain": [],

        "industry": [],

        "expertise": [],

        "skills": [],

        "description": first_value(
            profile,
            "plannedToBuild"
        ),

        "offering": [],

        "needs": clean_list(
            profile.get("currentNeeds")
        ),

        "requirements": clean_list(
            profile.get("currentNeeds")
        ),

        "stage": first_value(
            profile,
            "stage",
            "startupStage"
        ),

        "location": [],

        "funding": {},

        "interests": clean_list(
            profile.get("connectionInterests")
        ),

        "connections": clean_list(
            profile.get("connectionInterests")
        ),

        "opportunities": clean_list(
            profile.get("opportunityInterests")
        ),

        "resources": clean_list(
            profile.get("existingResources")
        ),

        "currentPosition": first_value(
            profile,
            "currentPosition"
        ),

        "plannedToBuild": first_value(
            profile,
            "plannedToBuild"
        ),

        "rawProfile": profile
    }

    # Startup idea / planned product
    idea = first_value(
        profile,
        "plannedToBuild"
    )

    if idea:
        universal["description"] = idea

    return universal


# ============================================================
# INVESTOR / FUNDER ADAPTER
# ============================================================

def adapt_investor_funder(
    profile: Dict[str, Any]
) -> Dict[str, Any]:

    universal = {

        "profileId": first_value(
            profile,
            "_id",
            "id"
        ),

        "profileType": "INVESTOR_FUNDER",

        "role": first_value(
            profile,
            "fundingRole",
            "profileType",
            "role"
        ) or "Investor/Funder",

        "domain": clean_list(
            profile.get("industries")
        ),

        "industry": clean_list(
            profile.get("industries")
        ),

        "sectors": clean_list(
            profile.get("sectors")
        ),

        "expertise": clean_list(
            profile.get("expertise")
        ),

        "skills": [],

        "description": first_value(
            profile,
            "organizationDescription",
            "bio"
        ),

        "offering": [],

        "needs": [],

        "requirements": [],

        "stage": clean_list(
            profile.get(
                "preferredStartupStages"
            )
        ),

        "location": [],

        "funding": {

            "types": clean_list(
                profile.get("fundingTypes")
            ),

            "minimum": profile.get(
                "minimumInvestment"
            ),

            "maximum": profile.get(
                "maximumInvestment"
            ),

            "currency": first_value(
                profile,
                "preferredCurrency"
            )
        },

        "organization": first_value(
            profile,
            "organizationName"
        ),

        "designation": first_value(
            profile,
            "designation"
        ),

        "experience": profile.get(
            "yearsOfExperience"
        ),

        "riskPreference": first_value(
            profile,
            "riskPreference"
        ),

        "businessModels": clean_list(
            profile.get("businessModels")
        ),

        "preferredCountries": clean_list(
            profile.get("preferredCountries")
        ),

        "preferredRegions": clean_list(
            profile.get("preferredRegions")
        ),

        "rawProfile": profile
    }

    # Location
    location_parts = []

    for field in [
        "city",
        "state",
        "country"
    ]:

        value = first_value(
            profile,
            field
        )

        if value:
            location_parts.append(value)

    universal["location"] = location_parts

    # Funding is an offering
    funding_types = universal[
        "funding"
    ]["types"]

    if funding_types:
        universal["offering"].extend(
            funding_types
        )

    if universal["funding"]["minimum"] is not None:
        universal["offering"].append(
            f"Minimum investment: "
            f"{universal['funding']['minimum']}"
        )

    if universal["funding"]["maximum"] is not None:
        universal["offering"].append(
            f"Maximum investment: "
            f"{universal['funding']['maximum']}"
        )

    return universal


# ============================================================
# MENTOR ADAPTER
# ============================================================

def adapt_mentor(
    profile: Dict[str, Any]
) -> Dict[str, Any]:

    universal = {

        "profileId": first_value(
            profile,
            "_id",
            "id",
            "mentor"
        ),

        "profileType": "MENTOR",

        "role": first_value(
            profile,
            "mentorType",
            "currentPosition"
        ) or "Mentor",

        "domain": clean_list(
            profile.get("industries")
        ),

        "industry": clean_list(
            profile.get("industries")
        ),

        "expertise": clean_list(
            profile.get("areasOfExpertise")
        ),

        "skills": clean_list(
            profile.get("skills")
        ),

        "description": first_value(
            profile,
            "bio"
        ),

        "offering": clean_list(
            profile.get("supportOffered")
        ),

        "needs": clean_list(
            profile.get("interestedIn")
        ),

        "requirements": [],

        "stage": clean_list(
            profile.get(
                "preferredStartupStages"
            )
        ),

        "location": [],

        "funding": {},

        "mentorshipAreas": clean_list(
            profile.get("mentorshipAreas")
        ),

        "mentorshipMode": clean_list(
            profile.get("mentorshipMode")
        ),

        "experience": profile.get(
            "yearsOfExperience"
        ),

        "organization": first_value(
            profile,
            "organization"
        ),

        "availability": first_value(
            profile,
            "availability"
        ),

        "geography": first_value(
            profile,
            "geography"
        ),

        "rawProfile": profile
    }

    # Location can exist in multiple forms
    location = []

    for field in [
        "location",
        "geography"
    ]:

        value = first_value(
            profile,
            field
        )

        if value:
            location.append(value)

    universal["location"] = location

    # Mentorship areas are both expertise and offering
    for item in universal["mentorshipAreas"]:

        if item not in universal["expertise"]:
            universal["expertise"].append(item)

        if item not in universal["offering"]:
            universal["offering"].append(item)

    return universal


# ============================================================
# CORPORATE ADAPTER
# ============================================================

def adapt_corporate(
    profile: Dict[str, Any]
) -> Dict[str, Any]:

    universal = {

        "profileId": first_value(
            profile,
            "_id",
            "id"
        ),

        "profileType": "CORPORATE",

        "role": clean_list(
            profile.get("ecosystemRole")
        ),

        "domain": clean_list(
            profile.get("industryDomain")
        ),

        "industry": clean_list(
            profile.get("industryDomain")
        ),

        "expertise": [],

        "skills": [],

        "description": "",

        "offering": clean_list(
            profile.get("companyOffers")
        ),

        "needs": clean_list(
            profile.get("companyNeeds")
        ),

        "requirements": clean_list(
            profile.get("companyNeeds")
        ),

        "stage": [],

        "location": [],

        "funding": {},

        "collaborationInterests": clean_list(
            profile.get(
                "collaborationInterests"
            )
        ),

        "organization": first_value(
            profile,
            "companyName"
        ),

        "rawProfile": profile
    }

    return universal


# ============================================================
# SEMANTIC TEXT GENERATOR
# ============================================================

def universal_profile_to_text(
    universal_profile: Dict[str, Any]
) -> str:
    """
    Convert the universal profile into meaning-rich text
    suitable for SentenceTransformer embeddings.
    """

    sections = []

    def add(label, value):

        cleaned = clean_value(value)

        if cleaned:
            sections.append(
                f"{label}: {cleaned}"
            )

    add(
        "Profile type",
        universal_profile.get(
            "profileType"
        )
    )

    add(
        "Role",
        universal_profile.get(
            "role"
        )
    )

    add(
        "Domain",
        universal_profile.get(
            "domain"
        )
    )

    add(
        "Industry",
        universal_profile.get(
            "industry"
        )
    )

    add(
        "Sectors",
        universal_profile.get(
            "sectors"
        )
    )

    add(
        "Expertise",
        universal_profile.get(
            "expertise"
        )
    )

    add(
        "Skills",
        universal_profile.get(
            "skills"
        )
    )

    add(
        "Description",
        universal_profile.get(
            "description"
        )
    )

    add(
        "What this profile offers",
        universal_profile.get(
            "offering"
        )
    )

    add(
        "Current needs",
        universal_profile.get(
            "needs"
        )
    )

    add(
        "Requirements",
        universal_profile.get(
            "requirements"
        )
    )

    add(
        "Startup stage preference",
        universal_profile.get(
            "stage"
        )
    )

    add(
        "Location",
        universal_profile.get(
            "location"
        )
    )

    add(
        "Funding",
        universal_profile.get(
            "funding"
        )
    )

    add(
        "Interests",
        universal_profile.get(
            "interests"
        )
    )

    add(
        "Connections",
        universal_profile.get(
            "connections"
        )
    )

    add(
        "Collaboration interests",
        universal_profile.get(
            "collaborationInterests"
        )
    )

    add(
        "Experience",
        universal_profile.get(
            "experience"
        )
    )

    return "\n".join(sections)


# ============================================================
# LOCAL TEST
# ============================================================

if __name__ == "__main__":

    print("=" * 70)
    print("SICR UNIVERSAL PROFILE ADAPTER TEST")
    print("=" * 70)

    startup = {
        "_id": "startup001",
        "role": "founder",
        "currentPosition": "Founder",
        "plannedToBuild": (
            "AI powered automobile accident detection "
            "platform using cameras and sensors"
        ),
        "existingResources": (
            "Prototype and technical team"
        ),
        "currentNeeds": (
            "Funding, automobile expertise and mentorship"
        ),
        "connectionInterests": (
            "Automobile investors and mentors"
        ),
        "opportunityInterests": (
            "Industry partnerships"
        )
    }

    investor = {
        "_id": "investor001",
        "firstName": "Test",
        "lastName": "Investor",
        "role": "INVESTOR_FUNDER",
        "profileType": "ANGEL_INVESTOR",
        "city": "Mumbai",
        "industries": [
            "Automobile",
            "Electric Vehicles"
        ],
        "sectors": [
            "Mobility"
        ],
        "fundingRole": "Angel Investor",
        "fundingTypes": [
            "EQUITY"
        ],
        "preferredStartupStages": [
            "MVP",
            "EARLY_STAGE"
        ],
        "minimumInvestment": 500000,
        "maximumInvestment": 5000000,
        "expertise": [
            "Automotive technology",
            "Startup investment"
        ],
        "bio": (
            "Investor focused on automotive "
            "and technology startups"
        )
    }

    mentor = {
        "_id": "mentor001",
        "currentPosition": (
            "Automobile Technology Expert"
        ),
        "mentorType": "Industry Mentor",
        "industries": [
            "Automobile",
            "Electric Vehicles"
        ],
        "areasOfExpertise": [
            "Vehicle Safety",
            "Automotive Engineering"
        ],
        "skills": [
            "AI",
            "Computer Vision"
        ],
        "mentorshipAreas": [
            "Product Validation",
            "Technical Strategy"
        ],
        "supportOffered": [
            "Technical Mentorship"
        ],
        "location": "Mumbai",
        "yearsOfExperience": 12
    }

    corporate = {
        "_id": "corporate001",
        "companyName": "Automotive Technology Company",
        "industryDomain": "Automobile",
        "ecosystemRole": [
            "Industry Partner"
        ],
        "companyOffers": [
            "Manufacturing support",
            "Industry connections"
        ],
        "companyNeeds": [
            "Innovative automotive technology"
        ],
        "collaborationInterests": [
            "Startup collaboration",
            "Technology partnerships"
        ]
    }

    profiles = [
        ("STARTUP", startup),
        ("INVESTOR", investor),
        ("MENTOR", mentor),
        ("CORPORATE", corporate)
    ]

    for profile_type, profile in profiles:

        print("\n")
        print("-" * 70)
        print(f"PROFILE TYPE: {profile_type}")
        print("-" * 70)

        universal = create_universal_profile(
            profile_type,
            profile
        )

        print("\nUNIVERSAL PROFILE:")

        for key, value in universal.items():

            if key == "rawProfile":
                continue

            print(
                f"{key}: {value}"
            )

        print("\nSEMANTIC TEXT:")

        print(
            universal_profile_to_text(
                universal
            )
        )

    print("\n")
    print("=" * 70)
    print("UNIVERSAL PROFILE ADAPTER TEST COMPLETED")
    print("=" * 70)