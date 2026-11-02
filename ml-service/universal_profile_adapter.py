"""
SICR - Universal Profile Adapter
--------------------------------
Converts different SICR ecosystem profiles into one
common Universal Profile structure.

Supported:
    STARTUP
    INVESTOR / FUNDER
    MENTOR
    CORPORATE
    PARTNERSHIP
    SPONSORSHIP
    TBRIDGE

This adapter does NOT perform matching.
It only normalizes profile data so that the
Universal Semantic Matching Engine can work
across all ecosystems.
"""

from typing import Any, Dict, List


# ============================================================
# BASIC HELPERS
# ============================================================

def clean_value(value: Any) -> str:
    """
    Convert a value into a clean string.
    """
    if value is None:
        return ""

    if isinstance(value, str):
        return value.strip()

    return str(value).strip()


def clean_list(value: Any) -> List[str]:
    """
    Convert strings, lists, tuples or sets into
    a clean list of strings.
    """

    if value is None:
        return []

    if isinstance(value, str):
        value = value.strip()

        if not value:
            return []

        return [value]

    if isinstance(value, (list, tuple, set)):
        result = []

        for item in value:
            item = clean_value(item)

            if item:
                result.append(item)

        return result

    value = clean_value(value)

    return [value] if value else []


def first_value(profile: Dict[str, Any], *keys, default=""):
    """
    Return the first non-empty value from the supplied keys.
    """

    for key in keys:

        value = profile.get(key)

        if value is None:
            continue

        if isinstance(value, str) and not value.strip():
            continue

        if isinstance(value, list) and len(value) == 0:
            continue

        return value

    return default


def join_text(*values) -> str:
    """
    Join non-empty values into one readable text.
    """

    parts = []

    for value in values:

        if isinstance(value, list):
            value = ", ".join(clean_list(value))

        else:
            value = clean_value(value)

        if value:
            parts.append(value)

    return " ".join(parts)


# ============================================================
# UNIVERSAL PROFILE CREATOR
# ============================================================

