import client from '../utils/redisClient.js';
import { create, findAll, findByPk } from '../models/movie.js';

// Create a new movie (Admin only)
const createMovie = async (req, res) => {
  const { title, description, genre, posterImage } = req.body;

  try {
    const movie = await create({
      title,
      description,
      genre,
      posterImage,
    });
    
    // Update Redis cache 
    const cachedMovies = await client.get('movies');
    if (cachedMovies) {
      const moviesArr = JSON.parse(cachedMovies);
      moviesArr.push(movie);
      await client.setEx('movies', 3600, JSON.stringify(moviesArr));
    }

    res.status(201).json(movie);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating movie', error });
  }
};

// Get all movies
const getMovies = async (req, res) => {
  try {
    const cachedMovies = await client.get('movies');
    if (cachedMovies) {
      return res.status(200).json(JSON.parse(cachedMovies));
    }
    const movies = await findAll();

    await client.setEx('movies', 3600, JSON.stringify(movies));

    res.status(200).json(movies);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching movies', error });
  }
};

// Update a movie (Admin only)
const updateMovie = async (req, res) => {
  const { movieId } = req.params;
  const { title, description, genre, posterImage } = req.body;

  try {
    const movie = await findByPk(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found.' });
    }

    await movie.update({ title, description, genre, posterImage });
    
    // update the movie in cache 
    const cachedMovies = await client.get('movies');
    if (cachedMovies) {
      let moviesArr = JSON.parse(cachedMovies);
      moviesArr = moviesArr.map(m => (m.id === movie.id ? movie : m));
      await client.setEx('movies', 3600, JSON.stringify(moviesArr));
    }    
    res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating movie', error });
  }
};

// Delete a movie (Admin only)
const deleteMovie = async (req, res) => {
  const { movieId } = req.params;

  try {
    const movie = await findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    await movie.destroy();

    // delete movie in cache 
    const cachedMovies = await client.get('movies');
    if (cachedMovies) {
      let moviesArr = JSON.parse(cachedMovies);
      moviesArr = moviesArr.filter(m => m.id !== movie.id);
      await client.setEx('movies', 3600, JSON.stringify(moviesArr));
    }

    res.status(200).json({ message: 'Movie deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error deleting movie', error });
  }
};

export default {
  createMovie,
  getMovies,
  updateMovie,
  deleteMovie,
};
