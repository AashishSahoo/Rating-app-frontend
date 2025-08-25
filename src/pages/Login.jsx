import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = "Password must be 8-16 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Must include at least 1 uppercase letter";
    } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(formData.password)) {
      newErrors.password = "Must include at least 1 special character";
    }
    if (!formData.role) {
      newErrors.role = "Please select a role";
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

    try {
      const result = await axios.post("/auth/login", formData);

      if (result.data.resultCode === 0) {
        const { user, token } = result.data.resultData;

        sessionStorage.setItem("user", JSON.stringify({ ...user, token }));
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (user.role === "store_owner") {
          navigate("/owner/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        setErrors({ general: result.data.resultMessage });
      }
    } catch (error) {
      setErrors({ general: "Something went wrong. Try again." });
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

        background: "linear-gradient(135deg, #fff 0%, #ECD6EF  100%)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "90%",
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Icon
          icon="mdi:account-circle"
          width={60}
          height={60}
          color="#512da8"
        />
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ mt: 2, mb: 3, color: "#512da8" }}
        >
          Welcome Back
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            select
            label="Select Role"
            value={formData.role}
            onChange={handleChange("role")}
            error={!!errors.role}
            helperText={errors.role}
            size="small"
            sx={{ mb: 2 }}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="store_owner">Store Owner</MenuItem>
          </TextField>

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
          {errors.general && (
            <Typography color="error" variant="body2" sx={{ mt: 1, mb: 2 }}>
              {errors.general}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              py: 1.2,
              fontWeight: 600,
              borderRadius: 3,
              background: "linear-gradient(to right, #7b1fa2, #512da8)",
              "&:hover": {
                background: "linear-gradient(to right, #6a1b9a, #4527a0)",
              },
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>

        {formData.role === "user" && (
          <Typography
            variant="body2"
            sx={{ mt: 3, color: "#555", textAlign: "center" }}
          >
            Don’t have an account?{" "}
            <Typography
              component="span"
              onClick={() => navigate("/auth/register")}
              sx={{
                color: "#512da8",
                fontWeight: 500,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign Up
            </Typography>
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
