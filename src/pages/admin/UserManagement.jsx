import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  TableSortLabel,
  TablePagination,
  Stack,
  Skeleton,
} from "@mui/material";
import { Icon } from "@iconify/react";
import axiosInstance from "../../utils/axios";

const getRoleColor = (role) => {
  switch (role) {
    case "admin":
      return "primary";
    case "user":
      return "success";
    case "store_owner":
      return "secondary";
    default:
      return "default";
  }
};

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

export default function UserManagement() {
  const [filters, setFilters] = useState({ search: "", role: "" });
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/get-user");
      if (res.data.resultCode === 0) {
        const formattedUsers = res.data.resultData.map((u) => ({
          ...u,
          role: u.role?.name || u.role,
        }));
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filtered = users.filter((user) => {
      const matchSearch =
        filters.search === "" ||
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.address.toLowerCase().includes(filters.search.toLowerCase());

      const matchRole = filters.role === "" || user.role === filters.role;
      return matchSearch && matchRole;
    });
    setFilteredUsers(filtered);
    setPage(0);
  };

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
  };

  const sortedUsers = sortData(filteredUsers, orderBy, order);
  const paginatedUsers = sortedUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            mb: 2,
            color: "#000",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Icon icon="fa7-solid:users" width="48" height="48" />
          User Management
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="flex-end"
          mb={3}
        >
          <TextField
            size="small"
            label="Search"
            placeholder="Name, Email or Address"
            variant="outlined"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            InputProps={{
              startAdornment: (
                <Icon icon="mdi:magnify" style={{ marginRight: 6 }} />
              ),
            }}
          />

          <TextField
            size="small"
            select
            label="Role"
            variant="outlined"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            sx={{ minWidth: 150 }}
            InputProps={{
              startAdornment: (
                <Icon icon="mdi:filter" style={{ marginRight: 6 }} />
              ),
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="store_owner">Store Owner</MenuItem>
          </TextField>

          <Button
            sx={{ backgroundColor: "#000" }}
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
                  {["Sr", "Name", "Email", "Address", "Role", "Rating"].map(
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
                        {["Name", "Email", "Address", "Role"].includes(
                          header
                        ) ? (
                          <TableSortLabel
                            active={
                              orderBy.toLowerCase() === header.toLowerCase()
                            }
                            direction={
                              orderBy.toLowerCase() === header.toLowerCase()
                                ? order
                                : "asc"
                            }
                            onClick={() => handleSort(header.toLowerCase())}
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
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user, index) => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                    >
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.address}</TableCell>
                      <TableCell>
                        <Chip
                          icon={
                            user.role === "admin" ? (
                              <Icon icon="mdi:shield-account" />
                            ) : user.role === "user" ? (
                              <Icon icon="mdi:account" />
                            ) : (
                              <Icon icon="mdi:store" />
                            )
                          }
                          label={user.role}
                          color={getRoleColor(user.role)}
                          sx={{
                            minWidth: 120,
                            justifyContent: "flex-start",
                            px: 1,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        {user.role === "store_owner" ? (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Icon
                              icon="line-md:star-alt-filled"
                              width="20"
                              height="20"
                              color="#fbc02d"
                            />
                            <span>{user.avgRating || "0"}</span>
                          </Box>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={filteredUsers.length}
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
