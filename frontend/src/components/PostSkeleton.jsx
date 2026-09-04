import { Box, Paper } from "@mui/material";

const PostSkeleton = () => (
  <Paper className="post-card skeleton-card" elevation={0}>
    <Box className="post-header">
      <Box className="skel skel-avatar" />
      <Box sx={{ flex: 1 }}>
        <Box className="skel skel-line" sx={{ width: "35%", mb: 0.6 }} />
        <Box className="skel skel-line" sx={{ width: "20%", height: 10 }} />
      </Box>
    </Box>
    <Box className="skel skel-line" sx={{ width: "90%", mt: 1.5 }} />
    <Box className="skel skel-line" sx={{ width: "65%", mt: 0.8 }} />
    <Box className="skel skel-image" sx={{ mt: 1.5 }} />
  </Paper>
);

export default PostSkeleton;
