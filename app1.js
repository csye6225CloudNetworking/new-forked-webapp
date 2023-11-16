import Express from 'express';
import mysql from 'mysql2';
import StatsD from 'node-statsd';
import sequelize from './seq.js';
import { createPool } from 'mysql2/promise'; 
export const app = Express();
const port = 8080;
import {logger} from './logger.js';

import assignRouter from './routes/assign-route.js';
import userRouter from './routes/user-route.js';
//import intTest from './integration-tests/integration-tests.js';
//import healthRouter from './routes/health-route.js';
import {bootstrap} from './service/service.js';
import dotenv from 'dotenv'
dotenv.config()

const pool = createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10, // adjust the connection limit as per your needs
});
const client = new StatsD({
  errorHandler: function (error) {
    console.error("StatsD error: ", error);
  }
});
app.use(async (req,res,next)=>{

  try {
    await sequelize.authenticate();
    console.log("this is where the bootstrap would run")
  } catch (error) {
    return  res.status(503).send();
  }
  next();
})

//import { DataTypes } from 'sequelize';

//import assignmentRoutes from './routes/assign-route.js'; // Import the assignment routes
//app.use('/', assignmentRoutes);
app.use(Express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization,x-access-token');
   next();
  });
//app.use(healthRouter);
app.use(userRouter);
app.use(assignRouter);
//app.use(intTest);

app.get("/healthz", async (req, res) => {
  
  let isHealthy = false;
  const connection = await pool.getConnection();
/*   var connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  }); */

  //console.log(process.env.MYSQL_HOST,process.env.MYSQL_USER,process.env.MYSQL_PASSWORD,process.env.MYSQL_DATABASE);
  if (Object.keys(req.body).length !== 0) {
    return res.status(400).json();
  }
  if (Object.keys(req.query).length !== 0) {
    return res.status(400).json();
  }
  if (connection) {
    isHealthy = true;
    console.log("healthy",isHealthy);
    connection.release();
  } else {
    isHealthy = false;
    console.log(err);
  }
/*   connection.connect(function (err) {
    if (err) {
      isHealthy = false;
      console.log(err);
    } else {
      isHealthy = true;
    } */

    if (isHealthy) {
      
      res.setHeader("Cache-Control", "no-cache", "no-store", "must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("X-Content-Type-Options", "nosniff");

      console.log("Connection Established!");

      logger.info('Server started and listening on port 8080');
      client.increment('endpoint.healthz.hits');


      return res.status(200).json();
    } else {
      console.log("Connection Interrupted!");
      return res.status(503).json();
    }
  });

app.listen(port,() => {console.log("server",port);
})

app.patch("/v1/assignments/:id", (req, res) => {
  client.increment('endpoint.v1_assignments_id.hits');
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.status(405).send();
  logger.info('Update the assignment via ID!');
});

bootstrap()

export default app;

//HTTP error except GET method
/* app.use((req, res, next) => {
  if (req.method !== 'GET') {

    //Set the Cache header
    res.setHeader('Cache-Control', 'no-cache','no-store','must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    //Set 405 Method Not Allowed
    return res.status(405).json();
  }
  next();
}); */



// Define your MySQL models here, e.g., User
/* const User = sequelize.define('User', {
  // Define your User model fields here
  // Example: firstName, lastName, email, password, etc.
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
    type: DataTypes.STRING(72), // Adjust the length based on your hashing algorithm
  },
  account_created: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  account_updated: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
  },
}); */



    // Start your Express app
   
  

    

    // Define a middleware for Basic Authentication
    /* function authenticateBasicAuth(req, res, next) {
      const credentials = basicAuth(req);

      if (!credentials || !credentials.name || !credentials.pass) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Authentication required"');
        return res.sendStatus(401); // Unauthorized
      }

      const username = credentials.name;
      const password = credentials.pass;

      // Verify the credentials against your User database or another source of truth
      // Replace this logic with actual user authentication logic
      if (isValidCredentials(username, password)) {
        req.user = { username }; // Store the authenticated user for later use
        return next();
      } else {
        return res.sendStatus(401); // Unauthorized
      }
    } */

   /*  app.get('/health', authenticateBasicAuth, async (req, res) => {
      res.json({ message: 'Route Protected!' });
      let isHealthy = false;
      var connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'Rutuja6367$',
        database: 'sys',
      }); */

      /* if (Object.keys(req.body).length !== 0) {
        // If the payload is not empty, respond with a 400 Bad Request status and an error message.
        res.status(400).json();
        return;
      }

      if (Object.keys(req.query).length !== 0) {
        // If the payload is not empty, respond with a 400 Bad Request status and an error message.
        res.status(400).json();
        return;
      } */

      /* await connection.connect(function (err) {
        if (err) {
          isHealthy = false;
        } else {
          isHealthy = true;
        }
        console.log('Connected!');

        if (isHealthy) {
          // Add no cache header
          res.setHeader('Cache-Control', 'no-cache', 'no-store', 'must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('X-Content-Type-Options', 'nosniff');

          // Success message
          res.status(200).json();
        } else {
          console.log('Connection Interrupted!');
          // Add Cache Header
          res.setHeader('Cache-Control', 'no-cache', 'no-store', 'must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.status(503).json();
        }
      });
    }); */

  