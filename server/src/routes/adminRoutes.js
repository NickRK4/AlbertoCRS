import express from 'express';
import { getAllUsers, getUserWithID, addUser, getUserByUserPass, getAllCourses, getStudentsByClass } from '../controllers/adminController.js';
const router = express.Router();

// add new student
router.get('/add', addUser);

// get student by email and password
router.post('/login', getUserByUserPass);

router.get('/courses', getAllCourses)

// for all students
router.get('/allStudents', getAllUsers);

// for specific class
router.get('/class/:id', getStudentsByClass);

// for specific student
router.get('/:id', getUserWithID);


export default router;