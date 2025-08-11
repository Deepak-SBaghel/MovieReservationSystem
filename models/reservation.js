import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User, { hasMany } from './user.js';
import Showtime, { hasMany as _hasMany } from './showtime,js';

const Reservation = sequelize.define(
  'Reservation',
  {
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: true }
);

// Define relationships: Reservation belongs to User and Showtime
Reservation.belongsTo(User, { foreignKey: 'userId' });
Reservation.belongsTo(Showtime, { foreignKey: 'showtimeId' });

// User has many reservations
hasMany(Reservation, { foreignKey: 'userId' });

// Showtime has many reservations
_hasMany(Reservation, { foreignKey: 'showtimeId' });

export default Reservation;