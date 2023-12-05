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

app.patch("/v2/assignments/:id", (req, res) => {
  client.increment('endpoint.v1_assignments_id.hits');
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.status(405).send();
  logger.info('Update the assignment via ID!');
});

bootstrap()

export default app;




  