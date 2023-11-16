// models/User.js
import { DataTypes } from 'sequelize';
import sequelize from '../seq.js'; // Assuming your sequelize.js file is in the same directory

const User = sequelize.define('User', {
  first_name: {
    type: DataTypes.STRING,
    unique: true,
  },
  last_name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(72),
    // Adjust the length based on your hashing algorithm
  },
  account_created: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
  account_updated: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    onUpdate: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    // Configure it to update on each update
  },
});

export default User;
