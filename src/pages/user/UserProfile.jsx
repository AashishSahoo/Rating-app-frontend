// src/pages/UserProfile.js
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Avatar,
} from "@mui/material";
import axios from "../../utils/axios";
import { Icon } from "@iconify/react";

export default function UserProfile() {
  const [user, setUser] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handlePasswordChange = async () => {
    setError("");
    setSuccessMsg("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      return setError("All password fields are required.");
    }
    if (newPassword !== confirmPassword) {
      return setError("New password and confirm password do not match.");
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const res = await axios.patch("/user/edit-password-user", {
        oldPassword,
        newPassword,
      });

      if (res?.data?.resultCode === 0) {
        setSuccessMsg("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else if (res?.data?.resultCode === 1) {
        setError(data.resultMessage || "Error updating password.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        mt: "1.5rem",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        spacing={3}
        fullWidth
        sx={{ ml: "0.5rem", mr: "1.5rem", mb: "2rem" }}
      >
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar sx={{ bgcolor: "#6E48AA", width: 56, height: 56 }}>
                  {user?.name?.charAt(0) || "U"}
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  My Profile
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2} gap={1}>
                    <Icon
                      icon="iconamoon:profile-circle-fill"
                      width="34"
                      height="34"
                    />
                    <Typography variant="h6" fontWeight="bold">
                      User Information
                    </Typography>
                  </Box>

                  <TextField
                    label="Name"
                    value={user?.name || ""}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Email"
                    value={user?.email || ""}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Address"
                    value={user?.address || ""}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Role"
                    value={user?.role || ""}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Icon
                      icon="hugeicons:reset-password"
                      width="34"
                      height="34"
                    />
                    <Typography variant="h6" fontWeight="bold">
                      Change Password
                    </Typography>
                  </Box>
                  <TextField
                    label="Old Password"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                  />

                  {error && (
                    <Typography color="error" variant="body2" mt={1}>
                      <Icon
                        icon="mdi:alert-circle-outline"
                        style={{ marginRight: 4 }}
                      />
                      {error}
                    </Typography>
                  )}
                  {successMsg && (
                    <Typography sx={{ color: "green" }} variant="body2" mt={1}>
                      <Icon
                        icon="mdi:check-circle-outline"
                        style={{ marginRight: 4 }}
                      />
                      {successMsg}
                    </Typography>
                  )}

                  <Box mt={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handlePasswordChange}
                      disabled={loading}
                      color="secondary"
                      sx={{ borderRadius: 2, py: 1 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
