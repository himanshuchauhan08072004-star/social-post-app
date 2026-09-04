import { useState } from "react";
import { Box, Avatar, TextField, IconButton, Typography, Collapse, CircularProgress } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useAuth } from "../context/AuthContext";
import { addCommentRequest } from "../services/postService";
import { colorForName, initialsFor } from "../utils/avatarColor";

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

const CommentSection = ({ postId, comments, open, onCommentAdded, onError }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    const optimisticText = text.trim();
    setText("");
    try {
      const data = await addCommentRequest(postId, optimisticText);
      onCommentAdded(data.comment);
    } catch (err) {
      setText(optimisticText);
      onError?.("Couldn't post your comment. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Collapse in={open} unmountOnExit timeout={180}>
      <Box className="comment-section">
        {comments.length > 0 && (
          <Box className="comment-list">
            {comments.map((c) => (
              <Box key={c._id || `${c.userId}-${c.createdAt}`} className="comment-item">
                <Avatar className="comment-avatar" style={{ background: colorForName(c.username) }}>
                  {initialsFor(c.username)}
                </Avatar>
                <Box className="comment-bubble">
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
                    <Typography variant="body2" className="comment-username">
                      {c.username}
                    </Typography>
                    <Typography variant="caption" className="comment-time">
                      {timeAgo(c.createdAt)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" className="comment-text">
                    {c.text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit} className="comment-form">
          <Avatar className="comment-avatar" style={{ background: colorForName(user?.name) }}>
            {initialsFor(user?.name)}
          </Avatar>
          <TextField
            fullWidth
            size="small"
            placeholder="Write a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitting}
            className="comment-input"
            inputProps={{ "aria-label": "Write a comment" }}
          />
          <IconButton
            type="submit"
            disabled={!text.trim() || submitting}
            className="comment-send-btn"
            aria-label="Send comment"
          >
            {submitting ? <CircularProgress size={16} /> : <SendRoundedIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>
    </Collapse>
  );
};

export default CommentSection;
