import sequelize from '../seq.js';
import { DataTypes, UUIDV4 } from 'sequelize';

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    unique: true,
    readOnly: true,
  },
  assignment_id: {
    type: DataTypes.UUID,
    allowNull: false,
    readOnly: true,
  },
  submission_url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true,
    },
    readOnly: true,
  },
  submission_date: {
    type: DataTypes.DATE,
    readOnly: true,
  },
  submission_updated: {
    type: DataTypes.DATE,
    readOnly: true,
  },
});

export default Submission;
