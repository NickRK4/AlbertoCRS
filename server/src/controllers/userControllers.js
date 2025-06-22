import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../config/dbPool.js';

// returns all the student
export const getAllUsers = async (req, res, next) => {
    const users = await db.query('SELECT * FROM users');
    if (!users) {
        const error = new Error('No users found');
        return next(error);
    }
    res.status(200).json(users.rows);
};

// gets all students
export const getAllStudents = async (req, res, next) => {
    const users = await db.query('SELECT * FROM users WHERE user_type = \'student\'');
    if (!users) {
        const error = new Error('No users found');
        error.status = 404;
        return next(error);
    }
    res.status(200).json(users.rows);
}

// deletes students
export const deleteUser = async (req, res, next) => {
    const { user_ids } = req.body;

    if (user_ids.length === 0) {
        const err = new Error('No users found');
        err.status = 404;
        return next(err);
    }

    for (let i = 0; i < user_ids.length; i++) {
        await db.query(`DELETE FROM users WHERE user_id = ${user_ids[i]};`);
    }
    
    res.status(200).json({message: 'Users deleted'});
}

// updates student
export const updateUser = async (req, res, next) => {
    try {
        const { user_id } = req.body;
        const { first_name, last_name, email, password } = req.body;
        
        if (!password){
            await db.query(`UPDATE users SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}' WHERE user_id = ${user_id};`);
            res.status(200).json({message: 'User updated'});
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        db.query(`UPDATE users SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}', password_hash = '${hashedPassword}' WHERE user_id = ${user_id};`);
        res.status(200).json({message: 'User updated'});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Something went wrong'});
    }
}


// returns student with id = ID
export const getUserWithID = async (req, res, next) => {
    const id = req.params.id;
    const user = await db.query(`SELECT first_name, last_name, email FROM users WHERE user_id = ${id}`);
    if (user.length === 0) {
        const err = new Error(`User with id ${id} not found`);
        err.status = 404;
        return next(err);
    }
    res.status(200).json(user.rows.at(0));
}
 
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
        console.log(err);
    }
}


// add a new student to the students database
export const createUser = async (req, res, next) => {
    try {
        // check if the user exists
        const existingUser = await db.query(`SELECT * FROM users WHERE email = '${req.body.email}';`);
        if (existingUser.length > 0) {
            const err = new Error('User already exists');
            err.status = 409;
            return next(err);
        }
        
        // create the user object
        const user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            user_type: req.body.user_type
        };

        // hash the password
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // insert the user into the database
        const newUser = await db.query(
            `INSERT INTO users (first_name, last_name, email, password_hash, user_type)
            VALUES ('${user.first_name}', '${user.last_name}', '${user.email}', '${hashedPassword}', '${user.user_type}');`
        );

        res.status(201).json({message: 'User created', user: newUser});
    } catch (err) {
        console.log(err);
    }
}

// retrieves all the classes that a given student is enrolled in
export const getClassesByStudent = async (req, res, next) => {
    const student_id = req.params.id;
    const class_ids = await db.query(`SELECT class_id FROM users LEFT JOIN classlist ON users.user_id = classlist.user_id
                                    WHERE users.user_id = ${student_id};`);
    
                                    
    if (!class_ids.rows.at(0).class_id) {
        return res.status(200).json({message: "No classes found"});
        
    }

    const classes = await db.query(`SELECT classes.class_id, 
                                    classes.class_code, 
                                    classes.class_name, 
                                    classes.size,
                                    CONCAT(users.first_name, ' ', users.last_name) AS professor
                                    FROM classes 
                                    LEFT JOIN users ON classes.professor_id = users.user_id
                                    WHERE classes.class_id IN (${class_ids.rows.map((class_id) => class_id.class_id).join(', ')});`);
    
    res.status(200).json({classes: classes.rows, message: "Success"});
}



// retrieves the student data by the class
export const getStudentsByClass = async (req, res, next) => {
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
}

// enrolls a student into a class
export const enrollStudent = async (req, res, next) => {
    try {
        const { student_id, class_id } = req.body;

        // ensure the student isn't enrolled
        const existingEnrollment = await db.query(`SELECT * FROM classlist WHERE user_id = ${student_id} AND class_id = ${class_id};`);
        if (existingEnrollment.rows.length > 0) {
            return res.status(200).json({message: 'Student already enrolled'});
        }

        // insert the student
        const classlist = await db.query(`INSERT INTO classlist (class_id, user_id) 
            VALUES (${class_id}, ${student_id});`);

        // increment the size of the class
        const classData = await db.query(`SELECT size FROM classes WHERE class_id = ${class_id};`);
        const newSize = classData.rows.at(0).size + 1;
        await db.query(`UPDATE classes SET size = ${newSize} WHERE class_id = ${class_id};`);
        
        // return the response message
        res.status(201).json({message: 'Student enrolled'});
    } catch (err) {
        console.log(err);
    }
}


// creates a new class in the database
export const createClass = async (req, res, next) => {
    try {
        const classData = {
            class_code: req.body.class_code,
            class_name: req.body.class_name,
            professor_id: null,
            size: parseInt(req.body.size),
            capacity: parseInt(req.body.capacity)
        };
        
        // need to find the id of the professor
        const professor = await db.query(`SELECT user_id
                                            FROM users
                                            WHERE CONCAT(first_name, ' ', last_name) = '${req.body.professor}';`);
 
        if (professor.rowCount === 0) {
            const err = new Error('Professor not found');
            err.status = 404;
            return next(err);
        }
        
        classData.professor_id = professor.rows.at(0).user_id;
        const newClass = await db.query(
            `INSERT INTO classes (class_code, class_name, professor_id, size, capacity)
            VALUES ('${classData.class_code}', 
            '${classData.class_name}', 
            '${classData.professor_id}', 
            '${classData.size}', 
            '${classData.capacity}');`
        );
        res.status(201).json(newClass);
    } catch (err) {
        console.log(err);
    }
}

export const dropClass = async (req, res, next) => {
    try {
        const { student_id, class_id } = req.body;

        const classData = await db.query(`SELECT size FROM classes WHERE class_id = ${parseInt(class_id)};`);
        const newSize = classData.rows.at(0).size - 1;
        await db.query(`UPDATE classes SET size = ${newSize} WHERE class_id = ${parseInt(class_id)};`);
        
        await db.query(`DELETE FROM classlist WHERE class_id = ${parseInt(class_id)} AND user_id = ${student_id};`);
        res.status(200).json({message: 'Class dropped'});
    } catch (err) {
        console.log(err);
    }
}