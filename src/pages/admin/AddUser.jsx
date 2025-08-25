import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import api from "../../utils/axios";

const roles = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
  { value: "store_owner", label: "Store Owner" },
];

export default function AddUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "",
    storeName: "",
    storeEmail: "",
    storeAddress: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.name.length < 20 || form.name.length > 60) {
      Swal.fire(
        "Validation Error",
        "Name must be between 20 and 60 characters.",
        "warning"
      );
      return;
    }
    if (form.password.length < 8 || form.password.length > 16) {
      Swal.fire(
        "Validation Error",
        "Password must be between 8 and 16 characters.",
        "warning"
      );
      return;
    }
    if (form.role === "store_owner" && (!form.storeName || !form.storeEmail)) {
      Swal.fire(
        "Validation Error",
        "Store Owner must have store details.",
        "warning"
      );
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      address: form.address,
      role: form.role,
      ...(form.role === "store_owner" && {
        store: {
          name: form.storeName,
          email: form.storeEmail,
          address: form.storeAddress,
        },
      }),
    };

    try {
      setLoading(true);

      const res = await api.post("/admin/add-user", payload);

      if (res.data.resultCode === 0) {
        Swal.fire("Success", res.data.resultMessage, "success");

        setForm({
          name: "",
          email: "",
          password: "",
          address: "",
          role: "",
          storeName: "",
          storeEmail: "",
          storeAddress: "",
        });
      } else {
        Swal.fire("Error", res.data.resultMessage, "error");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.resultMessage || "Something went wrong!",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            mb: 3,
            color: "#000",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Icon icon="wpf:add-user" width="40" height="40" />
          Add New User
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              size="small"
              label="Full Name"
              placeholder="Enter full name"
              fullWidth
              required
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              InputProps={{
                startAdornment: (
                  <Icon
                    icon="mdi:account"
                    width="22"
                    height="22"
                    style={{ marginRight: 8 }}
                  />
                ),
              }}
            />

            <TextField
              size="small"
              label="Email"
              type="email"
              placeholder="Enter email"
              fullWidth
              required
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              InputProps={{
                startAdornment: (
                  <Icon
                    icon="mdi:email"
                    width="22"
                    height="22"
                    style={{ marginRight: 8 }}
                  />
                ),
              }}
            />

            <TextField
              size="small"
              label="Password"
              type="password"
              placeholder="Enter password"
              fullWidth
              required
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              InputProps={{
                startAdornment: (
                  <Icon
                    icon="mdi:lock"
                    width="22"
                    height="22"
                    style={{ marginRight: 8 }}
                  />
                ),
              }}
              helperText="8-16 characters"
            />

            <TextField
              size="small"
              label="Address"
              placeholder="Enter address"
              fullWidth
              multiline
              minRows={1}
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              InputProps={{
                startAdornment: (
                  <Icon
                    icon="mdi:map-marker"
                    width="22"
                    height="22"
                    style={{ marginRight: 8 }}
                  />
                ),
              }}
            />

            <TextField
              size="small"
              select
              label="Role"
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              fullWidth
              required
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </TextField>

            {form.role === "store_owner" && (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Icon icon="fa-solid:store" />
                  Store Details
                </Typography>

                <TextField
                  size="small"
                  label="Store Name"
                  placeholder="Enter store name"
                  fullWidth
                  required
                  value={form.storeName}
                  onChange={(e) => handleChange("storeName", e.target.value)}
                />

                <TextField
                  size="small"
                  label="Store Email"
                  type="email"
                  placeholder="Enter store email"
                  fullWidth
                  required
                  value={form.storeEmail}
                  onChange={(e) => handleChange("storeEmail", e.target.value)}
                />

                <TextField
                  size="small"
                  label="Store Address"
                  placeholder="Enter store address"
                  fullWidth
                  multiline
                  minRows={1}
                  value={form.storeAddress}
                  onChange={(e) => handleChange("storeAddress", e.target.value)}
                />
              </>
            )}

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: "#000", px: 3 }}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} sx={{ color: "#1fe71bff" }} />
                  ) : (
                    <Icon icon="mdi:content-save" />
                  )
                }
                disabled={loading}
              >
                {loading ? "Saving..." : "Save User"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
