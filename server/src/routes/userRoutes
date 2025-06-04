import express from 'express';
import { getAllUsers, getUserWithID, createUser, getAllCourses, getStudentsByClass, createClass } from '../controllers/userControllers.js';
import verifyToken from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';

const userRouter = express.Router();

// add new student
userRouter.post('/add', verifyToken, authorizeRoles('professor'), createUser);

// create a new class
userRouter.post('/class', verifyToken, authorizeRoles('professor'),createClass);

// returns all the courses
userRouter.get('/courses', verifyToken, authorizeRoles('professor'), getAllCourses)

// for all students
userRouter.get('/allStudents', verifyToken, authorizeRoles('professor'), getAllUsers);

// for specific class
userRouter.get('/class/:id', verifyToken, authorizeRoles('professor'), getStudentsByClass);

// for specific student
userRouter.get('/:id', verifyToken, authorizeRoles('professor'), getUserWithID);


export default userRouter;