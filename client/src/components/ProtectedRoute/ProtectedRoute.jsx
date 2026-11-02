
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AUTH_CONFIG = {
    startup: {
        tokenKey: "startupToken",
        meEndpoint: "/api/startup/me",
        loginPath: "/startup/login",
    },
    investor: {
        tokenKey: "investorFunderToken",
        meEndpoint: "/api/investor-funder/profile",
        loginPath: "/investor/login",
    },
    mentor: {
        tokenKey: "mentorToken",
        meEndpoint: "/api/mentor/me",
        loginPath: "/mentor/login",
    },
    corporate: {
        tokenKey: "corporateToken",
        meEndpoint: "/api/corporate/me",
        loginPath: "/corporate/login",
    },
    partnership: {
        tokenKey: "partnershipToken",
        meEndpoint: "/api/partnership/me",
        loginPath: "/partnership/login",
    },
    sponsorship: {
        tokenKey: "sponsorshipToken",
        meEndpoint: "/api/sponsorship/me",
        loginPath: "/sponsorship/login",
    },
    tbridge: {
        tokenKey: "tBridgeToken",
        meEndpoint: "/api/tbridge/me",
        loginPath: "/tbridge/login",
    },
};

function ProtectedRoute({ children, ecosystem }) {
    const location = useLocation();
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    const config = AUTH_CONFIG[ecosystem];
    const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

    useEffect(() => {
        let cancelled = false;

        async function validateSession() {
            setChecking(true);
            setAuthenticated(false);

            if (!config) {
                console.error("Unknown protected ecosystem:", ecosystem);
                setChecking(false);
                return;
            }

            const token = localStorage.getItem(config.tokenKey);

            if (!token) {
                setChecking(false);
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}${config.meEndpoint}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    localStorage.removeItem(config.tokenKey);

                    setChecking(false);
                    return;
                }

                // A successful protected /me response validates the session.
                // Parse JSON too, so malformed responses are not accepted.
                await response.json();

                if (!cancelled) {
                    setAuthenticated(true);
                }
            } catch (error) {
                console.error(
                    `${ecosystem} session validation failed:`,
                    error
                );

                // Never grant access if validation cannot be completed.
                if (!cancelled) {
                    setAuthenticated(false);
                }
            } finally {
                if (!cancelled) {
                    setChecking(false);
                }
            }
        }

        validateSession();

        return () => {
            cancelled = true;
        };
    }, [API_URL, config, ecosystem]);

    if (checking) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f7f8fa",
                    fontFamily: "Arial, sans-serif",
                    color: "#475467",
                }}
            >
                <div
                    style={{
                        width: 34,
                        height: 34,
                        border: "3px solid #e5e7eb",
                        borderTopColor: "#111827",
                        borderRadius: "50%",
                        animation: "sicr-spin 0.8s linear infinite",
                    }}
                />

                <p>Verifying your login session...</p>

                <style>
                    {`
                        @keyframes sicr-spin {
                            to { transform: rotate(360deg); }
                        }
                    `}
                </style>
            </div>
        );
    }

    if (!authenticated) {
        return (
            <Navigate
                to={config?.loginPath || "/login"}
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    return children;
}

export default ProtectedRoute;
