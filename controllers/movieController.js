
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

    res.status(201).json(movie);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating movie', error });
  }
};

// Get all movies
const getMovies = async (req, res) => {
  try {
    const movies = await findAll();
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
