import { useState } from "react";
import { signup, setToken } from "../api";

export default function SignupPage({ onAuthed }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
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

    // validate password confirmation
    if (!passwordConfirmation) {
      errors.passwordConfirmation = "Passwords do not match";
    } else if (password != passwordConfirmation) {
      errors.passwordConfirmation = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    // validate form before submitting
    if (!validateForm()) {
      return;
    }

    // submit signup request
    try {
      const data = await signup(email, password, passwordConfirmation);
      setToken(data.token);
      onAuthed?.(data.user);
    } catch (err) {
      // handle backend errors
      if (err.errors) {
        const errors = {};

        // map backend validation errors
        if (err.errors.email) {
          errors.email = `Email ${err.errors.email[0]}`;
        }

        if (err.errors.password) {
          errors.password = `Password ${err.errors.password[0]}`;
        }

        setValidationErrors(errors);
      } else {
        // general error
        setError(err.message || "Signup failed");
      }
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
            {/* email */}
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* validate email */}
            {validationErrors.email && (
              <div className="invalid-feedback d-block">
                {validationErrors.email}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* validate password */}
            {validationErrors.password && (
              <div className="invalid-feedback d-block">
                {validationErrors.password}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="passwordConfirmation" className="form-label">Confirm password</label>
            <input
              id="passwordConfirmation"
              type="password"
              className="form-control"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            {/* password confirmation validation */}
            {validationErrors.passwordConfirmation && (
              <div className="invalid-feedback d-block">
                {validationErrors.passwordConfirmation}
              </div>
            )}
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
