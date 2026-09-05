import { useEffect, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { fetchStats, fetchTrending, fetchRecentUsers } from "../services/postService";
import { colorForName, initialsFor, handleFor } from "../utils/avatarColor";

const RightSidebar = ({ refreshKey }) => {
  const [stats, setStats] = useState(null);
  const [trending, setTrending] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchStats().then(setStats).catch(() => {});
    fetchTrending().then((d) => setTrending(d.trending || [])).catch(() => {});
    fetchRecentUsers().then((d) => setMembers(d.users || [])).catch(() => {});
  }, [refreshKey]);

  return (
    <Box component="aside" className="right-sidebar" aria-label="Community info">
      <Box className="side-card">
        <Typography className="side-card-title">Welcome to Loop 👋</Typography>
        <Typography className="side-card-text">
          Share ideas, photos and moments with the community.
        </Typography>

        {stats && (
          <Box className="stat-row">
            <Box className="stat-item">
              <Typography className="stat-number">{stats.totalPosts}</Typography>
              <Typography className="stat-label">Posts</Typography>
            </Box>
            <Box className="stat-item">
              <Typography className="stat-number">{stats.totalUsers}</Typography>
              <Typography className="stat-label">Members</Typography>
            </Box>
            <Box className="stat-item">
              <Typography className="stat-number">{stats.totalComments}</Typography>
              <Typography className="stat-label">Comments</Typography>
            </Box>
          </Box>
        )}
      </Box>

      {trending.length > 0 && (
        <Box className="side-card">
          <Typography className="side-card-title">Trending Topics</Typography>
          <Box className="trending-list">
            {trending.map((t) => (
              <Box key={t.tag} className="trending-item">
                <Typography className="trending-tag">{t.tag}</Typography>
                <Typography className="trending-count">
                  {t.count} {t.count === 1 ? "post" : "posts"}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {members.length > 0 && (
        <Box className="side-card">
          <Typography className="side-card-title">Recent Members</Typography>
          <Box className="member-list">
            {members.map((m) => (
              <Box key={m.id} className="member-item">
                <Avatar className="comment-avatar" style={{ background: colorForName(m.name) }}>
                  {initialsFor(m.name)}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography className="member-name">{m.name}</Typography>
                  <Typography className="member-handle">{handleFor(m.name)}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RightSidebar;
