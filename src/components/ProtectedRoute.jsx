import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const isAuthenticated = user ? true : false;
  const hasToken = user?.token ? true : false;

  if (!isAuthenticated || !hasToken) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
