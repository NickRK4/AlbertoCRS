import express from 'express';
import { getAllUsers, getUserWithID, createUser, login, getAllCourses, getStudentsByClass, createClass } from '../controllers/adminController.js';
const adminRouter = express.Router();

// add new student
router.post('/add', createUser);

// create a new class
router.post('/class', createClass);

// get student by email and password
router.post('/login', login);

// returns all the courses
router.get('/courses', getAllCourses)

// for all students
router.get('/allStudents', getAllUsers);

// for specific class
router.get('/class/:id', getStudentsByClass);

// for specific student
router.get('/:id', getUserWithID);


export default router;