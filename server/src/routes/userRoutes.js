import express from 'express';
import { getAllUsers, getUserWithID, addUser} from '../controllers/userController';
const router = express.Router();

// add new student
router.get('/add', addUser);

// for all students
router.get('/', getAllUsers);

// for specific student
router.get('/:id', getUserWithID);

export default router;