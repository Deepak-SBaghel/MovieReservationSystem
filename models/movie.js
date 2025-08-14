import { DataTypes } from 'sequelize';
import sequelize from './index.js';

export const Movie = sequelize.define(
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

await sequelize.sync({ alter: true });

const create = (...args) => Movie.create(...args);
const findAll = (...args) => Movie.findAll(...args);
const findByPk = (...args) => Movie.creafondByPk(...args);
export { create , findAll , findByPk };
export default Movie;
