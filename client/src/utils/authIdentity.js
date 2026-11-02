
export const ECOSYSTEM_TOKEN_KEYS = {
    STARTUP: "startupToken",
    INVESTOR: "investorFunderToken",
    MENTOR: "mentorToken",
    CORPORATE: "corporateToken",
    PARTNERSHIP: "partnershipToken",
    SPONSORSHIP: "sponsorshipToken",
    TBRIDGE: "tBridgeToken",
};

function normalizeEcosystem(value) {
    const type = String(value || "").trim().toUpperCase();

    if (["INVESTORFUNDER", "FUNDER"].includes(type)) {
        return "INVESTOR";
    }

    return type;
}

function decodeJwtPayload(token) {
    try {
        const parts = String(token || "").split(".");

        if (parts.length !== 3) {
            return null;
        }

        const base64 = parts[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const padded = base64.padEnd(
            base64.length + ((4 - (base64.length % 4)) % 4),
            "="
        );

        const binary = atob(padded);
        const bytes = Uint8Array.from(
            binary,
            (character) => character.charCodeAt(0)
        );

        const decodedText = new TextDecoder().decode(bytes);

        return JSON.parse(decodedText);
    } catch (error) {
        console.error("Unable to decode SICR token:", error);
        return null;
    }
}

function identityFromToken(type, token) {
    if (!type || !token) {
        return null;
    }

    const payload = decodeJwtPayload(token);

    if (!payload) {
        return null;
    }

    const id =
        type === "TBRIDGE"
            ? payload.tBridgeId || payload.id || payload._id
            : payload.id ||
            payload._id ||
            payload.userId ||
            payload.accountId;

    if (!id) {
        return null;
    }

    return {
        type,
        id: String(id),
        token,
        payload,
    };
}

export function getLoggedInIdentity() {
    const activeEcosystem = normalizeEcosystem(
        localStorage.getItem("activeEcosystem")
    );

    // IMPORTANT:
    // When an ecosystem is selected, use its token only.
    // Never accidentally identify an Investor as a Startup
    // just because an old Startup token is still stored.
    if (
        activeEcosystem &&
        Object.prototype.hasOwnProperty.call(
            ECOSYSTEM_TOKEN_KEYS,
            activeEcosystem
        )
    ) {
        const tokenKey = ECOSYSTEM_TOKEN_KEYS[activeEcosystem];
        const activeToken = localStorage.getItem(tokenKey);

        if (!activeToken) {
            return null;
        }

        return identityFromToken(activeEcosystem, activeToken);
    }

    // Backward-compatible fallback for sessions that don't
    // have activeEcosystem set.
    for (const [type, tokenKey] of Object.entries(
        ECOSYSTEM_TOKEN_KEYS
    )) {
        const token = localStorage.getItem(tokenKey);

        if (!token) {
            continue;
        }

        const identity = identityFromToken(type, token);

        if (identity) {
            return identity;
        }
    }

    return null;
}

export function getAuthToken(type) {
    const normalizedType = normalizeEcosystem(type);
    const tokenKey = ECOSYSTEM_TOKEN_KEYS[normalizedType];

    if (!tokenKey) {
        return null;
    }

    return localStorage.getItem(tokenKey);
}
