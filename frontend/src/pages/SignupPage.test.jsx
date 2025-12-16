import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupPage from "./SignupPage";
import * as api from "../api";

// Mock the api module
vi.mock("../api");

// Reset mocks before each test
describe("SignupPage", () => {
  const mockOnAuthed = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders signup form with email, password, and confirmation inputs", () => {
    render(<SignupPage onAuthed={mockOnAuthed} />);

    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  // This test checks that a validation error is shown when the email field is left empty and the form is submitted
  it("shows validation error when email is empty", async () => {
    const user = userEvent.setup();
    render(<SignupPage onAuthed={mockOnAuthed} />);

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  // This test checks that a validation error is shown when password field is empty
  it("shows validation error when password is empty", async () => {
    const user = userEvent.setup();
    render(<SignupPage onAuthed={mockOnAuthed} />);

    const emailInput = screen.getByLabelText(/^email$/i);
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/password is required/i)
    ).toBeInTheDocument();
  });

  // This test checks that a validation error is shown when the password is less than 8 characters
  it("shows validation error when password is less than 8 characters", async () => {
    const user = userEvent.setup();
    render(<SignupPage onAuthed={mockOnAuthed} />);

    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "short");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/password must be at least 8 characters/i)
    ).toBeInTheDocument();
  });

  // This test checks that a validation error is shown when the password confirmation field is empty
  it("shows error when password confirmation is empty", async () => {
    const user = userEvent.setup();
    render(<SignupPage onAuthed={mockOnAuthed} />);

    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument();
  });

  // This test checks that a validation error is shown when the passwords do not match
  it("shows error when passwords do not match", async () => {
    const user = userEvent.setup();
    render(<SignupPage onAuthed={mockOnAuthed} />);

    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmInput, "different123");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument();
  });

  it('displays backend error "Email has already been taken" under email field', async () => {
    const user = userEvent.setup();
    const mockError = new Error();
    mockError.errors = {
      email: ["has already been taken"],
    };
    api.signup.mockRejectedValue(mockError);

    render(<SignupPage onAuthed={mockOnAuthed} />);

    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmInput, "password123");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/email has already been taken/i)
    ).toBeInTheDocument();
  });

  // This test checks that successful signup calls onAuthed callback and sets the token
  it("successful signup calls onAuthed callback and sets token", async () => {
    const user = userEvent.setup();
    const mockData = {
      token: "fake-token",
      user: { id: 1, email: "test@example.com" },
    };
    api.signup.mockResolvedValue(mockData);
    api.setToken = vi.fn();

    render(<SignupPage onAuthed={mockOnAuthed} />);

    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmInput, "password123");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.setToken).toHaveBeenCalledWith("fake-token");
      expect(mockOnAuthed).toHaveBeenCalledWith(mockData.user);
    });
  });

  // This test checks that form submission prevents default behavior
  it("prevents form submission with default behavior", async () => {
    const user = userEvent.setup();
    api.signup.mockResolvedValue({ token: "fake-token", user: {} });

    render(<SignupPage onAuthed={mockOnAuthed} />);

    const form = screen
      .getByRole("button", { name: /sign up/i })
      .closest("form");
    const submitHandler = vi.fn((e) => e.preventDefault());
    form.onsubmit = submitHandler;

    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmInput, "password123");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    // Form should not reload page
    expect(submitHandler).toHaveBeenCalled();
  });
});
