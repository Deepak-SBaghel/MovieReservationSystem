import express from 'express';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import { 
  createReservation, 
  getUserReservations, 
  cancelReservation, 
  getShowtimeReservations 
} from '../controllers/reservationController.js';

const router = express.Router();

// Regular user routes
router.post('/', verifyToken, createReservation);
router.get('/my-reservations', verifyToken, getUserReservations);
router.delete('/:reservationId', verifyToken, cancelReservation);

// Admin route
router.get(
  '/showtime/:showtimeId',
  verifyToken,
  isAdmin,
  getShowtimeReservations
);

export default router;
