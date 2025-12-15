import { useState } from "react";
import { login, setToken } from "../api";

export default function LoginPage({ onAuthed }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);
      setToken(data.token);
      onAuthed?.(data.user);
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div className="w-100 p-4 p-md-5">
      <div
        className="card border-0 shadow-sm p-4"
        style={{ maxWidth: 520, margin: "0 auto" }}
      >
        <h1 className="h4 mb-3">Log in</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={onSubmit} className="d-grid gap-3">
          <div>
            <label className="form-label">Email</label>
            <input
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary">Log in</button>
          <div className="text-muted sm">
            Don't have an account? <a href="/signup">Sign up</a>
          </div>
        </form>
      </div>
    </div>
  );
}
