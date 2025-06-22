import jwt from 'jsonwebtoken';
import db from '../config/dbPool.js';
import bcrypt from 'bcryptjs';

// retrieves data by the username and password
export const login = async (req, res, next) => {
    try {
        const { email } = req.body;
        const values = [ email + "@nyu.edu" ];
        const user = await db.query(`SELECT user_id, first_name, last_name, email, user_type, password_hash FROM users WHERE email = '${email + "@nyu.edu"}';`);
        const data = user.rows.at(0);

        if (!data) {
            const err = new Error('User not found');
            err.status = 404;
            return next(err);
        }

        const verify = await bcrypt.compare(req.body.password, data.password_hash);
        if (!verify) {
            const err = new Error('Incorrect username or password');
            err.status = 404;
            return next(err);
        }
        
        const payload = { user_id: data.user_id, firstName: data.first_name, lastName: data.last_name, email: data.email, user_type: data.user_type };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ success: true, token });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
}

