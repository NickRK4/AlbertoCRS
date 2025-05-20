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
const getAllUsers = async (req, res, next) => {
    const users = await pool.query('SELECT * FROM users');
    if (!users) {
        const error = new Error('No users found');
        return next(error);
    }
    res.status(200).json(users.rows);
};

// returns studens with id = ID
const getUserWithID = async (req, res, next) => {
    const id = req.params.id;
    const user = await pool.query(`SELECT * FROM users WHERE user_id = ${id}`);
    if (user.length === 0) {
        const err = new Error(`User with id ${id} not found`);
        err.status = 404;
        return next(err);
    }
    res.status(200).json(user.rows);
}

const addUser = async (req, res, next) => {
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

const getUserByUserPass = async (req, res, next) => {
    const user = req.body;
    // Get the user type
    const userDetails = pool.query("SELECT first_name, last_name, user_type FROM users WHERE email = '${user.email}' AND password = '${user.password}'");
    if (!userDetails) {
        const err = new Error('User not found');
        err.status = 404;
        return next(err);
    }
    res.status(201).json({
        message: 'User added',
        user: userDetails
    });
}


export { getAllUsers, getUserWithID, addUser, getUserByUserPass };
