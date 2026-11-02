# ==========================================
# Startup Idea -> Investor Domain Mapper
# ==========================================

DOMAIN_KEYWORDS = {

    "E-Commerce & Retail": [
        "tea stall",
        "tea shop",
        "chai stall",
        "chai shop",
        "cafe",
        "coffee shop",
        "restaurant",
        "food stall",
        "food shop",
        "bakery",
        "grocery",
        "supermarket",
        "retail shop",
        "retail store",
        "shopping",
        "ecommerce",
        "e-commerce",
        "online store",
        "fashion store",
        "clothing store",
        "food delivery"
    ],

    "FinTech": [
        "fintech",
        "payment app",
        "payments",
        "upi",
        "digital payment",
        "payment gateway",
        "banking app",
        "digital banking",
        "wallet",
        "insurance technology",
        "insurtech",
        "investment app",
        "stock trading",
        "lending platform",
        "loan app"
    ],

    "EdTech": [
        "education",
        "edtech",
        "online learning",
        "online course",
        "learning platform",
        "e-learning",
        "elearning",
        "online classes",
        "education platform",
        "student learning",
        "exam preparation",
        "test preparation"
    ],

    "HealthTech": [
        "healthtech",
        "health care",
        "healthcare",
        "medical",
        "hospital",
        "doctor",
        "telemedicine",
        "telehealth",
        "medicine",
        "pharmacy",
        "patient",
        "health app",
        "medical app"
    ],

    "CleanTech & Green Energy": [
        "solar",
        "solar energy",
        "renewable energy",
        "clean energy",
        "greentech",
        "green energy",
        "electric vehicle",
        "ev charging",
        "battery technology",
        "waste management",
        "recycling",
        "carbon reduction",
        "sustainable energy"
    ],

    "AgriTech": [
        "agritech",
        "agriculture",
        "farming",
        "farmer",
        "crop",
        "smart farming",
        "agricultural technology",
        "irrigation",
        "fertilizer",
        "farm"
    ],

    "Cybersecurity": [
        "cybersecurity",
        "cyber security",
        "security software",
        "network security",
        "data security",
        "information security",
        "threat detection",
        "fraud detection"
    ],

    "AI/ML & Data Science": [
        "artificial intelligence",
        "ai startup",
        "machine learning",
        "deep learning",
        "data science",
        "computer vision",
        "generative ai",
        "genai",
        "nlp",
        "chatbot",
        "ai platform"
    ],

    "SaaS & Enterprise Tech": [
        "saas",
        "enterprise software",
        "business software",
        "crm",
        "erp",
        "workflow software",
        "productivity software",
        "cloud software",
        "b2b software",
        "enterprise platform"
    ],

    "Biotech & Healthcare": [
        "biotech",
        "biotechnology",
        "drug discovery",
        "biomedical",
        "genomics",
        "genetic",
        "life sciences",
        "medical research"
    ]
}


def detect_domain(query):

    query = query.lower().strip()

    matched_domains = []

    for domain, keywords in DOMAIN_KEYWORDS.items():

        for keyword in keywords:

            if keyword in query:
                matched_domains.append(domain)
                break

    return matched_domains


# ==========================================
# Test
# ==========================================

if __name__ == "__main__":

    test_queries = [
        "tea stall",
        "online learning platform",
        "UPI payment application",
        "solar energy startup",
        "AI chatbot"
    ]

    for query in test_queries:

        domains = detect_domain(query)

        print(f"\nQuery: {query}")
        print(f"Detected Domains: {domains}")