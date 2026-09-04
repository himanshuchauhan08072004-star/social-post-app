import { useState } from "react";
import { Box, Paper, TextField, Button, Typography, Alert, Link as MLink } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signup(form);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
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
          Create an account to start posting.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField name="name" label="Name" value={form.name} onChange={handleChange} fullWidth />
          <TextField name="email" label="Email" type="email" value={form.email} onChange={handleChange} fullWidth />
          <TextField name="password" label="Password" type="password" value={form.password} onChange={handleChange} fullWidth />
          <TextField name="confirmPassword" label="Confirm Password" type="password" value={form.confirmPassword} onChange={handleChange} fullWidth />
          <Button type="submit" variant="contained" size="large" disabled={submitting} className="post-btn">
            {submitting ? "Creating account..." : "Sign Up"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
          Already have an account?{" "}
          <MLink component={Link} to="/login">Log in</MLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Signup;
