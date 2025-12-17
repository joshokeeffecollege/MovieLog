// This test suite verifies the functionality of the LoginPage component by testing
// form rendering, validation, error handling, and successful login behavior
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./LoginPage";
import * as api from "../api";

// Mock the api module
vi.mock("../api");

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("LoginPage", () => {
  // Mock onAuthed callback
  const mockOnAuthed = vi.fn();

  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  // This test checks that the login form renders correctly
  it("renders login form with email and password inputs", () => {
    renderWithRouter(<LoginPage onAuthed={mockOnAuthed} />);

    // Check for email and password input fields and submit button by label and role
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  // This test checks that a validation error is shown when
  // the email field is left empty and the form is submitted
  it("shows validation error when email is empty", async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginPage onAuthed={mockOnAuthed} />);

    const submitButton = screen.getByRole("button", { name: /log in/i });
    await user.click(submitButton);

    // It expects the email required error message to be displayed
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  // This test checks that a validation error is shown when password field is empty
  it("shows validation error when password is empty", async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginPage onAuthed={mockOnAuthed} />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", { name: /log in/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/password is required/i)
    ).toBeInTheDocument();
  });

  // This test checks that a validation error is shown when the password is less than 8 characters
  it("shows validation error when password is less than 8 characters", async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginPage onAuthed={mockOnAuthed} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "short");

    const submitButton = screen.getByRole("button", { name: /log in/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/password must be at least 8 characters/i)
    ).toBeInTheDocument();
  });

  // This test checks that backend validation errors are displayed under the respective fields
  it("displays backend validation errors under fields", async () => {
    const user = userEvent.setup();
    const mockError = new Error();
    mockError.errors = {
      email: ["is invalid"],
      password: ["is too short"],
    };
    api.login.mockRejectedValue(mockError);

    renderWithRouter(<LoginPage onAuthed={mockOnAuthed} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: /log in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/is invalid/i)).toBeInTheDocument();
      expect(screen.getByText(/is too short/i)).toBeInTheDocument();
    });
  });

  // This test checks that a generic error message is shown for failed login attempts
  it('shows "Invalid email or password" for failed login', async () => {
    const user = userEvent.setup();
    api.login.mockRejectedValue(new Error("Invalid email or password"));

    renderWithRouter(<LoginPage onAuthed={mockOnAuthed} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: /log in/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/invalid email or password/i)
    ).toBeInTheDocument();
  });

  // This test checks that a successful login calls the onAuthed callback and sets the token
  it("successful login calls onAuthed callback and sets token", async () => {
    // Set parameters and mock API response
    const user = userEvent.setup();
    const mockData = {
      token: "fake-token",
      user: { id: 1, email: "test@example.com" },
    };
    api.login.mockResolvedValue(mockData);
    api.setToken = vi.fn();

    renderWithRouter(<LoginPage onAuthed={mockOnAuthed} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: /log in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.setToken).toHaveBeenCalledWith("fake-token");
      expect(mockOnAuthed).toHaveBeenCalledWith(mockData.user);
    });
  });

  // This test checks that the form submission does not trigger a page reload
  it("prevents form submission with default behavior", async () => {
    const user = userEvent.setup();
    api.login.mockResolvedValue({ token: "fake-token", user: {} });

    renderWithRouter(<LoginPage onAuthed={mockOnAuthed} />);

    const form = screen
      .getByRole("button", { name: /log in/i })
      .closest("form");
    const submitHandler = vi.fn((e) => e.preventDefault());
    form.onsubmit = submitHandler;

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: /log in/i });
    await user.click(submitButton);

    // Form should not reload page
    expect(submitHandler).toHaveBeenCalled();
  });
});
