import {Buffer} from 'buffer';
import {findUser} from '../service/service.js';
import basicAuth from 'basic-auth';
import User from '../models/user-model.js'; // Import your User model or user data source
import bcrypt from 'bcrypt';

export async function tokenize(req, res, next){
  const array = getCred(req)
  if (array=='') {
    return res.status(401).json("Unauthorized");
  } 
  const username = array[0];
  const pw = array[1];
  const user = await findUser(username);
  if(!user){
    return res.status(401).json("Unauthorized")
  }

  const pwcheck = await bcrypt.compare(pw, user.password)
  if(!pwcheck){
    return res.status(401).json("Unauthorized")
  }

  return next();

}
  
export const getCred = (req,res) =>{

  const token = req.header('Authorization')
  let arr = '';
  if(token == undefined){
    return arr;
  }
  else{
    const cred = Buffer.from(token.substring(6),'base64').toString('utf-8')


   arr = cred.split(':');
  
  };
return arr;
};


/* module.exports = async (req, res, next) => {
  const credentials = basicAuth(req);

  if (!credentials || !credentials.name || !credentials.pass) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Authentication required"');
    return res.sendStatus(401); // Unauthorized
  }

  const email = credentials.name;
  const password = credentials.pass;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.sendStatus(401); // Unauthorized (user not found)
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.sendStatus(401); // Unauthorized (invalid password)
    }
       // Attach the authenticated user to the request for further use in route handlers
       req.user = user;
       next();
     } catch (error) {
       console.error(error);
       return res.status(500).json({ message: 'Internal server error' });
     }
   }; */



/* const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Rutuja6367$',
  database: 'sys',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to validate user credentials
async function isValidCredentials(email, password) {
  const query = 'SELECT * FROM users WHERE email = ?';
  const [rows] = await pool.promise().query(query, [email]);

  if (rows.length === 0) {
    return false; // User not found
  }

  const user = rows[0];

  // Compare the provided password with the hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);

  return isPasswordValid;
}

module.exports = isValidCredentials;
 */