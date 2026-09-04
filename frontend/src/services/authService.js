import api from "./api";

export const signupRequest = (data) => api.post("/auth/signup", data).then((r) => r.data);
export const loginRequest = (data) => api.post("/auth/login", data).then((r) => r.data);
export const meRequest = () => api.get("/auth/me").then((r) => r.data);
