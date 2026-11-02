
const API_BASE_URL =
    `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/profile`;

const getToken = () => {
    const activeEcosystem = (
        localStorage.getItem("activeEcosystem") || ""
    ).toUpperCase();

    const tokenKeys = {
        STARTUP: "startupToken",
        INVESTOR: "investorFunderToken",
        MENTOR: "mentorToken",
        CORPORATE: "corporateToken",
        PARTNERSHIP: "partnershipToken",
        SPONSORSHIP: "sponsorshipToken",
        TBRIDGE: "tBridgeToken",
    };

    const tokenKey = tokenKeys[activeEcosystem];

    return (
        (tokenKey && localStorage.getItem(tokenKey)) ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("token")
    );
};

const getHeaders = () => {
    const token = getToken();

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const getProfile = async () => {
    const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch profile"
        );
    }

    return data;
};

export const updateProfile = async (profileData) => {
    const response = await fetch(API_BASE_URL, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to update profile"
        );
    }

    return data;
};
