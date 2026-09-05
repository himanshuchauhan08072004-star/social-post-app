import api from "./api";

export const fetchFeed = (page = 1, limit = 10) =>
  api.get(`/posts?page=${page}&limit=${limit}`).then((r) => r.data);

export const createPostRequest = (formData) =>
  api
    .post("/posts", formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);

export const toggleLikeRequest = (postId) =>
  api.post(`/posts/${postId}/like`).then((r) => r.data);

export const addCommentRequest = (postId, text) =>
  api.post(`/posts/${postId}/comments`, { text }).then((r) => r.data);

export const deletePostRequest = (postId) =>
  api.delete(`/posts/${postId}`).then((r) => r.data);

export const fetchStats = () => api.get("/posts/stats").then((r) => r.data);

export const fetchTrending = () => api.get("/posts/trending").then((r) => r.data);

export const fetchRecentUsers = () => api.get("/users/recent").then((r) => r.data);
