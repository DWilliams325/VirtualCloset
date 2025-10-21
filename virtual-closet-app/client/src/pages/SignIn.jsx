// src/pages/SignIn.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/SignIn.css";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = (location.state && location.state.from) || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        let msg = "Sign-in failed. Check your credentials.";
        try {
          const data = await res.json();
          if (data && data.message) msg = data.message;
        } catch {}
        throw new Error(msg);
      }
      const data = await res.json(); // expect { token, user }
      const storage = remember ? window.localStorage : window.sessionStorage;
      storage.setItem("vc_token", data.token);
      storage.setItem("vc_user", JSON.stringify(data.user));
      navigate(from || "/browse", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signin-wrapper">
      <main className="signin-card">
        <h1 className="signin-title">Sign in to Virtual Closet</h1>
        <p className="signin-sub">Welcome back! Enter your credentials to continue.</p>

        {error && (
          <div role="alert" className="signin-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="signin-form" noValidate>
          <div className="field">
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@pfw.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              aria-invalid={!!error && !email}
            />
          </div>

          <div className="field">
            <label htmlFor="password" className="label">Password</label>
            <div className="password-row">
              <input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input with-toggle"
                aria-invalid={!!error && !password}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="show-btn"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="row-between">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="checkbox"
              />
              Remember me
            </label>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="link-btn"
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="meta">
          Don’t have an account?{" "}
          <button type="button" onClick={() => navigate("/signup")} className="link-btn">
            Create one
          </button>
        </p>
      </main>
    </div>
  );
}
