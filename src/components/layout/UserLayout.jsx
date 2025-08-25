import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Icon } from "@iconify/react";
import {
  Outlet,
  Link,
  useLocation,
  matchPath,
  useNavigate,
} from "react-router-dom";

const drawerWidth = 240;

const gradientBg = "linear-gradient(135deg, #9D50BB 0%, #6E48AA 100%)";

const gradientShadow = "4px 0px 15px rgba(0, 0, 0, 0.3)";

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  background: gradientBg,
  color: "#ffffff",
  boxShadow: gradientShadow,
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  background: gradientBg,
  color: "#ffffff",
  boxShadow: gradientShadow,
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  minHeight: 70,
  borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: gradientBg,
  color: "#ffffff",
  boxShadow: "0px 2px 15px rgba(0, 0, 0, 0.2)",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiPaper-root": {
    background: gradientBg,
    color: "#ffffff",
    boxShadow: gradientShadow,
  },
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const menuItemStyle = {
  margin: "4px 8px",
  borderRadius: "10px",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    transform: "translateX(5px)",
    transition: "all 0.3s ease",
  },
  "&.Mui-selected": {
    background: "rgba(255, 255, 255, 0.2)",
    borderLeft: "4px solid #ffffff",
  },
};

const menuItems = [
  { label: "Home", icon: "mdi:home", path: "/user/dashboard" },
  { label: "Profile", icon: "pajamas:profile", path: "/user/profile" },
];

export default function UserLayout() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const location = useLocation();

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const isActive = (path) => matchPath({ path }, location.pathname) !== null;

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/auth/login");
  };

  return (
    <Box sx={{ display: "flex", background: "#f8f9fa", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[{ marginRight: 5 }, open && { display: "none" }]}
            >
              <Icon icon="mdi:menu" width={24} height={24} />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: 600 }}
            >
              Normal User Dashboard
            </Typography>
          </Box>

          <IconButton
            color="inherit"
            sx={{ ml: 2 }}
            onClick={() => navigate("/user/profile")}
          >
            <Icon icon="mdi:account-circle" width={34} height={34} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose} sx={{ color: "#ffffff" }}>
            {theme.direction === "rtl" ? (
              <Icon icon="mdi:chevron-right" width={24} height={24} />
            ) : (
              <Icon icon="mdi:chevron-left" width={24} height={24} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {menuItems.map(({ label, icon, path }) => (
            <ListItem key={label} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                to={path}
                selected={!!isActive(path)}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                    justifyContent: open ? "initial" : "center",
                  },
                  menuItemStyle,
                ]}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: isActive(path) ? "#ffffff" : "#f1f1f1",
                  }}
                >
                  <Icon icon={icon} width={24} height={24} />
                </ListItemIcon>
                <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: "auto" }}>
          <Divider />
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={handleLogout}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                    justifyContent: open ? "initial" : "center",
                  },
                  menuItemStyle,
                ]}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#ffffff",
                  }}
                >
                  <Icon icon="tabler:logout" width={24} height={24} />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: "#EEF1F0",
          pt: "80px",
          pr: 2,
          pl: 2,
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
