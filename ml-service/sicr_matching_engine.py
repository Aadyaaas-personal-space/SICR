import pandas as pd
import numpy as np
import joblib

from sentence_transformers import SentenceTransformer
from domain_mapper import detect_domain


# ============================================================
# CONFIGURATION
# ============================================================

MODEL_FILE = "sicr_final_investor_matching_model.pkl"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"


print("==============================================")
print("       SICR MATCHING ENGINE")
print("==============================================")


# ============================================================
# LOAD TRAINED ML MODEL
# ============================================================

print("\nLoading trained matching model...")

model = joblib.load(MODEL_FILE)

print("Trained ML model loaded successfully.")


# ============================================================
# LOAD SEMANTIC MODEL
# ============================================================

print("\nLoading semantic embedding model...")

semantic_model = SentenceTransformer(EMBEDDING_MODEL)

print("Semantic model loaded successfully.")


print("\n==============================================")
print("SICR MATCHING ENGINE READY")
print("==============================================")


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def safe_string(value):
    if value is None:
        return ""

    if isinstance(value, list):
        return ", ".join(str(x) for x in value)

    return str(value)


# ============================================================
# FUNDING RANGE PARSER
# ============================================================

def parse_ticket_range(ticket):

    ticket = safe_string(ticket)

    # Handle encoding variations
    ticket = ticket.replace("â‚¹", "₹")

    if "₹5 Lakhs - ₹25 Lakhs" in ticket:
        return 500000, 2500000

    if "₹25 Lakhs - ₹1 Crore" in ticket:
        return 2500000, 10000000

    if "₹1 Crore - ₹5 Crores" in ticket:
        return 10000000, 50000000

    if "₹5 Crores+" in ticket:
        return 50000000, float("inf")

    # Additional common formats
    if "5 Lakhs" in ticket and "25 Lakhs" in ticket:
        return 500000, 2500000

    if "25 Lakhs" in ticket and "1 Crore" in ticket:
        return 2500000, 10000000

    if "1 Crore" in ticket and "5 Crores" in ticket:
        return 10000000, 50000000

    if "5 Crores+" in ticket:
        return 50000000, float("inf")

    return 0, 0


# ============================================================
# FUNDING MATCH SCORE
# ============================================================

def funding_match_score(required_funding, ticket):

    try:
        required_funding = float(required_funding or 0)
    except:
        required_funding = 0

    min_amount, max_amount = parse_ticket_range(ticket)

    if min_amount == 0:
        return 0.0

    # Perfect funding fit
    if min_amount <= required_funding <= max_amount:
        return 1.0

    # Startup requires less than investor minimum
    if required_funding < min_amount:

        difference = min_amount - required_funding
        ratio = difference / min_amount

        score = 1.0 - ratio

        return max(0.1, score)

    # Startup requires more than investor maximum
    if max_amount != float("inf"):

        difference = required_funding - max_amount
        ratio = difference / max_amount

        score = 1.0 - ratio

        return max(0.1, score)

    return 1.0


# ============================================================
# STAGE NORMALIZATION
# ============================================================

def normalize_stage(stage):

    value = safe_string(stage).strip().lower()

    stage_mapping = {

        "idea": "Ideation / Pre-Seed",

        "ideation": "Ideation / Pre-Seed",

        "pre-seed": "Ideation / Pre-Seed",

        "pre_seed": "Ideation / Pre-Seed",

        "ideation / pre-seed": "Ideation / Pre-Seed",

        "validation": "Ideation / Pre-Seed",

        "prototype": "Seed Stage",

        "mvp": "Seed Stage",

        "seed": "Seed Stage",

        "seed stage": "Seed Stage",

        "growth": "Growth Stage (Series B+)",

        "series b": "Growth Stage (Series B+)",

        "series c": "Growth Stage (Series B+)",

        "late stage": "Growth Stage (Series B+)",

        "growth stage (series b+)": "Growth Stage (Series B+)",

        "early stage": "Early Stage (Series A)",

        "series a": "Early Stage (Series A)",

        "early_stage": "Early Stage (Series A)",

        "early stage (series a)": "Early Stage (Series A)"
    }

    return stage_mapping.get(
        value,
        safe_string(stage)
    )


# ============================================================
# STAGE MATCH SCORE
# ============================================================

def stage_match_score(startup_stage, investor_stage):

    startup_stage = normalize_stage(startup_stage)
    investor_stage = normalize_stage(investor_stage)

    if not investor_stage:
        return 0.0

    if startup_stage == investor_stage:
        return 1.0

    compatible_pairs = {

        "Ideation / Pre-Seed": [
            "Seed Stage"
        ],

        "Seed Stage": [
            "Ideation / Pre-Seed",
            "Early Stage (Series A)"
        ],

        "Early Stage (Series A)": [
            "Seed Stage",
            "Growth Stage (Series B+)"
        ],

        "Growth Stage (Series B+)": [
            "Early Stage (Series A)"
        ]
    }

    if investor_stage in compatible_pairs.get(
        startup_stage,
        []
    ):
        return 0.5

    return 0.0


