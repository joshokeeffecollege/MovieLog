import { useState } from "react";
import { login, setToken } from "../api";

export default function LoginPage({ onAuthed }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // validate form
  function validateForm() {
    const errors = {};

    // validate email
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Email is invalid";
    }

    // validate password
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // handle form submission
  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    // validate form before submitting
    if (!validateForm()) {
      return;
    }

    // submit login request
    try {
      const data = await login(email, password);
      setToken(data.token);
      onAuthed?.(data.user);
    } catch (err) {
      // handle backend errors
      if (err.errors) {
        const errors = {};

        // map backend validation errors
        if (err.errors.email) {
          errors.email = err.errors.email.join(", ");
        }
        if (err.errors.password) {
          errors.password = err.errors.password.join(", ");
        }
        setValidationErrors(errors);
      } else {
        setError(err.message || "Invalid email or password");
      }
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

        {/* login form */}
        <form onSubmit={onSubmit} className="d-grid gap-3">
          <div>
            <label htmlFor="email" className="form-label">Email</label>

            {/* email input with validation */}
            <input
              id="email"
              className={`form-control ${
                validationErrors.email ? "is-invalid" : ""
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            {validationErrors.email && (
              <div className="invalid-feedback d-block">
                {validationErrors.email}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="password" className="form-label">Password</label>

            {/* password input with validations */}
            <input
              id="password"
              type="password"
              className={`form-control ${
                validationErrors.password ? "is-invalid" : ""
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {validationErrors.password && (
              <div className="invalid-feedback d-block">
                {validationErrors.password}
              </div>
            )}
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
