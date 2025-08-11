import express from 'express';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import { createMovie, getMovies, updateMovie, deleteMovie } from '../controllers/movieController.js';
import { createShowtime, getShowtimes } from '../controllers/showtimeController.js';

const router = express.Router();

// Movie routes
router.post('/', verifyToken, isAdmin, createMovie);
router.get('/', getMovies);
router.put('/:movieId', verifyToken, isAdmin, updateMovie);
router.delete('/:movieId', verifyToken, isAdmin, deleteMovie);

// Showtime routes
router.post('/:movieId/showtimes', verifyToken, isAdmin, createShowtime);
router.get('/:movieId/showtimes', getShowtimes);

export default router;