# ============================================================
# DOMAIN MATCH
# ============================================================

def domain_match_score(startup_domain, investor_domain):

    startup_domain = safe_string(startup_domain).strip().lower()
    investor_domain = safe_string(investor_domain).strip().lower()

    if not startup_domain or not investor_domain:
        return 0.0

    if startup_domain == investor_domain:
        return 1.0

    # Partial domain relationship
    if startup_domain in investor_domain:
        return 0.7

    if investor_domain in startup_domain:
        return 0.7

    return 0.0


# ============================================================
# PREFERRED DOMAIN MATCH
# ============================================================

def preferred_domain_match(
    startup_domain,
    preferred_domains
):

    startup_domain = safe_string(
        startup_domain
    ).strip().lower()

    preferred_domains = safe_string(
        preferred_domains
    )

    domains = [
        domain.strip().lower()
        for domain in preferred_domains.split(",")
        if domain.strip()
    ]

    for domain in domains:

        if startup_domain == domain:
            return 1.0

        if startup_domain in domain:
            return 0.7

        if domain in startup_domain:
            return 0.7

    return 0.0


# ============================================================
# INVESTOR TYPE SCORE
# ============================================================

def investor_type_score(investor_type):

    investor_type = safe_string(
        investor_type
    ).strip()

    values = {

        "Venture Capital (VC) Firm": 1.0,

        "Angel Investor": 0.9,

        "Corporate VC": 0.85,

        "Incubator / Accelerator Fund": 0.8,

        "Family Office": 0.75,

        "Government Grant Agency": 0.5
    }

    return values.get(
        investor_type,
        0.5
    )


# ============================================================
# EVALUATION MATCH
# ============================================================

def evaluation_match(
    startup_idea,
    evaluation_metric
):

    text = (
        safe_string(startup_idea)
        + " "
        + safe_string(evaluation_metric)
    )

    text = text.lower()

    score = 0.5

    if "traction" in text:
        score = 0.8

    if "market" in text:
        score = 0.7

    if "technology" in text or "tech" in text:
        score = 0.8

    if "prototype" in text or "mvp" in text:
        score = 0.8

    if "founder" in text:
        score = 0.6

    return score


# ============================================================
# LOCATION MATCH
# ============================================================

def location_match_score(
    startup_location,
    investor_location
):

    startup_location = safe_string(
        startup_location
    ).strip().lower()

    investor_location = safe_string(
        investor_location
    ).strip().lower()

    if not startup_location or not investor_location:
        return 0.4

    if startup_location == investor_location:
        return 1.0

    if (
        startup_location in investor_location
        or investor_location in startup_location
    ):
        return 0.8

    return 0.4


# ============================================================
# CONVERT SICR INVESTOR PROFILE
# ============================================================

