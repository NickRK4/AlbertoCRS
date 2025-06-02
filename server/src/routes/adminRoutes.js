import express from 'express';
import { getAllUsers, getUserWithID, createUser, getAllCourses, getStudentsByClass, createClass } from '../controllers/adminController.js';
const adminRouter = express.Router();

// add new student
adminRouter.post('/add', createUser);

// create a new class
adminRouter.post('/class', createClass);

// returns all the courses
adminRouter.get('/courses', getAllCourses)

// for all students
adminRouter.get('/allStudents', getAllUsers);

// for specific class
adminRouter.get('/class/:id', getStudentsByClass);

// for specific student
adminRouter.get('/:id', getUserWithID);


export default adminRouter;