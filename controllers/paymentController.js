import stripe from '../utils/stripe.js';
import Reservation from '../models/reservation.js';
import Showtime from '../models/showtime.js';

const createPaymentIntent = async (req, res) => {
  const { showtimeId, seats } = req.body;
  const userId = req.user.id;

  try {
    const showtime = await Showtime.findByPk(showtimeId);
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });

    // Check available seats
    const totalReservedSeats = await Reservation.sum('seats', { where: { showtimeId } });
    const availableSeats = showtime.capacity - totalReservedSeats;
    if (seats > availableSeats) return res.status(400).json({ message: 'Not enough available seats' });

    const amount = seats * 1000; // Assuming $10 per seat,
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      metadata: { userId, showtimeId, seats },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Payment failed', error });
  }
};

export { createPaymentIntent };
