import type { ReactElement } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { RootState } from "../store/store";

interface ProtectedRouteProps {
  allowedRoles: string[];
  redirectPath?: string;
  children?: ReactElement;
}

const ProtectedRoute = ({
  allowedRoles,
  redirectPath = "/",
  children,
}: ProtectedRouteProps) => {
  const authUser = useSelector((state: RootState) => state.auth.authUser);
  const role = authUser?.profile?.role;

  const location = useLocation();

  if (!authUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
