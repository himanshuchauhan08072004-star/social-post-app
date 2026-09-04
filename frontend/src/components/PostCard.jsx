import { useState } from "react";
import { Box, Avatar, Typography, IconButton, Paper, Tooltip, Menu, MenuItem } from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { useAuth } from "../context/AuthContext";
import { toggleLikeRequest, deletePostRequest } from "../services/postService";
import CommentSection from "./CommentSection";
import { colorForName, initialsFor } from "../utils/avatarColor";

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const PostCard = ({ post, onDeleted, onError }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [liking, setLiking] = useState(false);
  const [justLiked, setJustLiked] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const isLiked = likes.some((l) => String(l.userId) === String(user?.id));
  const isOwner = String(post.userId) === String(user?.id);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);

    const prevLikes = likes;
    if (isLiked) {
      setLikes(likes.filter((l) => String(l.userId) !== String(user.id)));
    } else {
      setLikes([...likes, { userId: user.id, username: user.name }]);
      setJustLiked(true);
      setTimeout(() => setJustLiked(false), 260);
    }

    try {
      const data = await toggleLikeRequest(post._id);
      setLikes(data.likes);
    } catch (err) {
      setLikes(prevLikes);
      onError?.("Couldn't update your like. Try again.");
    } finally {
      setLiking(false);
    }
  };

  const handleCommentAdded = (comment) => {
    setComments((prev) => [...prev, comment]);
  };

  const handleDelete = async () => {
    setMenuAnchor(null);
    try {
      await deletePostRequest(post._id);
      onDeleted?.(post._id);
    } catch (err) {
      onError?.("Couldn't delete this post. Try again.");
    }
  };

  const likedByNames = likes.slice(0, 3).map((l) => l.username).join(", ");

  return (
    <Paper className="post-card" elevation={0}>
      <Box className="post-header">
        <Avatar className="post-avatar" style={{ background: colorForName(post.username) }}>
          {initialsFor(post.username)}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography className="post-username">{post.username}</Typography>
          <Typography className="post-timestamp">{timeAgo(post.createdAt)}</Typography>
        </Box>
        {isOwner && (
          <>
            <IconButton
              size="small"
              className="more-btn"
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              aria-label="Post options"
            >
              <MoreHorizRoundedIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleDelete} className="delete-menu-item">
                Delete post
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      {post.text && <Typography className="post-text">{post.text}</Typography>}

      {post.imageUrl && (
        <Box className="post-image-wrap">
          <img src={post.imageUrl} alt={post.text ? `Image attached to: ${post.text}` : "Post attachment"} className="post-image" loading="lazy" />
        </Box>
      )}

      {likes.length > 0 && (
        <Tooltip title={likedByNames}>
          <Typography variant="caption" className="likes-summary">
            Liked by <strong>{likedByNames}</strong>
            {likes.length > 3 ? ` and ${likes.length - 3} more` : ""}
          </Typography>
        </Tooltip>
      )}

      <Box className="post-actions">
        <Box
          className="action-btn"
          onClick={handleLike}
          role="button"
          tabIndex={0}
          aria-pressed={isLiked}
          aria-label={isLiked ? "Unlike post" : "Like post"}
          onKeyDown={(e) => e.key === "Enter" && handleLike()}
        >
          <IconButton
            size="small"
            disabled={liking}
            className={isLiked ? "like-icon liked" : "like-icon"}
            disableRipple
          >
            <span className={justLiked ? "like-pop" : ""}>
              {isLiked ? <FavoriteRoundedIcon fontSize="small" /> : <FavoriteBorderRoundedIcon fontSize="small" />}
            </span>
          </IconButton>
          <Typography variant="body2" className="action-count">{likes.length}</Typography>
        </Box>

        <Box
          className="action-btn"
          onClick={() => setCommentsOpen((v) => !v)}
          role="button"
          tabIndex={0}
          aria-expanded={commentsOpen}
          aria-label="Toggle comments"
          onKeyDown={(e) => e.key === "Enter" && setCommentsOpen((v) => !v)}
        >
          <IconButton size="small" disableRipple>
            <ChatBubbleOutlineRoundedIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" className="action-count">{comments.length}</Typography>
        </Box>
      </Box>

      <CommentSection
        postId={post._id}
        comments={comments}
        open={commentsOpen}
        onCommentAdded={handleCommentAdded}
        onError={onError}
      />
    </Paper>
  );
};

export default PostCard;
