import React, { useEffect, useState } from "react";
import { Grid, Skeleton } from "@mui/material";
import StatCard from "../../components/admin/StatCard";
import RatingsChart from "../../components/admin/RatingsChart";
import axios from "../../utils/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/admin/dashboard-stat");
        if (data.resultCode === 0) {
          setStats(data.resultData);
        } else {
          console.error("Error fetching dashboard stats:", data.resultMessage);
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const getSparklineData = (value) =>
    Array.from({ length: 6 }, (_, i) => ({
      value: Math.max(0, Math.round(value * (0.8 + Math.random() * 0.4))),
    }));

  const getRatingChartData = (monthlyRatings) =>
    monthlyRatings.map((m) => ({
      value: m.r1 + m.r2 + m.r3 + m.r4 + m.r5,
    }));

  return (
    <Grid container spacing={3} mb={4} maxWidth="100%">
      <Grid item xs={12} sm={4}>
        {loading ? (
          <Skeleton variant="rectangular" height={100} />
        ) : (
          <StatCard
            title="Total Users"
            value={stats?.totalUsers ?? 0}
            data={getSparklineData(stats?.totalUsers ?? 0)}
            color="#4facfe"
            icon="fa-solid:users"
          />
        )}
      </Grid>

      <Grid item xs={12} sm={4}>
        {loading ? (
          <Skeleton variant="rectangular" height={100} />
        ) : (
          <StatCard
            title="Submitted Ratings"
            value={stats?.totalRatings ?? 0}
            data={getRatingChartData(stats?.monthlyRatings || [])}
            color="#b70ecdff"
            icon="streamline-ultimate:human-resources-rating-woman-bold"
          />
        )}
      </Grid>

      <Grid item xs={12} sm={4}>
        {loading ? (
          <Skeleton variant="rectangular" height={100} />
        ) : (
          <StatCard
            title="Total Stores"
            value={stats?.totalStores ?? 0}
            data={getSparklineData(stats?.totalStores ?? 0)}
            color="#24f068ff"
            icon="ic:twotone-store"
          />
        )}
      </Grid>

      <Grid item xs={12}>
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <h2
            style={{
              marginTop: "0.5rem",
              marginBottom: "16px",
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#333",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Ratings Overview (Monthly)
          </h2>
          {loading ? (
            <Skeleton variant="rectangular" height={400} />
          ) : (
            <RatingsChart monthlyRatings={stats?.monthlyRatings || []} />
          )}
        </div>
      </Grid>
    </Grid>
  );
}
