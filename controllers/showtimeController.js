import client from "../utils/redisClient.js";
import { findByPk } from "../models/movie.js";
import { create, findAll } from "../models/showtime.js";

// Create a showtime for a movie (Admin only)
const createShowtime = async (req, res) => {
  const { movieId } = req.params;
  const { date, time, capacity } = req.body;

  try {
    const movie = await findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const showtime = await create({
      movieId,
      date,
      time,
      capacity,
    });

    // add the showtime in cache 
    const cacheKey = `showtimes:${movieId}`;
    const cachedShowtimes = await client.get(cacheKey);
    // cacheKey is used to verify if movie exist or not 
    if (cachedShowtimes) {
      const showtimesArr = JSON.parse(cachedShowtimes);
      showtimesArr.push(showtime);
      await client.setEx(cacheKey, 1800, JSON.stringify(showtimesArr));
    }

    res.status(201).json(showtime);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating showtime", error });
  }
};

// Get all showtimes for a specific movie
const getShowtimes = async (req, res) => {
  const { movieId } = req.params;

  try {
    const cacheKey = `showtimes:${movieId}`;
    const cachedShowtimes = await client.get(cacheKey);
    if (cachedShowtimes) {
      return res.status(200).json(JSON.parse(cachedShowtimes));
    }
    const showtimes = await findAll({ where: { movieId } });
    await client.setEx(cacheKey, 1800, JSON.stringify(showtimes));

    res.status(200).json(showtimes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching showtimes", error });
  }
};

export default { createShowtime, getShowtimes };
