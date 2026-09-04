import { Box, Typography, Avatar, Divider } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useAuth } from "../context/AuthContext";
import { colorForName, initialsFor } from "../utils/avatarColor";

const LeftSidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <Box component="nav" className="left-sidebar" aria-label="Primary">
      <Box className="side-nav-item side-nav-item--active">
        <HomeRoundedIcon fontSize="small" />
        <Typography>Home</Typography>
      </Box>

      <Divider className="sidebar-divider" />

      <Box className="side-user-card">
        <Avatar className="user-avatar" style={{ background: colorForName(user.name) }}>
          {initialsFor(user.name)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography className="side-user-name">{user.name}</Typography>
          <Typography className="side-user-email">{user.email}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LeftSidebar;
