import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Icon from "@mui/material/Icon";
import { PersonAdd } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";

export default function AvatarAccount() {
  const { currentUser, signOutAccount } = useAuth();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="Remy Sharp" src={currentUser?.photoURL} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorElUser}
        id="account-menu"
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        onClick={handleCloseUserMenu}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 5.5,
            width: 338,
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <MenuItem
          disableRipple
          sx={{ "&:hover": { backgroundColor: "transparent" } }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Badge
              sx={{ mx: "auto" }}
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: "#ffffff",
                    boxShadow:
                      "0 1px 2px 0 rgb(60 64 67 / 30%), 0px 1px 3px 1px rgb(60 64 67 / 15%)",
                  }}
                  alt="Remy Sharp"
                >
                  <Icon sx={{ fontSize: "16px", color: "#333333" }}>
                    local_see
                  </Icon>
                </Avatar>
              }
            >
              <Avatar
                alt="Travis Howard"
                src={currentUser?.photoURL}
                sx={{ height: 80, width: 80 }}
              />
            </Badge>
            <h4 style={{ margin: "16px 0 0" }}>{currentUser?.displayName}</h4>
            <p style={{ margin: 0 }}>{currentUser?.email}</p>
            <Button
              variant="outlined"
              sx={{
                margin: "16px auto",
                display: "block",
                color: "#333333",
                borderColor: "#dadce0",
                textTransform: "none",
                borderRadius: "50px",
                "&:hover": {
                  borderColor: "#dadce0",
                },
              }}
            >
              Manage your Google Account
            </Button>
          </div>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ padding: "8px 32px" }}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <Divider />
        <Button
          variant="outlined"
          sx={{
            margin: "16px auto",
            display: "block",
            color: "#333333",
            borderColor: "#dadce0",
            textTransform: "none",
            "&:hover": {
              borderColor: "#dadce0",
            },
          }}
          onClick={signOutAccount}
        >
          Sign out of all accounts
        </Button>
        <Divider />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            margin: "8px 0",
          }}
        >
          <a style={{ color: "#333333" }} href="">
            Privacy Policy
          </a>
          <span>&nbsp;•&nbsp;</span>
          <a style={{ color: "#333333" }} href="">
            Terms of Service
          </a>
        </div>
      </Menu>
    </Box>
  );
}
