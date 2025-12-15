import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchPage from './SearchPage'
import * as api from '../api'

vi.mock('../api')

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search form', () => {
    render(<SearchPage />)

    expect(screen.getByPlaceholderText(/search for movies/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  it('search button is disabled when query is empty', () => {
    render(<SearchPage />)

    const searchButton = screen.getByRole('button', { name: /search/i })
    expect(searchButton).toBeDisabled()
  })

  it('search button is enabled when query has value', async () => {
    const user = userEvent.setup()
    render(<SearchPage />)

    const searchInput = screen.getByPlaceholderText(/search for movies/i)
    await user.type(searchInput, 'Matrix')

    const searchButton = screen.getByRole('button', { name: /search/i })
    expect(searchButton).not.toBeDisabled()
  })

  it('prevents search submission with empty/whitespace query', async () => {
    const user = userEvent.setup()
    api.searchMovies = vi.fn()

    render(<SearchPage />)

    const searchInput = screen.getByPlaceholderText(/search for movies/i)
    await user.type(searchInput, '   ')

    const searchButton = screen.getByRole('button', { name: /search/i })
    expect(searchButton).toBeDisabled()
    expect(api.searchMovies).not.toHaveBeenCalled()
  })

  it('shows loading state during search', async () => {
    const user = userEvent.setup()
    api.searchMovies = vi.fn(() => new Promise(() => {})) // Never resolves

    render(<SearchPage />)

    const searchInput = screen.getByPlaceholderText(/search for movies/i)
    await user.type(searchInput, 'Matrix')

    const searchButton = screen.getByRole('button', { name: /search/i })
    await user.click(searchButton)

    expect(await screen.findByText(/searching/i)).toBeInTheDocument()
  })

  it('displays search results', async () => {
    const user = userEvent.setup()
    const mockMovies = [
      { id: 1, title: 'The Matrix', poster_path: '/path1.jpg', release_date: '1999-03-31', vote_average: 8.7 },
      { id: 2, title: 'The Matrix Reloaded', poster_path: '/path2.jpg', release_date: '2003-05-15', vote_average: 7.2 }
    ]
    api.searchMovies.mockResolvedValue(mockMovies)

    render(<SearchPage />)

    const searchInput = screen.getByPlaceholderText(/search for movies/i)
    await user.type(searchInput, 'Matrix')

    const searchButton = screen.getByRole('button', { name: /search/i })
    await user.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText(/the matrix reloaded/i)).toBeInTheDocument()
    })
  })

  it('shows "No results found" message when results are empty', async () => {
    const user = userEvent.setup()
    api.searchMovies.mockResolvedValue([])

    render(<SearchPage />)

    const searchInput = screen.getByPlaceholderText(/search for movies/i)
    await user.type(searchInput, 'NonexistentMovie123')

    const searchButton = screen.getByRole('button', { name: /search/i })
    await user.click(searchButton)

    expect(await screen.findByText(/no results found/i)).toBeInTheDocument()
  })

  it('handles search errors', async () => {
    const user = userEvent.setup()
    api.searchMovies.mockRejectedValue(new Error('Network error'))

    render(<SearchPage />)

    const searchInput = screen.getByPlaceholderText(/search for movies/i)
    await user.type(searchInput, 'Matrix')

    const searchButton = screen.getByRole('button', { name: /search/i })
    await user.click(searchButton)

    expect(await screen.findByText(/network error/i)).toBeInTheDocument()
  })

  it('shows "Please log in" message when adding movie while unauthenticated', async () => {
    const user = userEvent.setup()
    const mockMovies = [
      { id: 1, title: 'The Matrix', poster_path: '/path1.jpg', release_date: '1999-03-31', vote_average: 8.7 }
    ]
    api.searchMovies.mockResolvedValue(mockMovies)
    api.addToCollection.mockRejectedValue(new Error('Invalid email or password'))

    render(<SearchPage />)

    const searchInput = screen.getByPlaceholderText(/search for movies/i)
    await user.type(searchInput, 'Matrix')

    const searchButton = screen.getByRole('button', { name: /search/i })
    await user.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText(/the matrix/i)).toBeInTheDocument()
    })

    const addButton = screen.getByRole('button', { name: /add/i })
    await user.click(addButton)

    expect(await screen.findByText(/you must be logged in to add movies/i)).toBeInTheDocument()
  })

  it('shows "already in collection" info for duplicate movies', async () => {
    const user = userEvent.setup()
    const mockMovies = [
      { id: 1, title: 'The Matrix', poster_path: '/path1.jpg', release_date: '1999-03-31', vote_average: 8.7 }
    ]
    api.searchMovies.mockResolvedValue(mockMovies)
    api.addToCollection.mockRejectedValue(new Error('has already been taken'))

    render(<SearchPage />)

    const searchInput = screen.getByPlaceholderText(/search for movies/i)
    await user.type(searchInput, 'Matrix')

    const searchButton = screen.getByRole('button', { name: /search/i })
    await user.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText(/the matrix/i)).toBeInTheDocument()
    })

    const addButton = screen.getByRole('button', { name: /add/i })
    await user.click(addButton)

    expect(await screen.findByText(/the matrix is already in your collection/i)).toBeInTheDocument()
  })

  it('successfully adds movie to collection', async () => {
    const user = userEvent.setup()
    const mockMovies = [
      { id: 1, title: 'The Matrix', poster_path: '/path1.jpg', release_date: '1999-03-31', vote_average: 8.7 }
    ]
    api.searchMovies.mockResolvedValue(mockMovies)
    api.addToCollection.mockResolvedValue({})

    render(<SearchPage />)

    const searchInput = screen.getByPlaceholderText(/search for movies/i)
    await user.type(searchInput, 'Matrix')

    const searchButton = screen.getByRole('button', { name: /search/i })
    await user.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText(/the matrix/i)).toBeInTheDocument()
    })

    const addButton = screen.getByRole('button', { name: /add/i })
    await user.click(addButton)

    expect(await screen.findByText(/added: the matrix/i)).toBeInTheDocument()
    expect(api.addToCollection).toHaveBeenCalledWith({
      tmdb_id: 1,
      title: 'The Matrix',
      poster_path: '/path1.jpg',
      release_date: '1999-03-31',
      vote_average: 8.7
    })
  })
})
