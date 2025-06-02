import express from 'express';
import { getAllUsers, getUserWithID, createUser, getAllCourses, getStudentsByClass, createClass } from '../controllers/adminController.js';
import verifyToken from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';


const adminRouter = express.Router();

// add new student
adminRouter.post('/add', verifyToken, createUser);

// create a new class
adminRouter.post('/class', verifyToken, createClass);

// returns all the courses
adminRouter.get('/courses', verifyToken, getAllCourses)

// for all students
adminRouter.get('/allStudents', verifyToken, getAllUsers);

// for specific class
adminRouter.get('/class/:id', getStudentsByClass);

// for specific student
adminRouter.get('/:id', getUserWithID);


export default adminRouter;