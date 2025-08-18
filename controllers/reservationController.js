
import { sum, create, findAll, findOne } from '../models/reservation.js';
import Showtime, { findByPk } from '../models/showtime.js';
import User from '../models/user.js';

// Create a reservation (Regular User)
const createReservation = async (req, res) => {
  const { showtimeId, seats } = req.body;
  const userId = req.user.id;

  try {
    // Check if showtime exists
    const showtime = await findByPk(showtimeId);

    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Check if there are enough available seats
    const totalReservedSeats = await sum('seats', {
      where: { showtimeId },
    });
    const availableSeats = showtime.capacity - totalReservedSeats;

    if (seats > availableSeats) {
      return res.status(400).json({ message: 'Not enough available seats' });
    }

    // Create the reservation
    const reservation = await create({
      userId,
      showtimeId,
      seats,
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating reservation', error });
  }
};

// Get all reservations for a user
const getUserReservations = async (req, res) => {
  const userId = req.user.id;
  try {
    const reservation = await findAll({
      where: { userId },
      include: Showtime,
    });

    res.status(200).json(reservation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching reservations', error });
  }
};

// Get all reservations for a specific showtime (Admin only)
const getShowtimeReservations = async (req, res) => {
  const { showtimeId } = req.params;

  try {
    const reservations = await findAll({
      where: { showtimeId },
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Showtime, attributes: ['id', 'capacity', 'date', 'time'] },
      ],
    });

    const totalSeatsReserved = await sum('seats', {
      where: { showtimeId },
    });

    res.status(200).json({
      reservations,
      totalSeatsReserved,
      capacity: reservations[0]?.Showtime.capacity,
      revenue: totalSeatsReserved * 10, // Assuming each seat costs $10
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching reservations', error });
  }
};

// Cancel a reservation (Regular User)
const cancelReservation = async (req, res) => {
  const { reservationId } = req.params;
  const userId = req.user.id;

  try {
    // Find the reservation
    const reservation = await findOne({
      where: { id: reservationId, userId },
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    // Only allow cancellation for upcoming showtimes
    const showtime = await findByPk(reservation.showtimeId);

    if (new Date(showtime.date) <= new Date()) {
      return res
        .status(400)
        .json({ message: 'Cannot cancel past or ongoing reservations.' });
    }

    // Delete the reservation
    await reservation.destroy();

    res.status(200).json({ message: 'Reservation cancelled' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error canceling reservation', error });
  }
};

export {
  createReservation,
  getUserReservations,
  getShowtimeReservations,
  cancelReservation,
};
