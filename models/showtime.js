
import { DataTypes } from 'sequelize';
import sequelize from './index';
import Movie from './movie';

const Showtime = sequelize.define(
  'Showtime',
  {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: true }
);

// Define the relationship: a movie has many showtimes
Showtime.belongsTo(Movie, { foreignKey: 'movieId' });
// belongsTo = Child table gets the foreign key.
// i.e add the movieId foreign Key in the ShowTime table 
Movie.hasMany(Showtime, { foreignKey: 'movieId', onDelete: 'CASCADE' });
// optional : hasMany = Parent table knows it has many children. (Movie can list its Showtimes)
// with this , I can query from the movie table to get the showTime's 
// therefore its Important to set if Movie hasOne or hasMany ShowTime . 
export default Showtime;
