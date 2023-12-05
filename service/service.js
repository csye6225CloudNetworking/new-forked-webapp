import User from '../models/user-model.js'
import bcrypt from "bcrypt";
import { parseCSV } from '../scripts/userScript.js';
import Assignment from '../models/assign-model.js';
import Submission from '../models/submission-model.js';

// Sync the database to create tables
// Service function to get all users
export const bootstrap = async () => {
  
    await User.sync();
    await Assignment.sync();
    await Submission.sync();
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

