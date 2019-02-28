/**
 * AUTH CONTROLLER
 * 
 * Contains the routes handling User and Organizer authentication
 * This includes the following
 * - USER signup route
 * - USER login route
 * 
 * - ORGANIZER signup route
 * - ORGANIZER login route
 * 
 */

const express = require('express');
const { Response, ERR_CODE } = require('../helpers/response-helper');
const router = express.Router();
const validator = require('express-validation');
const { authValidator } = require('../validators');
const { conn } = require('../config');
const uniqid = require('uniqid');
const bcrypt = require('bcrypt');



/**
 * USER SIGNUP
 * 
 * form_data
 * req.body = {
 *  email, password, phone_number, college_name
 * }
 */

router.post('/user/signup', validator(authValidator.userLogin), async (req, res) => {

    const { email, password, phone_number, college_name, name } = req.body;
    const stmt = 'INSERT INTO USER (user_id, name, email, password, phone_number, college_name, registration_time , department_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const id = uniqid('h19-');
    const id1 = uniqid('ay-');
    let department = '';
    let college = '';
    try {
        const hashedPwd = await bcrypt.hash(password, 2);
        if (college_name === 'ay_cert') {

            var split0 = email.split('@');
            var split1 = split0[0].split('.');
            if (split1.length > 1) {
                college = split1[1].slice(0, 2).toUpperCase();
                department = split1[1].slice(2, 4).toUpperCase();
            }
            else {
                college = 'faculty';
                department = 'faculty';
            }
            const results = await conn.query(stmt, [id1, name, email, hashedPwd, phone_number, college, new Date(), department]);
            res.send(new Response().withToken(id1).noError());
        }
        else if (college_name !== 'ay_cert') {
            const results = await conn.query(stmt, [id, name, email, hashedPwd, phone_number, college_name, new Date(), department]);
            res.send(new Response().withToken(id).noError());

        }
    }
    catch (err) {
        console.log(err)
        res.send(new Response().withError(ERR_CODE.USER_EXISTS));
    }

});

/**
 * USER LOGIN
 * 
 * form_data
 * req.body = {
 *  email, password
 * }
 * 
 * Verify login and change id's on each login
 */
router.post('/user/login', validator(authValidator.userLogin), async (req, res) => {
    const { email, password } = req.body;

    const stmt = 'SELECT password, user_id FROM USER WHERE email = ?';

    try {
        const result = await conn.query(stmt, [email]);

        if (await bcrypt.compare(password, result[0]['password'])) {
            res.send(new Response().withToken(result[0]['user_id']).noError());
            return;
        }
        // Invalid password condition
        res.send(new Response().withError(ERR_CODE.INVALID_PWD));
    } catch (err) {
        console.log(err);
        // Invalid email condition
        res.send(new Response().withError(ERR_CODE.INVALID_USR));
    }
})


/**
 * ORGANIZER SIGNUP
 * 
 * form_data
 * req.body = {
 *  email, password, phone_number, name
 * }
 */
router.post('/organizer/signup', validator(authValidator.organizerSignup), async (req, res) => {
    const { email, password, phone_number, name } = req.body;
    const stmt = 'INSERT INTO ORGANIZER ( email, password, phone_number, name) VALUES (?, ?, ?, ?)';
    const stmt2 = 'SELECT organizer_id FROM ORGANIZER where email = ?';
    try {
        const hashedPwd = password;
        await conn.query(stmt, [email, hashedPwd, phone_number, name]);
        const result = await conn.query(stmt2, [email]);
        res.send(new Response().withToken(result[0]['organizer_id']).noError());

    } catch (err) {
        console.log(err)
        res.send(new Response().withError(ERR_CODE.USER_EXISTS));
    }

});

/**
 * ORGANIZER LOGIN
 * 
 * form_data
 * req.body = {
 *  email, password
 * }
 * 
 * Verify login and change id's on each login
 */
router.post('/organizer/login', validator(authValidator.organizerLogin), async (req, res) => {
    const { organizer_id, password } = req.body;

    const stmt = 'SELECT password, organizer_id FROM ORGANIZER WHERE organizer_id = ?';

    try {
        const result = await conn.query(stmt, [organizer_id]);

        // Authenticated successfully, change the id
        res.send(new Response().withToken(result[0]['organizer_id']).noError());
        return;
        // Invalid password condition
        res.send(new Response().withError(ERR_CODE.INVALID_PWD));
    } catch (err) {
        // Invalid email condition
        res.send(new Response().withError(ERR_CODE.INVALID_USR));
    }
})


module.exports = router;
