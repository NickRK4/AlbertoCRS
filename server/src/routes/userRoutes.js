import express from 'express';
import {deleteClass, generateReport, dropClass, enrollStudent, updateUser, deleteUser, getAllUsers, getAllStudents, getUserWithID, createUser, getAllCourses, getClassesByStudent, getStudentsByClass, createClass } from '../controllers/userControllers.js';
import verifyToken from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';

const userRouter = express.Router();

// add new student
userRouter.post('/add',verifyToken, authorizeRoles('professor'), createUser);

// returns all students
userRouter.get('/students', verifyToken, authorizeRoles('professor'), getAllStudents);

// update a student
userRouter.put('/updateStudent', verifyToken, authorizeRoles('professor'), updateUser);

// create a new class
userRouter.post('/class', verifyToken, authorizeRoles('professor'),createClass);

// delete a class
userRouter.delete('/deleteClass/:id', verifyToken, authorizeRoles('professor'), deleteClass);

// delete a user(s)
userRouter.delete('/deleteUser', verifyToken, authorizeRoles('professor'), deleteUser);

// returns all the courses
userRouter.get('/courses', verifyToken, authorizeRoles('professor', 'student'), getAllCourses)

// returns all the classes for a given student
userRouter.get('/classesByStudent/:id', verifyToken, authorizeRoles('professor', 'student'), getClassesByStudent);

// returns all students
userRouter.get('/allStudents', verifyToken, authorizeRoles('professor'), getAllUsers);

// drops a class
userRouter.post('/drop', verifyToken, authorizeRoles('professor', 'student'), dropClass);

// for specific class
userRouter.get('/class/:id', verifyToken, authorizeRoles('professor'), getStudentsByClass);

// for specific student
userRouter.get('/:id', verifyToken, authorizeRoles('professor'), getUserWithID);

// enroll a student
userRouter.post('/enroll', verifyToken, authorizeRoles('professor', 'student'), enrollStudent);

// generates the report and sends it back
userRouter.post('/class/report/:code', verifyToken, authorizeRoles('professor'), generateReport);


export default userRouter;