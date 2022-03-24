import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";
import { CSSObject, Theme } from "@mui/material";
import { MENU_ITEM } from "../constants/variable";
import { AppBarProps } from "../interfaces/interface";
import { drawerWidth } from "../constants/variable";
import { useAuth } from "../contexts/AuthContext";
import SearchBox from "../components/SearchBox/SearchBox";
import Main from "./Main";
import AvatarAccount from "../components/AvatarAccount/AvatarAccount";

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  top: "65px",
  border: "none",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  top: "65px",
  border: "none",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  backgroundColor: "#ffffff",
  color: "#5f6368",
  boxShadow: "#dadce0 0px -1px 0px 0px inset",
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: "100%",
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
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const themeListItemText = createTheme({
  typography: {
    allVariants: {
      fontSize: 14,
    },
  },
});

export default function MiniDrawer() {
  const { currentUser, signOutAccount } = useAuth();
  const [open, setOpen] = React.useState(true);
  const [close, setClose] = React.useState(false);
  const [activeLink, setActiveLink] = React.useState(0);

  const handleShowDrawer = () => {
    setClose(!close);
    setOpen(!open);
  };

  const handleHoverShowDrawer = () => {
    setOpen(true);
  };

  const handleHoverHideDrawer = () => {
    if (close) {
      setOpen(false);
    }
  };

  const handleChangeActiveLink = (index: number) => {
    return (event: any) => {
      setActiveLink(index);
    };
  };

  return (
    <Box sx={{ display: "flex", pl: 1, pr: 1 }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleShowDrawer}
              edge="start"
              sx={{
                marginRight: 1,
              }}
            >
              <MenuIcon />
            </IconButton>
            <div
              className="brand"
              style={{ display: "flex", alignItems: "center" }}
            >
              <img
                src="/images/google-keep-logo.png"
                style={{ width: "40px", height: "40px" }}
              />
              <Typography variant="h6" noWrap sx={{ ml: 1 }}>
                Keep
              </Typography>
            </div>
          </div>
          <SearchBox />
          {currentUser && <AvatarAccount />}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <List
          onMouseOver={handleHoverShowDrawer}
          onMouseOut={handleHoverHideDrawer}
        >
          {MENU_ITEM.map((item, index) => (
            <ListItemButton
              key={index}
              sx={{
                justifyContent: open ? "initial" : "center",
                borderRadius: "0 50px 50px 0",
                minHeight: 20,
                px: 1,
                py: 0,
                backgroundColor:
                  index === activeLink && open ? "#feefc3" : "none",
                "&:hover":
                  index === activeLink && open
                    ? { backgroundColor: "#feefc3" }
                    : { backgroundColor: "#f1f3f4" },
              }}
              disableRipple
              onClick={handleChangeActiveLink(index)}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : "auto",
                  justifyContent: "center",
                }}
              >
                <IconButton
                  disableRipple
                  sx={{
                    backgroundColor:
                      index === activeLink && !open ? "#feefc3" : "none",
                  }}
                  size="large"
                >
                  <Icon>{item.icon}</Icon>
                </IconButton>
              </ListItemIcon>

              <ThemeProvider theme={themeListItemText}>
                <ListItemText
                  primary={item.name}
                  sx={{
                    opacity: open ? 1 : 0,
                  }}
                />
              </ThemeProvider>
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Main />
      </Box>
    </Box>
  );
}
