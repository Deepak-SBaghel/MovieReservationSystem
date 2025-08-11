
import { findByPk } from '../models/movie.js';
import { create, findAll } from '../models/showtime.js';

// Create a showtime for a movie (Admin only)
const createShowtime = async (req, res) => {
  const { movieId } = req.params;
  const { date, time, capacity } = req.body;

  try {
    const movie = await findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const showtime = await create({
      movieId,
      date,
      time,
      capacity,
    });

    res.status(201).json(showtime);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating showtime', error });
  }
};

// Get all showtimes for a specific movie
const getShowtimes = async (req, res) => {
  const { movieId } = req.params;

  try {
    const showtimes = await findAll({ where: { movieId } });
    res.status(200).json(showtimes);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching showtimes', error });
  }
};

export default { createShowtime, getShowtimes };
