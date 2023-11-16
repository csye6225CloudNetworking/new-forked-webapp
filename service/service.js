import User from '../models/user-model.js'
import bcrypt from "bcrypt";
import { parseCSV } from '../scripts/userScript.js';
import Assignment from '../models/assign-model.js';

// Sync the database to create tables
// Service function to get all users
export const bootstrap = async () => {
  
    await User.sync();
    await Assignment.sync();
    try {
      parseCSV(async (data) => {
        // Loop through the data from CSV
        for (const row of data) {
          try {
            // Check if the user already exists based on email
            const existingUser = await User.findOne({
              where: { email: row.email },
            });
  
            if (!existingUser) {
              // User does not exist, create a new one
              const hashedPassword = await bcrypt.hash(row.password, 10);
              await User.create({
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email,
                password: hashedPassword,
              });
              console.log(`User created for email: ${row.email}`);
            } else {
              // User already exists, no action required
              console.log(`User with email ${row.email} already exists`);
            }
          } catch (error) {
            console.error(`Error creating user for email ${row.email}:, error`);
          }
        }
      });
    } catch (err) {
        throw new Error(err.message);
    }
    };  

   export const findUser = async (username) =>{
    const email = username;
    let user = await User.findOne({where : {email}});
    return user;
   }


 //codeeee
/* export const saveUser = async (newUser) => {
    try {
      const user = await User.create(newUser);
      return {
        status: 200,
        body: user,
      };
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        // If the error is due to a unique constraint violation (e.g., duplicate email), return 403 Forbidden.
        return {
          status: 403,
          body: { message: 'Forbidden: User with the same email already exists' },
        };
      } else {
        // For other errors, return 401 Unauthorized or 500 Internal Server Error as appropriate.
        return {
          status: error.name === 'UnauthorizedError' ? 401 : 500,
          body: { message: error.message || 'Internal server error' },
        };
      }
    }
  } */

  /* export const getUser = async (id) => {
    try {
      const user = await User.findOne({ where: { email: id } });
      if (!user) {
        return {
          status: 404,
          body: { message: 'User not found' },
        };
      }
      return {
        status: 200,
        body: user,
      };
    } catch (error) {
      // Handle errors appropriately (e.g., log or return an error response)
      return {
        status: error.name === 'UnauthorizedError' ? 401 : 500,
        body: { message: error.message || 'Internal server error' },
      };
    }
  }
  
  export const updateDetails = async (id, updatedUser) => {
    try {
      const [rowsUpdated, [updatedUserInstance]] = await User.update(updatedUser, {
        where: { email: id },
        returning: true, // This returns the updated user instance
      });
  
      if (rowsUpdated === 0) {
        return {
          status: 404,
          body: { message: 'User not found' },
        };
      }
  
      return {
        status: 200,
        body: updatedUserInstance,
      };
    } catch (error) {
      // Handle errors appropriately (e.g., log or return an error response)
      return {
        status: error.name === 'UnauthorizedError' ? 401 : 500,
        body: { message: error.message || 'Internal server error' },
      };
    }
  } */