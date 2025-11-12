# 🎬 MovieLog

MovieLog is a simple Ruby on Rails web app that lets you **search for movies**, **add them to your personal library**, and **view details like director, cast, and runtime** using data pulled from [The Movie Database (TMDB)](https://www.themoviedb.org/) API.

---

## Features
- **Search** for movies via TMDB API
- **Add** and **Remove** movies from your library
- **View movie details** (title, release year, overview, director, runtime, cast)
- Stores movie data locally in a MySQL database
- Built with Rails scaffolds, Active Record, and Bootstrap for styling
- Includes basic system and model tests

---

## Tech Stack

- **Ruby on Rails 7.x**
- **MySQL** (local development database)
- **HTTParty** for API calls
- **Bootstrap 5** for styling
- **Dotenv-rails** for environment variables
- **TMDB API** for movie data

---

## Setup Instructions
### 1. Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/MovieLog.git
cd MovieLog
```

### 2. Install dependencies
```bash
bundle install
```

### 3. Set up environment variables
Create a .env file in the project root
```bash
touch .env
```

Add your TMDB API key:
```bash
echo 'TMDB_API_KEY=your_tmdb_key_here' >> .env
```

Git Ignore .env
```bash
echo '/.env' >> .gitignore
```

### 4. Set up the database

Make sure MySQL is running, then:
```bash
rails db:create db:migrate
```

### 5. Run the app
```bash
bin/rails server
```
Open your browser at http://127.0.0.1:3000