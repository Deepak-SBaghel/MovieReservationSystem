
import { sum, create, findAll, findOne } from '../models/reservation.js';
import Showtime, { findByPk } from '../models/showtime.js';
import User from '../models/user.js';
import sequelize from '../models/index.js';

const createReservation = async (req, res) => {
  const { paymentIntentId } = req.body;
  const userId = req.user.id;
  // Start trans
  const transaction = await sequelize.transaction();

  try {
    // payment part
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (!paymentIntent || paymentIntent.status !== 'succeeded') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Payment not completed yet' });
    }

    const { showtimeId, seats } = JSON.parse(paymentIntent.metadata);

    // chech if seat available . 
    const showtime = await findByPk(showtimeId, {
      lock: transaction.LOCK.UPDATE,
      transaction
    });

    if (!showtime) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Showtime not found' });
    }

    const totalReservedSeats = await sum('seats', {
      where: { showtimeId },
      transaction
    });
    const availableSeats = showtime.capacity - totalReservedSeats;

    if (seats >  availableSeats) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Not enough seats' });
    }

    const reservation = await create(
      { userId, showtimeId, seats },
      { transaction }
    );
    await transaction.commit();

    res.status(201).json(reservation);
  } catch (error) {
    await transaction.rollback();
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
