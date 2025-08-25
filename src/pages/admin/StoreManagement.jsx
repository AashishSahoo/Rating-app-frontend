import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  IconButton,
  Collapse,
  Tooltip,
  Stack,
  TextField,
  Button,
  Skeleton,
  TableSortLabel,
} from "@mui/material";
import { Icon } from "@iconify/react";
import axios from "../../utils/axios";
import Swal from "sweetalert2";

function sortData(array, orderBy, order) {
  return [...array].sort((a, b) => {
    let valA = a[orderBy] || "";
    let valB = b[orderBy] || "";

    if (valA && valB && typeof valA === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });
}

export default function StoreManagement() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [expandedRow, setExpandedRow] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const fetchStores = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/admin/get-store");
      if (data.resultCode === 0) {
        setStores(data.resultData);
      } else {
        Swal.fire("Error", data.resultMessage, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch stores", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleExpandClick = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(0);
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.email.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase())
  );

  const sortedStores = sortData(filteredStores, orderBy, order);

  const paginatedStores = sortedStores.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={3}>
      <Paper
        sx={{ p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: "#fff" }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
        >
          <Icon icon="fa-solid:store-alt" width="40" height="40" />
          Store Management
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="flex-end"
          mb={2}
        >
          <TextField
            size="small"
            label="Search"
            placeholder="Name, Email, Address"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <Icon icon="mdi:magnify" style={{ marginRight: 6 }} />
              ),
            }}
          />
          <Button
            sx={{ backgroundColor: "#000" }}
            variant="contained"
            onClick={handleSearch}
          >
            Search
          </Button>
        </Stack>

        {loading ? (
          <Skeleton variant="rectangular" height={450} />
        ) : (
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    { label: "Sr", field: null },
                    { label: "Store Name", field: "name" },
                    { label: "Email", field: "email" },
                    { label: "Address", field: "address" },
                    { label: "Owner", field: "ownerName" },
                    { label: "Rating", field: "rating" },

                    { label: "Created At", field: "created_at" },
                  ].map((header, idx) => (
                    <TableCell
                      key={idx}
                      sx={{
                        fontWeight: 600,
                        backgroundColor: "#f5f5f5",
                        color: "#000",
                      }}
                    >
                      {header.field ? (
                        <TableSortLabel
                          active={orderBy === header.field}
                          direction={orderBy === header.field ? order : "asc"}
                          onClick={() => handleSort(header.field)}
                        >
                          {header.label}
                        </TableSortLabel>
                      ) : (
                        header.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedStores.length ? (
                  paginatedStores.map((store, index) => (
                    <React.Fragment key={store.id}>
                      <TableRow hover>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>
                          <Tooltip title={store.name}>
                            <span>{store.name}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={store.email}>
                            <span>{store.email}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={store.address}>
                            <span>{store.address}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {store.owner ? (
                            <Tooltip title={store.owner.name}>
                              <span>{store.owner.name}</span>
                            </Tooltip>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Icon
                              icon="line-md:star-alt-filled"
                              width="20"
                              height="20"
                              color="#fbc02d"
                            />
                            <span>{store.avgRating || "0"}</span>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {new Date(store.created_at).toLocaleString("en-GB", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                          <IconButton
                            sx={{ ml: "8px" }}
                            onClick={() => handleExpandClick(store.id)}
                          >
                            <Icon
                              icon={
                                expandedRow === store.id
                                  ? "mdi:chevron-up"
                                  : "mdi:chevron-down"
                              }
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                          <Collapse
                            in={expandedRow === store.id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ margin: 1 }}>
                              {store.owner ? (
                                <Typography variant="body2" sx={{ ml: 2 }}>
                                  <strong>Owner Email:</strong>{" "}
                                  {store.owner.email} <br />
                                  <strong>Owner Name:</strong>{" "}
                                  {store.owner.name}
                                </Typography>
                              ) : (
                                <Typography variant="body2" sx={{ ml: 2 }}>
                                  No owner info
                                </Typography>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No stores found.
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
