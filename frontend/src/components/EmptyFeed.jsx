import { Box, Typography, Button } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

const EmptyFeed = ({ onCompose }) => (
  <Box className="empty-state">
    <Box className="empty-icon">
      <EditRoundedIcon />
    </Box>
    <Typography className="empty-title">No posts yet</Typography>
    <Typography className="empty-subtitle">
      Be the first to share something with the community.
    </Typography>
    {onCompose && (
      <Button
        variant="contained"
        className="post-btn"
        onClick={onCompose}
        sx={{ mt: 2 }}
      >
        Create a post
      </Button>
    )}
  </Box>
);

export default EmptyFeed;
