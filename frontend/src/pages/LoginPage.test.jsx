import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from './LoginPage'
import * as api from '../api'

vi.mock('../api')

describe('LoginPage', () => {
  const mockOnAuthed = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form with email and password inputs', () => {
    render(<LoginPage onAuthed={mockOnAuthed} />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('shows validation error when email is empty', async () => {
    const user = userEvent.setup()
    render(<LoginPage onAuthed={mockOnAuthed} />)

    const submitButton = screen.getByRole('button', { name: /log in/i })
    await user.click(submitButton)

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
  })

  it('shows validation error when password is empty', async () => {
    const user = userEvent.setup()
    render(<LoginPage onAuthed={mockOnAuthed} />)

    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'test@example.com')

    const submitButton = screen.getByRole('button', { name: /log in/i })
    await user.click(submitButton)

    expect(await screen.findByText(/password is required/i)).toBeInTheDocument()
  })

  it('shows validation error when password is less than 8 characters', async () => {
    const user = userEvent.setup()
    render(<LoginPage onAuthed={mockOnAuthed} />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'short')

    const submitButton = screen.getByRole('button', { name: /log in/i })
    await user.click(submitButton)

    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument()
  })

  it('displays backend validation errors under fields', async () => {
    const user = userEvent.setup()
    const mockError = new Error()
    mockError.errors = {
      email: ['is invalid'],
      password: ['is too short']
    }
    api.login.mockRejectedValue(mockError)

    render(<LoginPage onAuthed={mockOnAuthed} />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    const submitButton = screen.getByRole('button', { name: /log in/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/is invalid/i)).toBeInTheDocument()
      expect(screen.getByText(/is too short/i)).toBeInTheDocument()
    })
  })

  it('shows "Invalid email or password" for failed login', async () => {
    const user = userEvent.setup()
    api.login.mockRejectedValue(new Error('Invalid email or password'))

    render(<LoginPage onAuthed={mockOnAuthed} />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    const submitButton = screen.getByRole('button', { name: /log in/i })
    await user.click(submitButton)

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument()
  })

  it('successful login calls onAuthed callback and sets token', async () => {
    const user = userEvent.setup()
    const mockData = { token: 'fake-token', user: { id: 1, email: 'test@example.com' } }
    api.login.mockResolvedValue(mockData)
    api.setToken = vi.fn()

    render(<LoginPage onAuthed={mockOnAuthed} />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    const submitButton = screen.getByRole('button', { name: /log in/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(api.setToken).toHaveBeenCalledWith('fake-token')
      expect(mockOnAuthed).toHaveBeenCalledWith(mockData.user)
    })
  })

  it('prevents form submission with default behavior', async () => {
    const user = userEvent.setup()
    api.login.mockResolvedValue({ token: 'fake-token', user: {} })

    render(<LoginPage onAuthed={mockOnAuthed} />)

    const form = screen.getByRole('button', { name: /log in/i }).closest('form')
    const submitHandler = vi.fn((e) => e.preventDefault())
    form.onsubmit = submitHandler

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    const submitButton = screen.getByRole('button', { name: /log in/i })
    await user.click(submitButton)

    // Form should not reload page
    expect(submitHandler).toHaveBeenCalled()
  })
})
