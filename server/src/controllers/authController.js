import jwt from 'jsonwebtoken';
import db from '../config/dbPool.js';

// retrieves data by the username and password
export const login = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await db.query(`SELECT first_name, last_name, email, user_type, password_hash FROM users WHERE email = '${email + "@gmail.com"}';`);
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
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ success: true, token });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
}

