
import { sum, create, findAll, findOne } from '../models/reservation.js';
import Showtime, { findByPk } from '../models/showtime.js';
import User from '../models/user.js';

const createReservation = async (req, res) => {
  const { paymentIntentId } = req.body;
  const userId = req.user.id;

  try {
    // payment part
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    const { showtimeId, seats } = JSON.parse(paymentIntent.metadata);

    // chech if seat available . 
    const showtime = await Showtime.findByPk(showtimeId);
    const totalReservedSeats = await sum('seats', { where: { showtimeId } });
    const availableSeats = showtime.capacity - totalReservedSeats;

    if (seats > availableSeats) return res.status(400).json({ message: 'Not enough seats' });

    const reservation = await create({ userId, showtimeId, seats });

    res.status(201).json(reservation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Reservation failed', error });
  }
};


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

// (Admin only)
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

// (Regular User)
const cancelReservation = async (req, res) => {
  const { reservationId } = req.params;
  const userId = req.user.id;

  try {
    const reservation = await findOne({
      where: { id: reservationId, userId },
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }
    const showtime = await findByPk(reservation.showtimeId);

    if (new Date(showtime.date) <= new Date()) {
      return res
        .status(400)
        .json({ message: 'Cannot cancel past or ongoing reservations.' });
    }

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
