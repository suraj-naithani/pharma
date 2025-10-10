import type { ProtectedRouteProps } from "@/types/auth";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Loading from "@/components/ui/loading";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, user, redirect = "/signin", requireAuth = true }) => {
    const { isLoading } = useSelector((state: RootState) => state.auth);

    // Show loading while authentication state is being determined
    if (isLoading) {
        return <Loading />;
    }

    if (requireAuth && !user) {
        return <Navigate to={redirect} />;
    }

    if (!requireAuth && user) {
        return <Navigate to="/dashboard" />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
