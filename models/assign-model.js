/* const { DataTypes, sequelize } = require('sequelize');
*/
import sequelize from '../seq.js';
import { DataTypes,UUIDV4  } from 'sequelize'


const Assignment = sequelize.define('Assignment', {

   id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    unique:true,
}, 
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
    type: DataTypes.INTEGER,
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