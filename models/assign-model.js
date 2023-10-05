/* const { DataTypes, sequelize } = require('sequelize');
*/
import sequelize from '../seq.js';
import { DataTypes } from 'sequelize'


const Assignment = sequelize.define('Assignment', {
  name: {
    type: DataTypes.STRING,
  },

  points: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 10,
    }
  },
  num_of_attempts: {
    type: DataTypes.STRING,
    validate: {
      min: 1,
      max: 3,
    }
  },
  deadline: {
    type: DataTypes.DATE
  },
  createdBy:{
    type: DataTypes.STRING,
  }


  });


export default Assignment;