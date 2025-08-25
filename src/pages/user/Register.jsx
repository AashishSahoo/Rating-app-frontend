import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Icon } from "@iconify/react";
import axios from "../../utils/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = "Name must be 20-60 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.address) newErrors.address = "Address is required";

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = "Password must be 8-16 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Must include at least 1 uppercase letter";
    } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(formData.password)) {
      newErrors.password = "Must include at least 1 special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const payload = { ...formData, role: "user" };
      const result = await axios.post("/auth/register", payload);

      if (result.data.resultCode === 0) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful 🎉",
          text: result.data.resultMessage,
          confirmButtonColor: "#2e7d32",
        });

        setFormData({ name: "", email: "", address: "", password: "" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: result.data.resultMessage,
          confirmButtonColor: "#d32f2f",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#d32f2f",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "97vh",
        width: "99vw",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e1f5fe 0%, #e8f5e9 100%)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "90%",
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Icon icon="mdi:account-plus" width={60} height={60} color="#2e7d32" />
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ mt: 2, mb: 3, color: "#2e7d32" }}
        >
          Create Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={handleChange("name")}
            error={!!errors.name}
            helperText={errors.name}
            size="small"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            value={formData.email}
            onChange={handleChange("email")}
            error={!!errors.email}
            helperText={errors.email}
            size="small"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Address"
            value={formData.address}
            onChange={handleChange("address")}
            error={!!errors.address}
            helperText={errors.address}
            size="small"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange("password")}
            error={!!errors.password}
            helperText={errors.password}
            size="small"
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    <Icon
                      icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                      width={22}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              py: 1.2,
              fontWeight: 600,
              borderRadius: 3,
              background: "linear-gradient(to right, #43a047, #2e7d32)",
              "&:hover": {
                background: "linear-gradient(to right, #388e3c, #1b5e20)",
              },
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Register"
            )}
          </Button>
        </Box>

        <Typography
          variant="body2"
          sx={{ mt: 3, color: "#555", textAlign: "center" }}
        >
          Already have an account?{" "}
          <Typography
            component="span"
            onClick={() => navigate("/auth/login")}
            sx={{
              color: "#2e7d32",
              fontWeight: 500,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Login
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
}
