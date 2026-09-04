import { Box, Typography, Divider } from "@mui/material";

const RightSidebar = ({ totalPosts }) => (
  <Box component="aside" className="right-sidebar" aria-label="Community info">
    <Box className="side-card">
      <Typography className="side-card-title">Welcome to Loop</Typography>
      <Typography className="side-card-text">
        Share ideas, photos and moments with the community.
      </Typography>
    </Box>

    {typeof totalPosts === "number" && (
      <Box className="side-card side-card--stat">
        <Typography className="side-stat-number">{totalPosts}</Typography>
        <Typography className="side-stat-label">
          {totalPosts === 1 ? "post shared so far" : "posts shared so far"}
        </Typography>
      </Box>
    )}
  </Box>
);

export default RightSidebar;
