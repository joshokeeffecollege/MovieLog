import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SearchPage from "./SearchPage";
import * as api from "../api";

// Mock the api module
vi.mock("../api");

function renderWithRouter(ui, { initialEntries = ["/search"] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/search" element={ui} />
        <Route path="/movie/:id" element={<div>Movie Details</div>} />
      </Routes>
    </MemoryRouter>
  );
}

// Reset mocks before each test
describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  // This test checks that the search form renders correctly
  it("renders search form", () => {
    renderWithRouter(<SearchPage />);

    expect(
      screen.getByPlaceholderText(/search for movies/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  // This test checks that the search button is disabled when the query is empty
  it("search button is disabled when query is empty", () => {
    renderWithRouter(<SearchPage />);

    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeDisabled();
  });

  // This test checks that the search button is enabled when the query has a value
  it("search button is enabled when query has value", async () => {
    const user = userEvent.setup();
    renderWithRouter(<SearchPage />);

    const searchInput = screen.getByPlaceholderText(/search for movies/i);
    await user.type(searchInput, "Matrix");

    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).not.toBeDisabled();
  });

  // This test checks that search submission is prevented when the query is empty or whitespace
  it("prevents search submission with empty/whitespace query", async () => {
    const user = userEvent.setup();
    api.searchMovies.mockImplementation(() => Promise.resolve([]));

    renderWithRouter(<SearchPage />);

    const searchInput = screen.getByPlaceholderText(/search for movies/i);
    await user.type(searchInput, "   ");

    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeDisabled();
    expect(api.searchMovies).not.toHaveBeenCalled();
  });

  // This test checks that the loading state is shown during search
  it("shows loading state during search", async () => {
    const user = userEvent.setup();
    api.searchMovies.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithRouter(<SearchPage />);

    const searchInput = screen.getByPlaceholderText(/search for movies/i);
    await user.type(searchInput, "Matrix");

    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    expect(await screen.findByText(/searching movies/i)).toBeInTheDocument();
  });

  // This test checks that search results are displayed correctly
  it("displays search results", async () => {
    const user = userEvent.setup();
    const mockMovies = [
      // Sample movie data
      {
        id: 1,
        title: "The Matrix",
        poster_path: "/path1.jpg",
        release_date: "1999-03-31",
        vote_average: 8.7,
      },
      {
        id: 2,
        title: "The Matrix Reloaded",
        poster_path: "/path2.jpg",
        release_date: "2003-05-15",
        vote_average: 7.2,
      },
    ];
    api.searchMovies.mockResolvedValue(mockMovies);

    renderWithRouter(<SearchPage />);

    const searchInput = screen.getByPlaceholderText(/search for movies/i);
    await user.type(searchInput, "Matrix");

    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /the matrix reloaded/i })
      ).toBeInTheDocument();
    });
  });

  // This test checks that clicking a search result navigates to the movie details page
  it("navigates to movie details when a result is clicked", async () => {
    const user = userEvent.setup();
    api.searchMovies.mockResolvedValue([
      {
        id: 1,
        title: "The Matrix",
        poster_path: "/path1.jpg",
        release_date: "1999-03-31",
        vote_average: 8.7,
      },
    ]);

    renderWithRouter(<SearchPage />);

    const searchInput = screen.getByPlaceholderText(/search for movies/i);
    await user.type(searchInput, "Matrix");

    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    const matrixCard = await screen.findByRole("button", { name: /the matrix/i });
    await user.click(matrixCard);

    expect(await screen.findByText(/movie details/i)).toBeInTheDocument();
  });

  // This test checks that the "No results found" message is shown when search returns no results
  it('shows "No results found" message when results are empty', async () => {
    const user = userEvent.setup();
    api.searchMovies.mockResolvedValue([]);

    renderWithRouter(<SearchPage />);

    const searchInput = screen.getByPlaceholderText(/search for movies/i);
    await user.type(searchInput, "NonexistentMovie123");

    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    expect(await screen.findByText(/no results found/i)).toBeInTheDocument();
  });

  // This test checks that search errors are handled and displayed correctly
  it("handles search errors", async () => {
    const user = userEvent.setup();
    api.searchMovies.mockRejectedValue(new Error("Network error"));

    renderWithRouter(<SearchPage />);

    const searchInput = screen.getByPlaceholderText(/search for movies/i);
    await user.type(searchInput, "Matrix");

    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });

});
