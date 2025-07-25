import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../config/dbPool.js';
import fs from 'fs';
import { use } from 'react';

// returns all the student
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await db.query('SELECT * FROM users');
        if (!users) {
            const error = new Error('No users found');
            return next(error);
        }
        res.status(200).json(users.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// gets all students
export const getAllStudents = async (req, res, next) => {
    try {
        const users = await db.query('SELECT * FROM users WHERE user_type = $1', ['student']);
        if (!users) {
            const error = new Error('No users found');
            error.status = 404;
            return next(error);
        }
        res.status(200).json(users.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

// deletes students
export const deleteUser = async (req, res, next) => {
    try {
        const { user_ids } = req.body;
        if (!Array.isArray(user_ids) || user_ids.length === 0) {
            const err = new Error('No users found');
            err.status = 404;
            return next(err);
        }

        // need to calculate the new class sizes!!
            for (let i = 0; i < user_ids.length; i++) {
                await db.query(`UPDATE classes SET size = size - 1 WHERE class_id IN (SELECT class_id FROM classlist WHERE user_id = $1);`, [user_ids[i]]);
            }
        // ---

        const placeholders = user_ids.map((_, idx) => `$${idx + 1}`).join(', ');
        await db.query(`DELETE FROM classlist WHERE user_id IN (${placeholders});`, user_ids);
        const query = `DELETE FROM users WHERE user_id IN (${placeholders});`;
        const result = await db.query(query, user_ids);

        

        res.status(204).json({ message: 'Users deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// updates student
export const updateUser = async (req, res, next) => {
    try {
        const { user_id, first_name, last_name, email, password } = req.body;
        
        if (!password){
            await db.query('UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE user_id = $4', [first_name, last_name, email, user_id]);
            res.status(200).json({message: 'User updated'});
            return next(err);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('UPDATE users SET first_name = $1, last_name = $2, email = $3, password_hash = $4 WHERE user_id = $5', [first_name, last_name, email, hashedPassword, user_id]);
        res.status(200).json({message: 'User updated'});
    } catch (err) {
        res.status(500).json({message: 'Something went wrong'});
    }
};


// returns student with id = ID
export const getUserWithID = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await db.query('SELECT first_name, last_name, email FROM users WHERE user_id = $1', [id]);
        if (user.rows.length === 0) {
            const err = new Error(`User with id ${id} not found`);
            err.status = 404;
            return next(err);
        }
        res.status(200).json(user.rows.at(0));
    } catch (err) {
        res.status(500).json({message: 'Something went wrong'});
    }
};
 
// returns all the courses with the professor name
export const getAllCourses = async (req, res, next) => {
    try{
        const courses = await db.query(`SELECT classes.class_id, 
                                        classes.class_code, 
                                        classes.class_name, 
                                        classes.size, 
                                        classes.capacity, 
                                        CONCAT(users.first_name, ' ', users.last_name) AS professor
                                        FROM classes 
                                        LEFT JOIN users ON classes.professor_id = users.user_id;`);
        if (!courses) {
            const err = new Error('No courses found');
            err.status = 404;
            return next(err);
        }
        res.status(200).json(courses.rows);
    } catch (err) {
        res.status(500).json({message: 'Something went wrong'});
    }
}


// add a new student to the students database
export const createUser = async (req, res, next) => {
    try {
        // check if the user exists
        const existingUser = await db.query(
            'SELECT * FROM users WHERE email = $1;',
            [req.body.email]
        );
        if (existingUser.rows.length > 0) {
            const err = new Error('User already exists');
            err.status = 409;
            return next(err);
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const values = [req.body.first_name, req.body.last_name, req.body.email, hashedPassword, req.body.user_type];

        const newUser = await db.query(
            `INSERT INTO users (first_name, last_name, email, password_hash, user_type)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
            values
        );
        res.status(201).json({ message: 'User created', user: newUser.rows[0] });

    } catch (err) {
        res.status(500).json({message: 'Something went wrong'});
    }
};

// retrieves all the classes that a given student is enrolled in
export const getClassesByStudent = async (req, res, next) => {
    try {
        const student_id = req.params.id;
        const class_ids = await db.query(
            `SELECT class_id FROM users LEFT JOIN classlist ON users.user_id = classlist.user_id
        WHERE users.user_id = $1;`,
            [student_id]
        );

        const ids = class_ids.rows.map(row => row.class_id);
        if (ids.length === 0) {
            return res.status(200).json({ message: "No classes found" });
        }

        const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
        const classes = await db.query(
            `SELECT classes.class_id, classes.class_code, classes.class_name, classes.size,
                CONCAT(users.first_name, ' ', users.last_name) AS professor
        FROM classes
        LEFT JOIN users ON classes.professor_id = users.user_id
        WHERE classes.class_id IN (${placeholders});`,
            ids
        );
        res.status(200).json({ classes: classes.rows, message: "Success" });
    } catch (err) {
        res.status(500).json({message: 'Something went wrong'});
    }
};



// retrieves the student data by the class
export const getStudentsByClass = async (req, res, next) => {
    try {
        const class_id = req.params.id;
        const students = await db.query(`SELECT first_name, last_name, email 
                                    FROM users INNER JOIN classlist ON users.user_id = classlist.user_id
                                    WHERE classlist.class_id = ${class_id}
                                    AND users.user_type = 'student';`);
        
        if (students.length === 0) {
            const err = new Error('No students found');
            err.status = 404;
            return next(err);
        }
        res.status(200).json(students.rows);
    } catch (err) {
        res.status(500).json({message: 'Something went wrong'});
    }
};

// enrolls a student into a class
export const enrollStudent = async (req, res, next) => {
    try {
        const { student_id, class_id } = req.body;

        const existingEnrollment = await db.query(
            `SELECT * FROM classlist WHERE user_id = $1 AND class_id = $2;`,
            [student_id, class_id]
        );

        if (existingEnrollment.rows.length > 0) {
            return res.status(200).json({ message: 'Student already enrolled' });
        }

        await db.query(
            `INSERT INTO classlist (class_id, user_id) VALUES ($1, $2);`,
            [class_id, student_id]
        );

        const classData = await db.query(
            `SELECT size FROM classes WHERE class_id = $1;`,
            [class_id]
        );

        const newSize = classData.rows[0].size + 1;
        await db.query(
            `UPDATE classes SET size = $1 WHERE class_id = $2;`,
            [newSize, class_id]
        );
        res.status(201).json({ message: 'Student enrolled' });

    } catch (err) {
        res.status(500).json({message: 'Something went wrong'});
    }
};


// creates a new class in the database
export const createClass = async (req, res, next) => {
    try {
        const { class_code, class_name, size, capacity, professor, category, section } = req.body;

        const professorResult = await db.query(
            `SELECT user_id FROM users WHERE CONCAT(first_name, ' ', last_name) = $1;`,
            [professor]
        );

        if (professorResult.rowCount === 0) {
            const err = new Error('Professor not found');
            err.status = 404;
            return next(err);
        }

        const professor_id = professorResult.rows[0].user_id;
        const values = [class_code, class_name, professor_id, parseInt(size), parseInt(capacity), category, parseInt(section)];

        const newClass = await db.query(
            `INSERT INTO classes(class_code, class_name, professor_id, size, capacity, category, section) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
            values
        );

        res.status(201).json(newClass.rows[0]);

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Something went wrong'});
    }
}

export const deleteClass = async (req, res, next) => {
    try {
        const class_id  = parseInt(req.params.id);
        const classData = await db.query(`SELECT size FROM classes WHERE class_id = $1;`, [class_id]);
        if (classData.rows[0].size > 0) {
            const err = new Error('Class is not empty!');
            err.status = 404;
            return next(err);
        }

        await db.query(`DELETE FROM classes WHERE class_id = $1;`, [class_id]);
        res.status(204).json({ message: 'Class deleted' });
    } catch (err) {
        res.status(500).json({message: 'Something went wrong'});
    }
}


export const dropClass = async (req, res, next) => {
    try {
        const { student_id, class_id } = req.body;
        const classData = await db.query(`SELECT size FROM classes WHERE class_id = $1;`, [class_id]);

        if (classData.rowCount === 0) {
            const err = new Error('Class not found');
            err.status = 404;
            return next(err);
        }

        const newSize = classData.rows[0].size - 1;

        await db.query(`UPDATE classes SET size = $1 WHERE class_id = $2;`, [newSize, class_id]);
        await db.query(`DELETE FROM classlist WHERE class_id = $1 AND user_id = $2;`, [class_id, student_id]);
        res.status(200).json({ message: 'Class dropped' });
    } catch (err) {
        res.status(500).json({message: 'Something went wrong'});
    }
};

// GET METHOD THAT GENERATES A REPORT AND SENDS IT BACK AS A TXT FILE
export const generateReport = async (req, res, next) => {
    try{
        const class_id = req.params.code;

        const classData = await db.query(`SELECT * FROM classes WHERE class_id = $1;`, [class_id]);
        if (classData.rowCount === 0) {
            const err = new Error('Class not found');
            err.status = 404;
            return next(err);
        }
        
        const class_name = classData.rows[0].class_name;
        const class_code = classData.rows[0].class_code;
        const professor = classData.rows[0].professor_id;
        const size = classData.rows[0].size;
        const capacity = classData.rows[0].capacity;
        const students = await db.query(`SELECT first_name, last_name, email 
                                FROM users INNER JOIN classlist ON users.user_id = classlist.user_id
                                WHERE classlist.class_id = $1
                                AND users.user_type = 'student';`, [class_id]);
        
        const studentList = (students.rowCount === 0) ? 'No students found' : students.rows.map((student) => `${student.first_name} ${student.last_name} - ${student.email}`).join('\n');

        const report = 
        `Class Name: ${class_name}
Class Code: ${class_code}
Professor: ${professor}
Size: ${size}
Capacity: ${capacity}
Students:
${studentList}`;

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', 'attachment; filename="report.txt"');
        res.status(200).send(report);
    } catch (err) {
        res.status(500).json({message: 'Something went wrong'});
    }

}


export const getMetrics = async (req, res, next) => {
    try {
        
        const allTopics = await db.query(`SELECT DISTINCT category, COUNT(*) AS count, category FROM classes GROUP BY category;`);
        const allClasses = await db.query(`SELECT COUNT(*) FROM classes;`);
        const allStudents = await db.query(`SELECT COUNT(*) FROM users WHERE user_type = 'student';`);
        const allProfessors = await db.query(`SELECT COUNT(*) FROM users WHERE user_type = 'professor';`);

        const topics = {};

        for (let i = 0; i < allTopics.rows.length; i++) {
            topics[allTopics.rows[i].category] = allTopics.rows[i].count;
        }

        const data = {
            classes: allClasses.rows[0].count,
            students: allStudents.rows[0].count,
            professors: allProfessors.rows[0].count,
            topics: topics
        }
        
        res.status(200).json(data);
    } catch (err){
        console.log(err);
        res.status(500).json({message: 'Something went wrong'});
    }
}



