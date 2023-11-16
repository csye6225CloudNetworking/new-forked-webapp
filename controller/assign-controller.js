import * as assignService from '../service/assign-service.js';
import { Buffer} from 'buffer';
import { getCred } from '../service/auth.js';

export async function createAssignment(req, res) {
    
    console.log("Handle the request");
  
    const { name, points, num_of_attempts,deadline } = req.body;
   // const createdBy = req.user.email; // Assuming you have authenticated the user using email

  
    // Validate assignment data
  if (!name || !points || isNaN(points) || points < 1 || points > 10) {
    return res.status(400).json({ message: 'Invalid assignment data.' });
  }
    try {
        const createdBy = getCred(req)[0]
      const assignment = await assignService.createAssignment(name, points, num_of_attempts, deadline, createdBy);
      res.status(201).json(assignment);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Duplicate assignment' });
    }
  }

  export const handlePatch = async (req, res) => {
    if (req.method === 'PATCH') {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  
  };

  
  export async function getAssignmentsByUser(req, res) {
 
    try {
      if (!req.headers.authorization) {
        res.status(400).json({ error: 'Missing authentication header' });
        return;
      }
      const assignments = await assignService.getAssignmentsByUser();
      res.status(200).json(assignments);
    
    } catch (error) {
      if (error.message === "Forbidden"){
      res.status(403).json({ error: 'Forbidden' });
    }
    else{
        res.status(400).json();
    }
  }
};


export async function getAssignmentsById(req, res) {
  const assignmentId = req.params.id;
  console.log(assignmentId);

  try {
    if (!req.headers.authorization) {
      res.status(400).json({ error: 'Missing authentication header' });
      return;
    }
    const createdBy = getCred(req)[0]
    // Call the assignService to delete the assignment by ID
   if ( await assignService.getAssignmentsById(assignmentId,createdBy)){
      res.status(204).send(); // Respond with a success status (204 No Content)
   }
    else{
      res.status(403).send();
    }    
  } catch (error) {
    console.error(error);
    res.status(400).json({  });
  }
}


  export async function deleteAssignment(req, res) {
    const assignmentId = req.params.id;
    console.log(assignmentId);
  
    try {
      if (!req.headers.authorization) {
        res.status(400).json({ error: 'Missing authentication header' });
        return;
      }
      const createdBy = getCred(req)[0]
      if (Object.keys(req.body).length !== 0) {
        res.status(400).json({ message: 'Request body should not be present for deletion.' });
        return;
      }
      // Call the assignService to delete the assignment by ID
     if ( await assignService.deleteAssignmentById(assignmentId, createdBy)){
        res.status(204).send(); // Respond with a success status (204 No Content)
     }
      else{
        res.status(403).send();
      }    
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Not found!' });
    }
  }

  export async function updateAssignment(req, res){
    const assignmentId = req.params.id;
  const updatedAssignmentData = req.body;
  const email = getCred(req)[0];

  try {
    if (!req.headers.authorization) {
      res.status(400).json({ error: 'Missing authentication header' });
      return;
    }

    if(await assignService.updateAssignmentById(assignmentId, updatedAssignmentData,email)){
        res.status(204).json({message: 'No Content'}); // Respond with the updated assignment data  
    }
    else{
        res.status(403).send();
    }
 
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Bad Request' });
  }

  }