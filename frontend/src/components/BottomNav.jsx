import { Box, Typography } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

const BottomNav = () => (
  <Box component="nav" className="bottom-nav" aria-label="Primary">
    <Box className="bottom-nav-item bottom-nav-item--active" aria-current="page">
      <HomeRoundedIcon fontSize="small" />
      <Typography>Home</Typography>
    </Box>
  </Box>
);

export default BottomNav;