def convert_sicr_investor(investor):

    """
    Converts a live SICR MongoDB InvestorFunder document
    into the format expected by the trained ML model.
    """

    profile_type = safe_string(
        investor.get("profileType")
    )

    investor_type = safe_string(
        investor.get("investorType")
    )

    # --------------------------------------------------------
    # Investor Type
    # --------------------------------------------------------

    if profile_type:

        if "angel" in profile_type.lower():
            normalized_investor_type = "Angel Investor"

        elif "vc" in profile_type.lower():
            normalized_investor_type = "Venture Capital (VC) Firm"

        elif "corporate" in profile_type.lower():
            normalized_investor_type = "Corporate VC"

        elif "family" in profile_type.lower():
            normalized_investor_type = "Family Office"

        elif (
            "incubator" in profile_type.lower()
            or "accelerator" in profile_type.lower()
        ):
            normalized_investor_type = (
                "Incubator / Accelerator Fund"
            )

        elif "government" in profile_type.lower():
            normalized_investor_type = (
                "Government Grant Agency"
            )

        else:
            normalized_investor_type = (
                profile_type
            )

    elif investor_type:

        normalized_investor_type = investor_type

    else:

        normalized_investor_type = "Other"


    # --------------------------------------------------------
    # Primary Domain
    # --------------------------------------------------------

    industries = investor.get(
        "industries",
        investor.get(
            "sectors",
            investor.get(
                "preferredDomains",
                []
            )
        )
    )

    if isinstance(industries, list):

        primary_domain = (
            industries[0]
            if industries
            else ""
        )

        preferred_domains = ", ".join(
            str(x)
            for x in industries
        )

    else:

        primary_domain = safe_string(
            industries
        )

        preferred_domains = safe_string(
            industries
        )


    # --------------------------------------------------------
    # Investment Stages
    # --------------------------------------------------------

    stages = investor.get(
        "preferredStartupStages",
        investor.get(
            "investmentStages",
            []
        )
    )

    if isinstance(stages, list):

        investment_stage = (
            stages[0]
            if stages
            else ""
        )

    else:

        investment_stage = safe_string(
            stages
        )


    # --------------------------------------------------------
    # Funding Types
    # --------------------------------------------------------

    funding_types = investor.get(
        "fundingTypes",
        []
    )

    if isinstance(funding_types, list):

        funding_type_text = ", ".join(
            str(x)
            for x in funding_types
        )

    else:

        funding_type_text = safe_string(
            funding_types
        )


    # --------------------------------------------------------
    # Ticket Size
    # --------------------------------------------------------

    min_investment = investor.get(
        "minInvestment",
        investor.get(
            "minimumInvestment",
            0
        )
    )

    max_investment = investor.get(
        "maxInvestment",
        investor.get(
            "maximumInvestment",
            0
        )
    )

    # If actual numeric range exists,
    # convert it into a simple ticket label.

    try:

        min_value = float(
            min_investment or 0
        )

        max_value = float(
            max_investment or 0
        )

    except:

        min_value = 0
        max_value = 0


    if min_value > 0 or max_value > 0:

        if max_value >= 50000000:

            typical_ticket_size = (
                "₹5 Crores+"
            )

        elif (
            min_value >= 10000000
            or max_value >= 10000000
        ):

            typical_ticket_size = (
                "₹1 Crore - ₹5 Crores"
            )

        elif (
            min_value >= 2500000
            or max_value >= 2500000
        ):

            typical_ticket_size = (
                "₹25 Lakhs - ₹1 Crore"
            )

        else:

            typical_ticket_size = (
                "₹5 Lakhs - ₹25 Lakhs"
            )

    else:

        typical_ticket_size = funding_type_text


    # --------------------------------------------------------
    # Location
    # --------------------------------------------------------

    location = investor.get(
        "location",
        investor.get(
            "city",
            ""
        )
    )


    # --------------------------------------------------------
    # Evaluation Metric
    # --------------------------------------------------------

    evaluation_metric = investor.get(
        "keyEvaluationMetric",
        investor.get(
            "evaluationMetric",
            investor.get(
                "evaluationCriteria",
                ""
            )
        )
    )


    # --------------------------------------------------------
    # Investor Name
    # --------------------------------------------------------

    investor_name = investor.get(
        "name",
        investor.get(
            "fullName",
            investor.get(
                "companyName",
                "SICR Investor"
            )
        )
    )


    # --------------------------------------------------------
    # ID
    # --------------------------------------------------------

    investor_id = investor.get(
        "_id",
        investor.get(
            "investorId",
            ""
        )
    )

    investor_id = safe_string(
        investor_id
    )


    return {

        "investor_id":
            investor_id,

        "investor_name":
            safe_string(
                investor_name
            ),

        "investor_type":
            normalized_investor_type,

        "primary_domain":
            primary_domain,

        "preferred_domains":
            preferred_domains,

        "investment_stage":
            investment_stage,

        "typical_ticket_size":
            typical_ticket_size,

        "location":
            safe_string(
                location
            ),

        "key_evaluation_metric":
            safe_string(
                evaluation_metric
            )
    }


# ============================================================
# MAIN INVESTOR RECOMMENDATION FUNCTION
# ============================================================

