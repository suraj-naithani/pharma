import type { ProtectedRouteProps } from "@/types/auth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, user, redirect = "/signin", requireAuth = true }) => {
    if (requireAuth && !user) {
        return <Navigate to={redirect} />;
    }

    if (!requireAuth && user) {
        return <Navigate to="/dashboard" />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
