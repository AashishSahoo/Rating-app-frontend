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
  Tooltip,
  Stack,
  TextField,
  Button,
  Skeleton,
  TableSortLabel,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Icon } from "@iconify/react";
import axios from "../../utils/axios";
import Swal from "sweetalert2";

const gradientBg = "linear-gradient(135deg, #9D50BB 0%, #6E48AA 100%)";

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

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [userRating, setUserRating] = useState(0);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/user/get-stores");
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

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
  };

  const handleOpenRatingDialog = (store) => {
    setSelectedStore(store);
    setUserRating(store.userRating || 0);
    setRatingDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setRatingDialogOpen(false);
    setSelectedStore(null);
    setUserRating(0);
  };

  const handleSubmitRating = async () => {
    try {
      const { data } = await axios.post(
        `/user/rate-store/${selectedStore.id}`,
        { rating: userRating }
      );

      handleCloseDialog();

      if (data.resultCode === 0) {
        Swal.fire("Success", "Rating submitted successfully", "success");
        fetchStores();
      } else {
        Swal.fire("Error", data.resultMessage, "error");
      }
    } catch (err) {
      handleCloseDialog();
      Swal.fire("Error", "Failed to submit rating", "error");
    }
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
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
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          background: "#fff",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              background: gradientBg,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <Icon icon="fa-solid:store-alt" width="32" height="32" />
            Stores
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="flex-end"
          mb={2}
        >
          <TextField
            size="small"
            label="Search"
            placeholder="Name, Address"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <Icon icon="mdi:magnify" style={{ marginRight: 6 }} />
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={() => setSearch(searchInput)}
            sx={{
              background: gradientBg,
              "&:hover": { opacity: 0.9, background: gradientBg },
            }}
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
                    { label: "Address", field: "address" },
                    { label: "Overall Rating", field: "avgRating" },
                    { label: "Your Rating", field: null },
                    { label: "Action", field: null },
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
                    <TableRow hover key={store.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>
                        <Tooltip title={store.name}>
                          <span>{store.name}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={store.address}>
                          <span>{store.address}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Rating
                          value={store.avgRating || 0}
                          precision={0.5}
                          readOnly
                        />
                      </TableCell>
                      <TableCell>
                        <Rating value={store.userRating || 0} readOnly />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Icon icon="mdi:star-edit" />}
                          onClick={() => handleOpenRatingDialog(store)}
                          sx={{
                            borderColor: "#6E48AA",
                            color: "#6E48AA",
                            "&:hover": {
                              background: gradientBg,
                              color: "#fff",
                            },
                          }}
                        >
                          Rate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
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

      <Dialog
        open={ratingDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            background: "#fdfdfd",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.4rem",
            fontWeight: "bold",
            textAlign: "center",
            color: "#6E48AA",
          }}
        >
          Rate {selectedStore?.name}
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
            mt: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Select a rating between 1 and 5
          </Typography>
          <Rating
            value={userRating}
            onChange={(e, newValue) => setUserRating(newValue)}
            precision={1}
            max={5}
            size="large"
          />
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
            pb: 2,
          }}
        >
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderColor: "#6E48AA",
              color: "#6E48AA",
              px: 3,
              "&:hover": {
                background: gradientBg,
                color: "#fff",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitRating}
            variant="contained"
            disabled={userRating === 0}
            sx={{
              px: 3,
              background: gradientBg,
              "&:hover": { opacity: 0.9, background: gradientBg },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