def recommend_investors(
    idea,
    stage,
    required_funding,
    location,
    investors=None,
    top_n=10
):

    # --------------------------------------------------------
    # DOMAIN DETECTION
    # --------------------------------------------------------

    detected_domains = detect_domain(
        idea
    )

    if not detected_domains:

        detected_domains = [
            "SaaS & Enterprise Tech"
        ]

    startup_domain = detected_domains[0]


    # --------------------------------------------------------
    # LIVE SICR INVESTORS
    # --------------------------------------------------------

    if investors:

        live_investors = [
            convert_sicr_investor(
                investor
            )
            for investor in investors
        ]

    else:

        live_investors = []


    # --------------------------------------------------------
    # NO LIVE INVESTORS
    # --------------------------------------------------------

    if not live_investors:

        return {

            "startup_idea":
                idea,

            "detected_domains":
                detected_domains,

            "startup_stage":
                stage,

            "required_funding":
                required_funding,

            "startup_location":
                location,

            "recommendations":
                []
        }


    # --------------------------------------------------------
    # STARTUP SEMANTIC EMBEDDING
    # --------------------------------------------------------

    investor_texts = []

    for investor in live_investors:

        text = (

            investor["primary_domain"]
            + " "
            + investor["preferred_domains"]
            + " "
            + investor["investment_stage"]
            + " "
            + investor["investor_type"]
            + " "
            + investor["location"]
            + " "
            + investor["key_evaluation_metric"]

        )

        investor_texts.append(
            text
        )


    # --------------------------------------------------------
    # CREATE LIVE INVESTOR EMBEDDINGS
    # --------------------------------------------------------

    startup_embedding = semantic_model.encode(
        [idea],
        normalize_embeddings=True
    )[0]


    live_embeddings = semantic_model.encode(
        investor_texts,
        normalize_embeddings=True
    )


    # --------------------------------------------------------
    # SEMANTIC SIMILARITY
    # --------------------------------------------------------

    semantic_scores = np.dot(
        live_embeddings,
        startup_embedding
    )

    semantic_scores = np.clip(
        semantic_scores,
        0,
        1
    )


    # --------------------------------------------------------
    # FEATURE GENERATION
    # --------------------------------------------------------

    features = []

    for index, investor in enumerate(
        live_investors
    ):

        # Domain match
        domain_match = domain_match_score(
            startup_domain,
            investor["primary_domain"]
        )


        # Preferred domain
        preferred_match = preferred_domain_match(
            startup_domain,
            investor["preferred_domains"]
        )


        # Stage
        stage_match = stage_match_score(
            stage,
            investor["investment_stage"]
        )


        # Funding
        funding_match = funding_match_score(
            required_funding,
            investor["typical_ticket_size"]
        )


        # Semantic similarity
        semantic_similarity = float(
            semantic_scores[index]
        )


        # Location
        location_match = location_match_score(
            location,
            investor["location"]
        )


        # Investor type
        investor_type = investor_type_score(
            investor["investor_type"]
        )


        # Evaluation metric
        evaluation = evaluation_match(
            idea,
            investor["key_evaluation_metric"]
        )


        features.append([

            domain_match,

            preferred_match,

            stage_match,

            funding_match,

            semantic_similarity,

            location_match,

            investor_type,

            evaluation

        ])


    # ========================================================
    # FEATURE DATAFRAME
    # ========================================================

    feature_columns = [

        "domain_match",

        "preferred_domain_match",

        "stage_match",

        "funding_match",

        "semantic_similarity",

        "location_match",

        "investor_type_score",

        "evaluation_match"

    ]


    X = pd.DataFrame(
        features,
        columns=feature_columns
    )


    # ========================================================
    # ML PREDICTION
    # ========================================================

    predictions = model.predict(
        X
    )

    predictions = np.clip(
        predictions,
        0,
        1
    )


    # ========================================================
    # CREATE RESULTS
    # ========================================================

    results = []

    for index, investor in enumerate(
        live_investors
    ):

        result = investor.copy()

        result["ml_match_score"] = round(
            float(predictions[index]) * 100,
            2
        )

        results.append(
            result
        )


    # --------------------------------------------------------
    # REMOVE DUPLICATES
    # --------------------------------------------------------

    unique_results = []

    seen_ids = set()

    for investor in results:

        investor_id = investor[
            "investor_id"
        ]

        if investor_id in seen_ids:
            continue

        seen_ids.add(
            investor_id
        )

        unique_results.append(
            investor
        )


    # --------------------------------------------------------
    # SORT
    # --------------------------------------------------------

    unique_results.sort(
        key=lambda x:
            x["ml_match_score"],
        reverse=True
    )


    # --------------------------------------------------------
    # TOP N
    # --------------------------------------------------------

    unique_results = unique_results[
        :int(top_n)
    ]


    # ========================================================
    # FORMAT OUTPUT
    # ========================================================

    recommendations = []

    for investor in unique_results:

        recommendations.append({

            "investor_id":
                investor["investor_id"],

            "investor_name":
                investor["investor_name"],

            "investor_type":
                investor["investor_type"],

            "primary_domain":
                investor["primary_domain"],

            "preferred_domains":
                investor["preferred_domains"],

            "investment_stage":
                investor["investment_stage"],

            "typical_ticket_size":
                investor["typical_ticket_size"],

            "location":
                investor["location"],

            "evaluation_metric":
                investor[
                    "key_evaluation_metric"
                ],

            "ml_match_score":
                investor[
                    "ml_match_score"
                ]
        })


    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        "startup_idea":
            idea,

        "detected_domains":
            detected_domains,

        "startup_stage":
            stage,

        "required_funding":
            required_funding,

        "startup_location":
            location,

        "recommendations":
            recommendations
    }


# ============================================================
# OPTIONAL DIRECT TEST
# ============================================================

if __name__ == "__main__":

    print(
        "\nSICR Matching Engine loaded successfully."
    )

    print(
        "Live SICR investors should be supplied "
        "through the Flask API."
    )