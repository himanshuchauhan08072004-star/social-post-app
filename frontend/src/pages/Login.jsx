import { useState } from "react";
import { Box, Paper, TextField, Button, Typography, Alert, Link as MLink } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in both fields.");
      return;
    }
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="auth-page">
      <Paper className="auth-card">
        <Box className="auth-logo">
          <svg className="brand-mark" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M14 3a11 11 0 1 0 11 11" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="14" cy="3" r="2.4" fill="currentColor" />
          </svg>
          <Typography variant="h5" className="brand-name">Loop</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Welcome back. Log in to see what's new.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField name="email" label="Email" type="email" value={form.email} onChange={handleChange} fullWidth />
          <TextField name="password" label="Password" type="password" value={form.password} onChange={handleChange} fullWidth />
          <Button type="submit" variant="contained" size="large" disabled={submitting} className="post-btn">
            {submitting ? "Logging in..." : "Log In"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
          Don't have an account?{" "}
          <MLink component={Link} to="/signup">Sign up</MLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
