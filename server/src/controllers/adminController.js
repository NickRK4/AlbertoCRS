import pg from 'pg';
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
export const addUser = async (req, res, next) => {
    //const user = req.body;
    const user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        user_type: req.body.user_type
    };

    const newUser = await pool.query(
        `INSERT INTO students (first_name, last_name, email, password, user_type)
        VALUES ('${user.first_name}', '${user.last_name}', '${user.email}', '${user.password}', '${user.user_type}') RETURNING *`
    );
    
    if (!newUser) {
        const err = new Error('User not created');
        err.status = 500;
        return next(err);
    }
    res.status(200).json({
        message: 'User created',
        user: newUser
    });
}

// retrieves data by the username and password
export const getUserByUserPass = async (req, res, next) => {
    const user = req.body;
    const userDetails = await pool.query(`SELECT first_name, last_name, user_type, password_hash FROM users WHERE email = '${user.username}';`);
    const data = userDetails.rows.at(0);
    if (data.length === 0) {
        const err = new Error('User not found');
        err.status = 404;
        return next(err);
    }
    res.status(200).json(data);
};

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