def create_universal_profile(
    profile_type: str,
    profile: Dict[str, Any]
) -> Dict[str, Any]:

    profile_type = clean_value(profile_type).upper()
        # ========================================================
    # GENERIC NODE PROFILE SUPPORT
    # ========================================================
    #
    # Node/Express may send already-normalized SICR profiles.
    # These profiles contain fields such as:
    # ecosystem, role, domain, industries, skills, expertise,
    # needs, offers, interests, goals, bio, location, etc.
    #
    # Handle them before schema-specific adapters.
    # ========================================================

    if (
        "ecosystem" in profile
        and any(
            key in profile
            for key in [
                "searchText",
                "industries",
                "skills",
                "expertise",
                "needs",
                "offers",
                "interests",
                "goals",
                "bio"
            ]
        )
    ):
        return adapt_generic_profile(
            profile_type,
            profile
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

    if profile_type == "PARTNERSHIP":
        return adapt_partnership(profile)

    if profile_type == "SPONSORSHIP":
        return adapt_sponsorship(profile)

    if profile_type in [
        "TBRIDGE",
        "T-BRIDGE",
        "T_BRIDGE"
    ]:
        return adapt_tbridge(profile)

    raise ValueError(
        f"Unsupported profile type: {profile_type}"
    )


# ============================================================
# COMMON EMPTY PROFILE
# ============================================================

# ============================================================
# GENERIC NORMALIZED NODE PROFILE
# ============================================================

def adapt_generic_profile(
    profile_type: str,
    profile: Dict[str, Any]
) -> Dict[str, Any]:

    result = base_profile(
        first_value(
            profile,
            "profileId",
            "_id",
            "id",
            default=""
        ),
        profile_type
    )

    # --------------------------------------------------------
    # Basic identity
    # --------------------------------------------------------

    result["role"] = clean_list(
        first_value(
            profile,
            "role",
            "title"
        )
    )

    result["domain"] = clean_list(
        first_value(
            profile,
            "domain"
        )
    )

    result["industry"] = clean_list(
        first_value(
            profile,
            "industry",
            "industries"
        )
    )

    result["sectors"] = clean_list(
        profile.get("sectors")
    )

    # --------------------------------------------------------
    # Expertise / skills
    # --------------------------------------------------------

    result["expertise"] = clean_list(
        profile.get("expertise")
    )

    result["skills"] = clean_list(
        profile.get("skills")
    )

    # --------------------------------------------------------
    # Description
    # --------------------------------------------------------

    result["description"] = join_text(
        profile.get("description"),
        profile.get("bio"),
        profile.get("searchText")
    )

    # --------------------------------------------------------
    # Offering
    # --------------------------------------------------------

    result["offering"] = clean_list(
        first_value(
            profile,
            "offering",
            "offers"
        )
    )

    # --------------------------------------------------------
    # Needs
    # --------------------------------------------------------

    result["needs"] = clean_list(
        profile.get("needs")
    )

    result["requirements"] = clean_list(
        profile.get("requirements")
    )

    # --------------------------------------------------------
    # Stage
    # --------------------------------------------------------

    result["stage"] = clean_list(
        profile.get("stage")
    )

    # --------------------------------------------------------
    # Location
    # --------------------------------------------------------

    result["location"] = clean_list(
        profile.get("location")
    )

    # --------------------------------------------------------
    # Funding
    # --------------------------------------------------------

    funding = profile.get(
        "funding",
        {}
    )

    if isinstance(funding, dict):
        result["funding"] = funding

    # --------------------------------------------------------
    # Interests
    # --------------------------------------------------------

    result["interests"] = clean_list(
        profile.get("interests")
    )

    # --------------------------------------------------------
    # Connections
    # --------------------------------------------------------

    result["connections"] = clean_list(
        profile.get("connections")
    )

    # --------------------------------------------------------
    # Opportunities
    # --------------------------------------------------------

    result["opportunities"] = clean_list(
        profile.get("opportunities")
    )

    # --------------------------------------------------------
    # Collaboration
    # --------------------------------------------------------

    result["collaborationInterests"] = clean_list(
        profile.get("collaborationInterests")
    )

    # --------------------------------------------------------
    # Experience
    # --------------------------------------------------------

    result["experience"] = clean_value(
        profile.get("experience")
    )

    # --------------------------------------------------------
    # Preserve useful metadata
    # --------------------------------------------------------

    result["metadata"] = {
        "ecosystem": clean_value(
            profile.get("ecosystem")
        ),

        "name": clean_value(
            profile.get("name")
        ),

        "title": clean_value(
            profile.get("title")
        ),

        "organization": clean_value(
            profile.get("organization")
        ),

        "profileCompletion": profile.get(
            "profileCompletion",
            0
        ),

        "profileStatus": clean_value(
            profile.get("profileStatus")
        ),

        "searchText": clean_value(
            profile.get("searchText")
        )
    }

    return result

def base_profile(
    profile_id: Any,
    profile_type: str
) -> Dict[str, Any]:

    return {
        "profileId": clean_value(profile_id),

        "profileType": profile_type,

        "role": [],

        "domain": [],

        "industry": [],

        "sectors": [],

        "expertise": [],

        "skills": [],

        "description": "",

        "offering": [],

        "needs": [],

        "requirements": [],

        "stage": [],

        "location": [],

        "funding": {},

        "interests": [],

        "connections": [],

        "opportunities": [],

        "collaborationInterests": [],

        "experience": "",

        "metadata": {}
    }


# ============================================================
# STARTUP
# ============================================================

def adapt_startup(profile: Dict[str, Any]) -> Dict[str, Any]:

    result = base_profile(
        first_value(
            profile,
            "_id",
            "id",
            "account",
            default=""
        ),
        "STARTUP"
    )

    current_position = first_value(
        profile,
        "currentPosition",
        "role",
        default="Founder"
    )

    planned_to_build = first_value(
        profile,
        "plannedToBuild",
        "idea",
        "description"
    )

    existing_resources = first_value(
        profile,
        "existingResources",
        "resources"
    )

    current_needs = first_value(
        profile,
        "currentNeeds",
        "needs"
    )

    connection_interests = first_value(
        profile,
        "connectionInterests",
        "connections"
    )

    opportunity_interests = first_value(
        profile,
        "opportunityInterests",
        "opportunities"
    )

    # --------------------------------------------------------
    # Map fields
    # --------------------------------------------------------

    result["role"] = clean_list(current_position)

    result["description"] = join_text(
        planned_to_build
    )

    result["needs"] = clean_list(
        current_needs
    )

    result["requirements"] = clean_list(
        current_needs
    )

    result["interests"] = clean_list(
        connection_interests
    )

    result["connections"] = clean_list(
        connection_interests
    )

    result["opportunities"] = clean_list(
        opportunity_interests
    )

    result["resources"] = clean_list(
        existing_resources
    )

    result["stage"] = clean_list(
        first_value(
            profile,
            "stage",
            "startupStage",
            "currentStage"
        )
    )

    result["domain"] = clean_list(
        first_value(
            profile,
            "domain",
            "domainName"
        )
    )

    result["industry"] = clean_list(
        first_value(
            profile,
            "industry",
            "industryDomain"
        )
    )

    result["location"] = clean_list(
        first_value(
            profile,
            "location",
            "city",
            "preferredLocation"
        )
    )

    result["metadata"] = {
        "email": clean_value(
            profile.get("email")
        ),
        "currentPosition": clean_value(
            current_position
        ),
        "plannedToBuild": clean_value(
            planned_to_build
        ),
        "existingResources": clean_value(
            existing_resources
        ),
        "profileCompletion": profile.get(
            "profileCompletion",
            0
        ),
        "profileStatus": clean_value(
            profile.get("profileStatus")
        )
    }

    return result


# ============================================================
# INVESTOR / FUNDER
# ============================================================

def adapt_investor_funder(
    profile: Dict[str, Any]
) -> Dict[str, Any]:

    result = base_profile(
        first_value(
            profile,
            "_id",
            "id",
            default=""
        ),
        "INVESTOR_FUNDER"
    )

    profile_type = first_value(
        profile,
        "profileType",
        "fundingRole",
        "role"
    )

    industries = clean_list(
        profile.get("industries")
    )

    sectors = clean_list(
        profile.get("sectors")
    )

    expertise = clean_list(
        profile.get("expertise")
    )

    funding_types = clean_list(
        profile.get("fundingTypes")
    )

    startup_stages = clean_list(
        profile.get("preferredStartupStages")
    )

    # --------------------------------------------------------
    # Identity
    # --------------------------------------------------------

    result["role"] = clean_list(
        profile_type
    )

    result["domain"] = industries

    result["industry"] = industries

    result["sectors"] = sectors

    result["expertise"] = expertise

    result["skills"] = expertise

    # --------------------------------------------------------
    # Description
    # --------------------------------------------------------

    result["description"] = join_text(
        profile.get("organizationDescription"),
        profile.get("bio")
    )

    # --------------------------------------------------------
    # Offering
    # --------------------------------------------------------

    result["offering"] = []

    result["offering"].extend(
        funding_types
    )

    minimum = profile.get(
        "minimumInvestment"
    )

    maximum = profile.get(
        "maximumInvestment"
    )

    currency = clean_value(
        profile.get("preferredCurrency")
    )

    if minimum:
        result["offering"].append(
            f"Minimum investment: {minimum}"
        )

    if maximum:
        result["offering"].append(
            f"Maximum investment: {maximum}"
        )

    # --------------------------------------------------------
    # Stage
    # --------------------------------------------------------

    result["stage"] = startup_stages

    # --------------------------------------------------------
    # Location
    # --------------------------------------------------------

    location = profile.get(
        "location",
        {}
    )

    if isinstance(location, dict):

        result["location"] = clean_list([
            location.get("city"),
            location.get("state"),
            location.get("country")
        ])

    else:
        result["location"] = clean_list(
            location
        )

    # --------------------------------------------------------
    # Funding
    # --------------------------------------------------------

    result["funding"] = {
        "types": funding_types,
        "minimum": minimum or 0,
        "maximum": maximum or 0,
        "currency": currency
    }

    # --------------------------------------------------------
    # Metadata
    # --------------------------------------------------------

    result["metadata"] = {

        "organizationName": clean_value(
            profile.get("organizationName")
        ),

        "organizationType": clean_value(
            profile.get("organizationType")
        ),

        "designation": clean_value(
            profile.get("designation")
        ),

        "yearsOfExperience": profile.get(
            "yearsOfExperience",
            0
        ),

        "riskPreference": clean_value(
            profile.get("riskPreference")
        ),

        "investmentFrequency": clean_value(
            profile.get("investmentFrequency")
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

        "profileType": clean_value(
            profile.get("profileType")
        )
    }

    return result


# ============================================================
# MENTOR
# ============================================================

def adapt_mentor(
    profile: Dict[str, Any]
) -> Dict[str, Any]:

    result = base_profile(
        first_value(
            profile,
            "_id",
            "id",
            "mentor",
            default=""
        ),
        "MENTOR"
    )

    industries = clean_list(
        profile.get("industries")
    )

    expertise = clean_list(
        profile.get("areasOfExpertise")
    )

    mentorship_areas = clean_list(
        profile.get("mentorshipAreas")
    )

    skills = clean_list(
        profile.get("skills")
    )

    support = clean_list(
        profile.get("supportOffered")
    )

    interested_in = clean_list(
        profile.get("interestedIn")
    )

    result["role"] = clean_list(
        first_value(
            profile,
            "mentorType",
            "currentPosition"
        )
    )

    result["domain"] = industries

    result["industry"] = industries

    result["expertise"] = (
        expertise + mentorship_areas
    )

    result["skills"] = skills

    result["description"] = clean_value(
        profile.get("bio")
    )

    result["offering"] = (
        support + mentorship_areas
    )

    result["needs"] = interested_in

    result["stage"] = clean_list(
        profile.get(
            "preferredStartupStages"
        )
    )

    result["location"] = clean_list([
        profile.get("location"),
        profile.get("geography")
    ])

    result["collaborationInterests"] = (
        interested_in
    )

    result["experience"] = clean_value(
        profile.get("yearsOfExperience")
    )

    result["metadata"] = {

        "organization": clean_value(
            profile.get("organization")
        ),

        "availability": clean_value(
            profile.get("availability")
        ),

        "mentorshipMode": clean_list(
            profile.get("mentorshipMode")
        ),

        "geography": clean_value(
            profile.get("geography")
        ),

        "profileCompletionPercentage":
            profile.get(
                "profileCompletionPercentage",
                0
            ),

        "profileCompleted":
            bool(
                profile.get(
                    "profileCompleted",
                    False
                )
            )
    }

    return result


# ============================================================
# CORPORATE
# ============================================================

def adapt_corporate(
    profile: Dict[str, Any]
) -> Dict[str, Any]:

    result = base_profile(
        first_value(
            profile,
            "_id",
            "id",
            default=""
        ),
        "CORPORATE"
    )

    result["role"] = clean_list(
        profile.get(
            "ecosystemRole"
        )
    )

    result["domain"] = clean_list(
        profile.get(
            "industryDomain"
        )
    )

    result["industry"] = clean_list(
        profile.get(
            "industryDomain"
        )
    )

    result["offering"] = clean_list(
        profile.get(
            "companyOffers"
        )
    )

    result["needs"] = clean_list(
        profile.get(
            "companyNeeds"
        )
    )

    result["requirements"] = clean_list(
        profile.get(
            "companyNeeds"
        )
    )

    result["collaborationInterests"] = (
        clean_list(
            profile.get(
                "collaborationInterests"
            )
        )
    )

    result["description"] = clean_value(
        profile.get(
            "companyDescription"
        )
    )

    result["metadata"] = {

        "companyName": clean_value(
            profile.get(
                "companyName"
            )
        ),

        "email": clean_value(
            profile.get(
                "email"
            )
        ),

        "profileCompletion":
            profile.get(
                "profileCompletion",
                0
            ),

        "profileStatus":
            clean_value(
                profile.get(
                    "profileStatus"
                )
            )
    }

    return result


# ============================================================
# PARTNERSHIP
# ============================================================

def adapt_partnership(
    profile: Dict[str, Any]
) -> Dict[str, Any]:

    result = base_profile(
        first_value(
            profile,
            "_id",
            "id",
            default=""
        ),
        "PARTNERSHIP"
    )

    result["role"] = clean_list(
        profile.get(
            "collaborationRole"
        )
    )

    result["offering"] = clean_list(
        profile.get(
            "offerings"
        )
    )

    result["needs"] = clean_list(
        profile.get(
            "collaborationNeeds"
        )
    )

    result["requirements"] = clean_list(
        profile.get(
            "collaborationNeeds"
        )
    )

    result["sectors"] = clean_list(
        profile.get(
            "sectors"
        )
    )

    result["industry"] = clean_list(
        profile.get(
            "sectors"
        )
    )

    result["collaborationInterests"] = (
        clean_list(
            profile.get(
                "collaborationNeeds"
            )
        )
    )

    result["metadata"] = {

        "email": clean_value(
            profile.get(
                "email"
            )
        ),

        "collaborationScale":
            clean_value(
                profile.get(
                    "collaborationScale"
                )
            ),

        "profileCompletion":
            profile.get(
                "profileCompletion",
                0
            ),

        "profileStatus":
            clean_value(
                profile.get(
                    "profileStatus"
                )
            )
    }

    return result


# ============================================================
# SPONSORSHIP
# ============================================================

def adapt_sponsorship(
    profile: Dict[str, Any]
) -> Dict[str, Any]:

    result = base_profile(
        first_value(
            profile,
            "_id",
            "id",
            "accountId",
            default=""
        ),
        "SPONSORSHIP"
    )

    account_type = clean_value(
        profile.get(
            "accountType"
        )
    ).lower()

    # --------------------------------------------------------
    # Role
    # --------------------------------------------------------

    if account_type == "sponsor":

        result["role"] = [
            "Sponsor"
        ]

    elif account_type == "seeker":

        result["role"] = [
            "Sponsorship Seeker"
        ]

    else:

        result["role"] = clean_list(
            account_type
        )

    # --------------------------------------------------------
    # Description
    # --------------------------------------------------------

    result["description"] = join_text(
        profile.get("description"),
        profile.get("sponsorshipPurpose")
    )

    # --------------------------------------------------------
    # Industry
    # --------------------------------------------------------

    industry = clean_value(
        profile.get(
            "industry"
        )
    )

    preferred_industries = clean_list(
        profile.get(
            "preferredIndustries"
        )
    )

    result["industry"] = (
        [industry]
        if industry
        else preferred_industries
    )

    result["domain"] = result["industry"]

    # --------------------------------------------------------
    # Offering
    # --------------------------------------------------------

    result["offering"] = clean_list(
        profile.get(
            "sponsorshipTypes"
        )
    )

    benefits = clean_value(
        profile.get(
            "benefits"
        )
    )

    if benefits:
        result["offering"].append(
            benefits
        )

    # --------------------------------------------------------
    # Needs
    # --------------------------------------------------------

    result["needs"] = clean_list(
        profile.get(
            "sponsorshipPurpose"
        )
    )

    # --------------------------------------------------------
    # Location
    # --------------------------------------------------------

    result["location"] = clean_list(
        profile.get(
            "preferredLocations"
        )
    )

    # --------------------------------------------------------
    # Funding / Budget
    # --------------------------------------------------------

    minimum = profile.get(
        "minimumBudget",
        0
    )

    maximum = profile.get(
        "maximumBudget",
        0
    )

    currency = clean_value(
        profile.get(
            "currency"
        )
    )

    result["funding"] = {

        "types": clean_list(
            profile.get(
                "sponsorshipTypes"
            )
        ),

        "minimum": minimum,

        "maximum": maximum,

        "currency": currency
    }

    result["metadata"] = {

        "accountType": account_type,

        "companyOrProjectName":
            clean_value(
                profile.get(
                    "companyOrProjectName"
                )
            ),

        "targetAudience":
            clean_value(
                profile.get(
                    "targetAudience"
                )
            ),

        "conditions":
            clean_value(
                profile.get(
                    "conditions"
                )
            ),

        "website":
            clean_value(
                profile.get(
                    "website"
                )
            ),

        "socialLinks":
            clean_list(
                profile.get(
                    "socialLinks"
                )
            ),

        "eventOrProjectDate":
            clean_value(
                profile.get(
                    "eventOrProjectDate"
                )
            ),

        "profileCompletion":
            profile.get(
                "profileCompletion",
                0
            ),

        "profileStatus":
            clean_value(
                profile.get(
                    "profileStatus"
                )
            )
    }

    return result


# ============================================================
# T-BRIDGE
# ============================================================

def adapt_tbridge(
    profile: Dict[str, Any]
) -> Dict[str, Any]:

    result = base_profile(
        first_value(
            profile,
            "_id",
            "id",
            "tBridgeId",
            default=""
        ),
        "TBRIDGE"
    )

    # --------------------------------------------------------
    # General T-Bridge identity
    # --------------------------------------------------------

    professional_type = clean_value(
        profile.get(
            "professionalType"
        )
    )

    bio = clean_value(
        profile.get(
            "bio"
        )
    )

    interests = clean_list(
        profile.get(
            "interests"
        )
    )

    location = clean_value(
        profile.get(
            "location"
        )
    )

    result["role"] = clean_list(
        professional_type
    )

    result["description"] = bio

    result["interests"] = interests

    result["location"] = clean_list(
        location
    )

    # --------------------------------------------------------
    # General interests can also act as connection signals
    # --------------------------------------------------------

    result["connections"] = interests

    # --------------------------------------------------------
    # Optional ecosystem memberships
    #
    # Expected input:
    #
    # memberships: [
    #   {
    #       ecosystem: "startup",
    #       answers: {...},
    #       status: "active"
    #   }
    # ]
    # --------------------------------------------------------

    memberships = profile.get(
        "memberships",
        []
    )

    if not isinstance(
        memberships,
        list
    ):
        memberships = []

    ecosystem_names = []

    membership_answers = []

    for membership in memberships:

        if not isinstance(
            membership,
            dict
        ):
            continue

        ecosystem = clean_value(
            membership.get(
                "ecosystem"
            )
        ).lower()

        if ecosystem:

            ecosystem_names.append(
                ecosystem
            )

        answers = membership.get(
            "answers",
            {}
        )

        if isinstance(
            answers,
            dict
        ):

            membership_answers.append(
                answers
            )

    result["metadata"] = {

        "tBridgeId":
            clean_value(
                profile.get(
                    "tBridgeId"
                )
            ),

        "email":
            clean_value(
                profile.get(
                    "email"
                )
            ),

        "professionalType":
            professional_type,

        "ecosystems":
            ecosystem_names,

        "membershipAnswers":
            membership_answers,

        "profileCompletion":
            profile.get(
                "profileCompletion",
                0
            ),

        "profileStatus":
            clean_value(
                profile.get(
                    "profileStatus"
                )
            )
    }

    # --------------------------------------------------------
    # Extract useful semantic information from
    # T-Bridge ecosystem answers.
    # --------------------------------------------------------

    for answers in membership_answers:

        for key, value in answers.items():

            key_lower = clean_value(
                key
            ).lower()

            values = clean_list(
                value
            )

            if not values:
                continue

            if any(
                word in key_lower
                for word in [
                    "industry",
                    "domain",
                    "sector"
                ]
            ):

                result["industry"].extend(
                    values
                )

            if any(
                word in key_lower
                for word in [
                    "expertise",
                    "skill",
                    "experience"
                ]
            ):

                result["expertise"].extend(
                    values
                )

            if any(
                word in key_lower
                for word in [
                    "need",
                    "requirement",
                    "looking"
                ]
            ):

                result["needs"].extend(
                    values
                )

            if any(
                word in key_lower
                for word in [
                    "offer",
                    "support",
                    "provide"
                ]
            ):

                result["offering"].extend(
                    values
                )

            if any(
                word in key_lower
                for word in [
                    "stage"
                ]
            ):

                result["stage"].extend(
                    values
                )

    # Remove duplicates
    result["industry"] = list(
        dict.fromkeys(
            result["industry"]
        )
    )

    result["expertise"] = list(
        dict.fromkeys(
            result["expertise"]
        )
    )

    result["needs"] = list(
        dict.fromkeys(
            result["needs"]
        )
    )

    result["offering"] = list(
        dict.fromkeys(
            result["offering"]
        )
    )

    result["stage"] = list(
        dict.fromkeys(
            result["stage"]
        )
    )

    result["domain"] = result["industry"]

    return result


# ============================================================
# UNIVERSAL PROFILE -> SEMANTIC TEXT
# ============================================================

def universal_profile_to_text(
    profile: Dict[str, Any]
) -> str:

    sections = []

    def add_section(
        title: str,
        value: Any
    ):

        if isinstance(
            value,
            list
        ):
            value = ", ".join(
                clean_list(value)
            )

        elif isinstance(
            value,
            dict
        ):
            parts = []

            for key, item in value.items():

                if isinstance(
                    item,
                    list
                ):
                    item = ", ".join(
                        clean_list(item)
                    )

                item = clean_value(
                    item
                )

                if item:
                    parts.append(
                        f"{key}: {item}"
                    )

            value = "; ".join(parts)

        else:
            value = clean_value(
                value
            )

        if value:
            sections.append(
                f"{title}: {value}"
            )

    add_section(
        "Profile type",
        profile.get(
            "profileType"
        )
    )

    add_section(
        "Role",
        profile.get(
            "role"
        )
    )

    add_section(
        "Domain",
        profile.get(
            "domain"
        )
    )

    add_section(
        "Industry",
        profile.get(
            "industry"
        )
    )

    add_section(
        "Sectors",
        profile.get(
            "sectors"
        )
    )

    add_section(
        "Expertise",
        profile.get(
            "expertise"
        )
    )

    add_section(
        "Skills",
        profile.get(
            "skills"
        )
    )

    add_section(
        "Description",
        profile.get(
            "description"
        )
    )

    add_section(
        "Offering",
        profile.get(
            "offering"
        )
    )

    add_section(
        "Needs",
        profile.get(
            "needs"
        )
    )

    add_section(
        "Requirements",
        profile.get(
            "requirements"
        )
    )

    add_section(
        "Stage",
        profile.get(
            "stage"
        )
    )

    add_section(
        "Location",
        profile.get(
            "location"
        )
    )

    add_section(
        "Funding",
        profile.get(
            "funding"
        )
    )

    add_section(
        "Interests",
        profile.get(
            "interests"
        )
    )

    add_section(
        "Connections",
        profile.get(
            "connections"
        )
    )

    add_section(
        "Opportunities",
        profile.get(
            "opportunities"
        )
    )

    add_section(
        "Collaboration interests",
        profile.get(
            "collaborationInterests"
        )
    )

    add_section(
        "Experience",
        profile.get(
            "experience"
        )
    )

    return "\n".join(
        sections
    )


# ============================================================
# TEST DATA
# ============================================================

if __name__ == "__main__":

    print("=" * 70)
    print("SICR UNIVERSAL PROFILE ADAPTER TEST")
    print("=" * 70)


    # --------------------------------------------------------
    # STARTUP
    # --------------------------------------------------------

    startup = {

        "_id": "startup001",

        "email":
            "startup@example.com",

        "role":
            "Founder",

        "currentPosition":
            "Founder",

        "plannedToBuild":
            "AI powered automobile accident detection platform using intelligent cameras and sensors",

        "existingResources":
            "Prototype and technical team",

        "currentNeeds":
            "Funding, automobile expertise and mentorship",

        "connectionInterests":
            "Automobile investors and mentors",

        "opportunityInterests":
            "Industry partnerships"
    }


    # --------------------------------------------------------
    # INVESTOR
    # --------------------------------------------------------

    investor = {

        "_id": "investor001",

        "profileType":
            "ANGEL_INVESTOR",

        "fundingRole":
            "Angel Investor",

        "industries": [
            "Automobile",
            "Electric Vehicles"
        ],

        "sectors": [
            "Mobility"
        ],

        "expertise": [
            "Automotive technology",
            "Startup investment"
        ],

        "organizationDescription":
            "Investor focused on automotive and technology startups",

        "fundingTypes": [
            "EQUITY"
        ],

        "preferredStartupStages": [
            "MVP",
            "EARLY_STAGE"
        ],

        "minimumInvestment":
            500000,

        "maximumInvestment":
            5000000,

        "preferredCurrency":
            "INR",

        "location": {
            "city":
                "Mumbai"
        }
    }


    # --------------------------------------------------------
    # MENTOR
    # --------------------------------------------------------

    mentor = {

        "_id":
            "mentor001",

        "mentorType":
            "Industry Mentor",

        "currentPosition":
            "Automotive Technology Expert",

        "industries": [
            "Automobile",
            "Electric Vehicles"
        ],

        "areasOfExpertise": [
            "Vehicle Safety",
            "Automotive Engineering",
            "Product Validation",
            "Technical Strategy"
        ],

        "skills": [
            "AI",
            "Computer Vision"
        ],

        "mentorshipAreas": [
            "Technical Mentorship",
            "Product Validation",
            "Technical Strategy"
        ],

        "location":
            "Mumbai",

        "yearsOfExperience":
            12
    }


    # --------------------------------------------------------
    # CORPORATE
    # --------------------------------------------------------

    corporate = {

        "_id":
            "corporate001",

        "companyName":
            "Automotive Technology Company",

        "industryDomain":
            "Automobile",

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


    # --------------------------------------------------------
    # PARTNERSHIP
    # --------------------------------------------------------

    partnership = {

        "_id":
            "partnership001",

        "email":
            "partner@example.com",

        "collaborationRole":
            "Strategic Partner",

        "offerings": [
            "Technology partnership",
            "Business network"
        ],

        "collaborationNeeds": [
            "Innovative startups",
            "Technology solutions"
        ],

        "sectors": [
            "Automobile",
            "Technology"
        ],

        "collaborationScale":
            "National"
    }


    # --------------------------------------------------------
    # SPONSORSHIP
    # --------------------------------------------------------

    sponsorship = {

        "accountId":
            "sponsor001",

        "accountType":
            "sponsor",

        "companyOrProjectName":
            "Automotive Innovation Sponsor",

        "description":
            "Corporate sponsor supporting innovative automotive technology projects",

        "industry":
            "Automobile",

        "sponsorshipPurpose":
            "Support innovative automotive startups",

        "sponsorshipTypes": [
            "Financial Sponsorship",
            "Technology Sponsorship"
        ],

        "preferredIndustries": [
            "Automobile",
            "Technology"
        ],

        "minimumBudget":
            100000,

        "maximumBudget":
            1000000,

        "currency":
            "INR",

        "targetAudience":
            "Automotive startups",

        "preferredLocations": [
            "Mumbai",
            "Maharashtra"
        ],

        "benefits":
            "Brand visibility and technology partnerships"
    }


    # --------------------------------------------------------
    # T-BRIDGE
    # --------------------------------------------------------

    tbridge = {

        "tBridgeId":
            "TBR-001",

        "email":
            "bridge@example.com",

        "location":
            "Mumbai",

        "professionalType":
            "Technology Professional",

        "bio":
            "Technology professional interested in startups, automobile innovation and AI",

        "interests": [
            "Artificial Intelligence",
            "Automobile",
            "Startups",
            "Technology partnerships"
        ],

        "memberships": [

            {
                "ecosystem":
                    "startup",

                "answers": {

                    "industry":
                        "Automobile",

                    "skills": [
                        "Artificial Intelligence",
                        "Computer Vision"
                    ],

                    "needs":
                        "Startup mentorship"
                }
            },

            {
                "ecosystem":
                    "mentor",

                "answers": {

                    "expertise": [
                        "AI",
                        "Automotive Technology"
                    ],

                    "offer":
                        "Technical mentorship"
                }
            }
        ]
    }


    # ========================================================
    # RUN TESTS
    # ========================================================

    profiles = [

        ("STARTUP", startup),

        ("INVESTOR", investor),

        ("MENTOR", mentor),

        ("CORPORATE", corporate),

        ("PARTNERSHIP", partnership),

        ("SPONSORSHIP", sponsorship),

        ("TBRIDGE", tbridge)
    ]


    for profile_type, raw_profile in profiles:

        print("\n")
        print("-" * 70)
        print(
            f"{profile_type} UNIVERSAL PROFILE"
        )
        print("-" * 70)

        universal = create_universal_profile(
            profile_type,
            raw_profile
        )

        for key, value in universal.items():

            if key == "metadata":
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
    print("ALL UNIVERSAL PROFILE ADAPTER TESTS COMPLETED")
    print("=" * 70)