import * as assignService from '../service/assign-service.js';
import Submission from '../models/submission-model.js';
import { Buffer} from 'buffer';
import { getCred } from '../service/auth.js';

export async function createAssignment(req, res) {
    
    console.log("Handle the request");

    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Unauthorized. Authentication header is missing.' });
  }
  
    const { name, points, num_of_attempts,deadline } = req.body;
   // const createdBy = req.user.email; // Assuming you have authenticated the user using email

  
    // Validate assignment data
  if (!name || !points || isNaN(points) || points < 1 || points > 10) {
    return res.status(400).json({ message: 'Invalid assignment data.' });
  }
    try {
        const createdBy = getCred(req)[0];
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
      if (Object.keys(req.body).length !== 0) {
        return res.status(400).json({ error: "getAssignmentID request should not contain a body." });
      }
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
  if (Object.keys(req.body).length !== 0) {
    return res.status(400).json({ error: "getAssignmentID request should not contain a body." });
  }

  try {
    if (!req.headers.authorization) {
      res.status(400).json({ error: 'Missing authentication header' });
      return;
    }
    const createdBy = getCred(req)[0]
    // Call the assignService to delete the assignment by ID
   const assignmentsId =  await assignService.getAssignmentsById(assignmentId,createdBy)

   if (!assignmentsId) {
    res.status(404).json({ error: 'Assignment not found' });
    return;
  }
    res.status(200).json(assignmentsId); 
    }
    catch (error) {
      if (error.message === "Forbidden"){
      res.status(403).json({ error: error.message});
    }
    else{
      res.status(404).json({ error: 'Assignment not found' });
    }
  }
}
// Add a new controller method to handle assignment submissions
export async function submitAssignment(req, res) {
  const assignment_id = req.params.id;
  const userEmail = getCred(req)[0];
  const submissionData = req.body; // Assuming the submission data is in the request body
  try {
    const submissionResult = await assignService.submitAssignmentById(assignment_id, userEmail, submissionData);

    res.status(201).json(submissionResult);
  } catch (error) {
    console.error(error);
    
    if (error.message.includes('Submission rejected')) {
      res.status(400).json({ error: error.message });
    } else if (error.message.includes('Assignment with ID')) {
      res.status(404).json({ error: error.message });
    } else if (error.message === "Forbidden"){
      res.status(403).json({ error: error.message});
    }   
    else {
      res.status(502).json({ error: 'Internal Server Error' });
    }
  }
}

  export async function deleteAssignment(req, res) {
    const assignment_id = req.params.id;
    console.log(assignment_id);
  
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
     if ( await assignService.deleteAssignmentById(assignment_id, createdBy)){
        res.status(204).send(); // Respond with a success status (204 No Content)
     }
      else{
        res.status(403).send();
      }    
    } catch (error) {
      console.error(error);
      res.status(404).json({ message: 'Not found!' });
    }
  }

  export async function updateAssignment(req, res){
    const assignment_id = req.params.id;
  const updatedAssignmentData = req.body;
  const email = getCred(req)[0];

  try {
    if (!req.headers.authorization) {
      res.status(400).json({ error: 'Missing authentication header' });
      return;
    }
    if (!assignment_id) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }
    if (!updatedAssignmentData || Object.keys(updatedAssignmentData).length === 0) {
      return res.status(400).json({ error: 'No data provided for update.' });
    }
  

    if(await assignService.updateAssignmentById(assignment_id, updatedAssignmentData,email)){
        res.status(204).json({message: 'No Content'}); // Respond with the updated assignment data  
    }
    else{
        res.status(403).send();
    }
 
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: 'Not Found' });
  }

  }