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
    
router.post('/user/signup', validator(authValidator.userSignup), async (req, res) => {

    const { email, password, phone_number, college_name, name } = req.body;
    const stmt = 'INSERT INTO USER (user_id, name, email, password, phone_number, college_name, registration_time) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const id = uniqid('h19-');
    try {
        const hashedPwd = await bcrypt.hash(password, 2);
        const results = await conn.query(stmt, [id, name, email, hashedPwd, phone_number, college_name, new Date()]);
        res.send(new Response().withToken(id).noError());

    } catch (err) {
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
router.post('/organizer/login', validator(authValidator.userLogin), async (req, res) => {
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