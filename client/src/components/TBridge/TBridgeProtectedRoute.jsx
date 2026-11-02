import { Navigate } from "react-router-dom";

const TBridgeProtectedRoute = ({
    children
}) => {
    const token =
        localStorage.getItem(
            "tBridgeToken"
        );

    if (!token) {
        return (
            <Navigate
                to="/tbridge/login"
                replace
            />
        );
    }

    return children;
};

export default TBridgeProtectedRoute;