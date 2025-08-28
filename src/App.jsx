import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OwnerLayout from "./components/layout/OwnerLayout";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import UserLayout from "./components/layout/UserLayout";
import UserDashboard from "./pages/user/UserDashboard";
import Login from "./pages/Login";
import Register from "./pages/user/Register";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./pages/user/UserProfile";
import UserManagement from "./pages/admin/UserManagement";
import StoreManagement from "./pages/admin/StoreManagement";
import AddUser from "./pages/admin/AddUser";
import OwnerProfile from "./pages/owner/OwnerProfile";

function App() {
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  return (
    <>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        <Route
          path="/"
          element={
            user ? (
              user.role === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : user.role === "store_owner" ? (
                <Navigate to="/owner/dashboard" replace />
              ) : (
                <Navigate to="/user/dashboard" replace />
              )
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        />
        {/* // admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="add-user" element={<AddUser />} />

          <Route path="users" element={<UserManagement />} />

          <Route path="stores" element={<StoreManagement />} />
        </Route>

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRoles={["store_owner"]}>
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="profile" element={<OwnerProfile />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
