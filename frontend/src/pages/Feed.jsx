import { useEffect, useState, useCallback, useRef } from "react";
import { Box, Button, Typography, Snackbar, Alert } from "@mui/material";
import TopNav from "../components/TopNav";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import BottomNav from "../components/BottomNav";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import PostSkeleton from "../components/PostSkeleton";
import EmptyFeed from "../components/EmptyFeed";
import { fetchFeed } from "../services/postService";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "error" });
  const composerRef = useRef(null);

  const loadFeed = useCallback(async (pageNum) => {
    try {
      const data = await fetchFeed(pageNum, 10);
      setPosts((prev) => (pageNum === 1 ? data.posts : [...prev, ...data.posts]));
      setHasMore(data.hasMore);
      setPage(data.page);
      setTotal(data.total);
    } catch (err) {
      setToast({ open: true, message: "Couldn't load the feed. Pull to refresh.", severity: "error" });
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadFeed(1).finally(() => setLoading(false));
  }, [loadFeed]);

  const handlePostCreated = (post) => {
    setPosts((prev) => [post, ...prev]);
    setTotal((t) => (typeof t === "number" ? t + 1 : t));
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    setTotal((t) => (typeof t === "number" ? Math.max(t - 1, 0) : t));
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await loadFeed(page + 1);
    setLoadingMore(false);
  };

  const showError = (message) => setToast({ open: true, message, severity: "error" });

  const focusComposer = () => {
    composerRef.current?.querySelector("textarea")?.focus();
  };

  return (
    <Box className="app-root">
      <TopNav />

      <Box className="app-shell">
        <LeftSidebar />

        <Box component="main" className="feed-main">
          <Box className="feed-heading">
            <Typography className="feed-title">Social</Typography>
            <Typography className="feed-subtitle">See what's happening in your community.</Typography>
          </Box>

          <CreatePost onPostCreated={handlePostCreated} onError={showError} composerRef={composerRef} />

          {loading ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : posts.length === 0 ? (
            <EmptyFeed onCompose={focusComposer} />
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} onDeleted={handlePostDeleted} onError={showError} />
            ))
          )}

          {hasMore && !loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <Button variant="outlined" className="load-more-btn" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? "Loading…" : "Load more"}
              </Button>
            </Box>
          )}

          {!hasMore && !loading && posts.length > 0 && (
            <Typography className="feed-end" variant="caption">
              You're all caught up
            </Typography>
          )}
        </Box>

        <RightSidebar totalPosts={total} />
      </Box>

      <BottomNav />

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ borderRadius: "10px" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Feed;
