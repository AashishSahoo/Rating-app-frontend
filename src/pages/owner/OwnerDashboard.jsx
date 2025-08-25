import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  TextField,
  Button,
} from "@mui/material";
import { Icon } from "@iconify/react";
import StatCard from "../../components/admin/StatCard";
import axiosInstance from "../../utils/axios";

function sortData(array, orderBy, order) {
  return [...array].sort((a, b) => {
    let valA = a[orderBy] || "";
    let valB = b[orderBy] || "";

    if (typeof valA === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });
}

export default function StoreDashboard() {
  const [ratingsData, setRatingsData] = useState([]);
  const [storesData, setStoresData] = useState([]);
  const [userRatings, setUserRatings] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(false);

  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/owner/dashboard-stat");
      const data = res.data?.resultData || [];

      setRatingsData(
        data.map((store) => ({
          month: store.storeName,
          value: store.avgRating,
        }))
      );

      setStoresData(data);

      const flatUsers = data.flatMap((store) =>
        store.users.map((user) => ({
          ...user,
          storeName: store.storeName,
          storeEmail: store.storeEmail,
          storeAddress: store.storeAddress,
        }))
      );

      setUserRatings(flatUsers);
      setFilteredStores(flatUsers);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const avgRating =
    ratingsData.length > 0
      ? (
          ratingsData.reduce((sum, r) => sum + r.value, 0) / ratingsData.length
        ).toFixed(1)
      : 0;

  const handleSearch = () => {
    const filtered = userRatings.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredStores(filtered);
    setPage(0);
  };

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
  };

  const sortedStores = sortData(filteredStores, orderBy, order);
  const paginatedStores = sortedStores.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={3}>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} />
          ) : (
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                background: "#f9fafb",
                height: "100%",
              }}
            >
              <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 100,
                  }}
                >
                  <Icon
                    icon="ic:twotone-store"
                    height="28"
                    width="28"
                    color="#9208d1ff"
                  />
                  My Store
                </Typography>

                <Stack spacing={1} flex={1} textAlign="right">
                  {storesData.map((store, idx) => (
                    <Box key={idx}>
                      <Typography fontWeight={600} sx={{ color: "#9208d1ff" }}>
                        {store.storeName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {store.storeAddress}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {store.storeEmail}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} />
          ) : (
            <StatCard
              title="User Ratings Count"
              value={userRatings.length}
              data={[
                { month: "Jan", value: 10 },
                { month: "Feb", value: 15 },
                { month: "Mar", value: 8 },
                { month: "Apr", value: 20 },
              ]}
              color="#3b82f6"
              icon="mdi:account-group"
            />
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {loading ? (
            <Skeleton variant="rectangular" height={140} />
          ) : (
            <StatCard
              title="Average Rating (12 Months)"
              value={`${avgRating} ★`}
              data={[
                { month: "Jan", value: 4.2 },
                { month: "Feb", value: 3.8 },
                { month: "Mar", value: 4.5 },
                { month: "Apr", value: 4.0 },
              ]}
              color="#e77e22"
              icon="line-md:star-alt-filled"
            />
          )}
        </Grid>
      </Grid>

      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            mb: 2,
            color: "#000",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Icon
            icon="streamline-freehand:human-resources-rating-man"
            width="36"
            height="36"
            color="#2193b0"
          />
          Ratings by users
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="flex-end"
          mb={3}
        >
          <TextField
            size="small"
            label="Search by User Name"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <Icon icon="mdi:magnify" style={{ marginRight: 6 }} />
              ),
            }}
          />

          <Button
            sx={{ backgroundColor: "#2193b0" }}
            variant="contained"
            onClick={handleSearch}
            startIcon={<Icon icon="mdi:magnify" />}
          >
            Search
          </Button>
        </Stack>

        {loading ? (
          <Skeleton variant="rectangular" height={450} />
        ) : (
          <TableContainer sx={{ borderRadius: 2 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["Sr", "User Name", "Email", "Address", "Rating"].map(
                    (header, idx) => (
                      <TableCell
                        key={idx}
                        sx={{
                          minWidth: 120,
                          backgroundColor: "#f5f5f5",
                          color: "#000",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                        }}
                      >
                        {["User Name", "Email", "Address"].includes(header) ? (
                          <TableSortLabel
                            active={
                              orderBy === header.replace(" ", "").toLowerCase()
                            }
                            direction={
                              orderBy === header.replace(" ", "").toLowerCase()
                                ? order
                                : "asc"
                            }
                            onClick={() =>
                              handleSort(header.replace(" ", "").toLowerCase())
                            }
                          >
                            {header}
                          </TableSortLabel>
                        ) : (
                          header
                        )}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedStores.length > 0 ? (
                  paginatedStores.map((user, index) => (
                    <TableRow key={user.email || index} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.address}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Icon
                            icon="line-md:star-alt-filled"
                            width="18"
                            height="18"
                            color="#fbc02d"
                          />
                          <span>{user.ratedOn}</span>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={filteredStores.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 20]}
            />
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
