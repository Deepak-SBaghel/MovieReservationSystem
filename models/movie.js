
import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Movie = sequelize.define(
  'Movie',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    posterImage: {
      type: DataTypes.STRING,
      allowNull: false, // URL to the poster image
    },
  },
  { timestamps: true }
);

export default Movie;
