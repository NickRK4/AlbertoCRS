import pg from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const { Pool } = pg;

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
}); 

await pool.connect()
    .then(() => {
        console.log('Connected to database');
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
    });


    const verifyToken = (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user = decoded;
            next();
        });

    }



// returns all the student
export const getAllUsers = async (req, res, next) => {
    const users = await pool.query('SELECT * FROM users');
    if (!users) {
        const error = new Error('No users found');
        return next(error);
    }
    res.status(200).json(users.rows);
};

// returns studens with id = ID
export const getUserWithID = async (req, res, next) => {
    const id = req.params.id;
    const user = await pool.query(`SELECT * FROM users WHERE user_id = ${id}`);
    if (user.length === 0) {
        const err = new Error(`User with id ${id} not found`);
        err.status = 404;
        return next(err);
    }
    res.status(200).json(user.rows);
}
 

// returns all the courses with the professor name
export const getAllCourses = async (req, res, next) => {
    try{
        const courses = await pool.query(`SELECT classes.class_id, 
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
        const existingUser = await pool.query(`SELECT * FROM users WHERE email = '${req.body.email}';`);
        if (user.length > 0) {
            const err = new Error('User already exists');
            err.status = 409;
            return next(err);
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        // create the user object
        const user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            user_type: req.body.user_type
        };

        // insert the user into the database
        const newUser = await pool.query(
            `INSERT INTO users (first_name, last_name, email, password_hash, user_type)
            VALUES ('${user.first_name}', '${user.last_name}', '${user.email}', '${user.password}', '${user.user_type}');`
        );

        res.status(201).json({message: 'User created',user: newUser});
    } catch (err) {
        console.log(err);
    }
}

// retrieves data by the username and password
export const login = async (req, res, next) => {
    try {
        const user = await pool.query(`SELECT first_name, last_name, email, user_type, password_hash FROM users WHERE email = '${req.body.email + "@gmail.com"}';`);
        const data = user.rows.at(0);

        if (!data) {
            const err = new Error('Incorrect username or password');
            err.status = 404;
            return next(err);
        }
            
        if (data.password_hash !== req.body.password) {
            const err = new Error('Incorrect password');
            err.status = 401;
            return next(err);
        }

        const payload = { firstName: data.first_name, lastName: data.last_name, email: data.email, user_type: data.user_type };
        const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });
        res.status(200).json({ success: true, token });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
}


// retrieves the student data by the class
export const getStudentsByClass = async (req, res, next) => {
    const class_id = req.params.id;
    const students = await pool.query(`SELECT first_name, last_name, email 
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
        const professor = await pool.query(`SELECT (user_id)
                                            FROM users
                                            WHERE CONCAT(first_name, ' ', last_name) = '${req.body.professor}';`);
        classData.professor_id = professor.rows.at(0).user_id;
        
        if (!classData.professor_id) {
            const err = new Error('Professor not found');
            err.status = 404;
            return next(err);
        }

        const newClass = await pool.query(
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