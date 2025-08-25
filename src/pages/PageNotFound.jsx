import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "97vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #eeacb6ff 0%, #ffffff 100%)",
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Icon
          icon="mdi:alert-circle-outline"
          width={100}
          height={100}
          color="#d32f2f"
        />

        <Typography variant="h2" sx={{ mt: 2 }}>
          404
        </Typography>

        <Typography variant="h5">Oops! Page not found.</Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The page you are looking for doesn’t exist or has been moved.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Icon icon="mdi:home" />}
          onClick={() => navigate("/")}
          sx={{ borderRadius: "12px", px: 3 }}
        >
          Go Home
        </Button>
      </Container>
    </Box>
  );
};

export default PageNotFound;
