import { useState } from "react";
import { signup, setToken } from "../api";

export default function SignupPage({ onAuthed }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await signup(email, password, passwordConfirmation);
      setToken(data.token);
      onAuthed?.(data.user);
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  }

  return (
    <div className="w-100 p-4 p-md-5">
      <div
        className="card border-0 shadow-sm p-4"
        style={{ maxWidth: 520, margin: "0 auto" }}
      >
        <h1 className="h4 mb-3">Create account</h1>
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
          <div>
            <label className="form-label">Confirm password</label>
            <input
              type="password"
              className="form-control"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>
          <button className="btn btn-primary">Sign up</button>
          <div className="text-muted sm">
            Already have an account? <a href="/login">Log in</a>
          </div>
        </form>
      </div>
    </div>
  );
}
