import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import User from "./user.js";
import Showtime from "./showtime.js";

const Reservation = sequelize.define(
  "Reservation",
  {
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: true }
);

// Define relationships: Reservation belongs to User and Showtime
Reservation.belongsTo(User, { foreignKey: "userId" });
Reservation.belongsTo(Showtime, { foreignKey: "showtimeId" });

// User has many reservations
User.hasMany(Reservation, { foreignKey: "userId" });

// Showtime has many reservations
Showtime.hasMany(Reservation, { foreignKey: "showtimeId" });

const sum = (...args) => Reservation.sum(...args);
const create = (...args) => Reservation.create(...args);
const findAll = (...args) => Reservation.findAll(...args);
const findOne = (...args) => Reservation.findOne(...args);
const findByPk = (...args) => Reservation.creafondByPk(...args);

export { sum, create, findAll, findOne, findByPk };
export default Reservation;
