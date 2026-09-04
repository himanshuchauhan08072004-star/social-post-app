import { AppBar, Toolbar, Typography, Avatar, IconButton, Box, Tooltip } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { colorForName, initialsFor } from "../utils/avatarColor";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="sticky" elevation={0} className="app-navbar" component="header">
      <Toolbar className="navbar-inner">
        <Box className="brand" aria-label="Loop home">
          <svg className="brand-mark" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path
              d="M14 3a11 11 0 1 0 11 11"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <circle cx="14" cy="3" r="2.4" fill="currentColor" />
          </svg>
          <Typography className="brand-name">Loop</Typography>
        </Box>

        {user && (
          <Box className="navbar-user">
            <Box className="navbar-user-text">
              <Typography className="navbar-username">{user.name}</Typography>
              <Typography className="navbar-useremail">{user.email}</Typography>
            </Box>
            <Avatar
              className="user-avatar"
              style={{ background: colorForName(user.name) }}
            >
              {initialsFor(user.name)}
            </Avatar>
            <Tooltip title="Log out">
              <IconButton
                onClick={handleLogout}
                size="small"
                className="logout-btn"
                aria-label="Log out"
              >
                <LogoutRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
