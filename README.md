# CineSearch: Movie Search App

A movie search app built with HTML, CSS and vanilla JavaScript. Search movies from the TMDB database, view details and save favorites. No frameworks, no build step.

## Features

- Popular movies on the home screen
- Live search with debounce (waits until you stop typing)
- Movie details popup: poster, year, runtime, rating, genres, overview
- Favorites list saved in the browser (localStorage)
- Demo mode with sample movies when no API key is added
- Loading and error messages
- Responsive grid, light and dark theme (follows system setting)

## Tech Stack

- HTML5
- CSS3 (Grid, Flexbox, CSS variables)
- Vanilla JavaScript (ES6, `fetch`, async/await, `<dialog>`, localStorage)
- [TMDB API](https://www.themoviedb.org/)

## Setup

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/) and get an API key (v3) from Settings → API.
2. Open `index.html` in your browser.
3. Paste the key in the yellow box and click Save.

The key is stored only in your own browser. Do not hard-code it in the file before uploading to GitHub.

## Future Improvements

- Pagination or infinite scroll
- Filter by genre and year
- Trailers
- Rebuild in React

## Credits

This product uses the TMDB API but is not endorsed or certified by TMDB.

## License

MIT
