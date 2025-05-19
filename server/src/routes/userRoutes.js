import express from 'express';
import { getAllUsers, getUserWithID, addUser} from '../controllers/userController.js';
const router = express.Router();

// add new student
router.get('/add', addUser);

// get student by email and password
router.get('/login', getUserByUserPass);


// for all students
router.get('/', getAllUsers);

// for specific student
router.get('/:id', getUserWithID);

export default router;