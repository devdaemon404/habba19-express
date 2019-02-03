/**
 * EVENT CONTROLLER
 * 
 * Contains the routes for handling all event related controls
 * This includes the following
 * 
 * - CREATE a new workshop
 * 
 * - UPDATE existing workshops
 * 
 * - REGISTER a user to a workshop
 * 
 * 
 */

const express = require('express');
const { Response, ERR_CODE } = require('../helpers/response-helper');
const router = express.Router();
const { conn } = require('../config');
const { workshopValidator } = require('../validators');
const validator = require('express-validation');


/**
 * NEW WORKSHOP
 * 
 * fields: {
 *  name, description, venue, date, fee
 * }
 * headers: {
 *  organizer_id
 * }
 * 
 * Add a new workshop under the requesting organizer
 * 
 */
router.post('/new', validator(workshopValidator.newWorkshop), async (req, res) => {
    const { name, description, time, venue, date, fee } = req.body;
    const { organizer_id } = req.headers;

    const stmt1 = 'SELECT COUNT(*) AS count FROM WORKSHOP WHERE organizer_id = ?';
    const stmt2 = 'INSERT INTO WORKSHOP (name, description, time, venue, date, fee, organizer_id) VALUES (?, ?, ?, ?, ?, ?, ?)';

    try {
        const results = await conn.query(stmt1, [organizer_id]);
        if (results[0]['count'] !== 0) throw new Error('Workshop already registered'); // Check if organizer already has an event registered
    } catch (e) {
        console.log(e);
        res.send(new Response().withError(ERR_CODE.INVALID_USR));
        return;
    }

    try {
        await conn.query(stmt2, [name, description, new Date(), venue, date, fee, organizer_id]);
        res.send(new Response().noError())
    } catch (e) {
        console.log(e)
        res.send(new Response().withError(ERR_CODE.DB_WRITE))
    }
});


router.get('/details', validator(workshopValidator.workshopDetails), async (req, res) => {
    const { organizer_id } = req.headers;

    const stmt1 = '' +
        'SELECT W.* ' +
        'FROM WORKSHOP as W ' +
        'WHERE organizer_id = ? ';

    const stmt2 = '' +
        'SELECT U.name, U.email, W.registration_time, U.college_name, U.phone_number ' +
        'FROM USER as U ' +
        'INNER JOIN WORKSHOP_REG as W ' +
        'ON U.user_id = W.user_id ' +
        'INNER JOIN WORKSHOP as WS ' +
        'ON W.workshop_id = WS.workshop_id ' +
        'WHERE WS.organizer_id = ?';

    try {
        const results = await conn.query(stmt1, [organizer_id]);
        if (typeof results[0] === 'undefined') {
            // The organizer has no workshop being organized by him currently
            res.send(new Response().withError(ERR_CODE.CREATE_WORSHOP));
            return;
        }
        const obj = {};
        obj.details = results[0];
        const results2 = await conn.query(stmt2, [organizer_id]);
        obj.registrations = results2;
        res.send(new Response().withData(obj).noError());

    } catch (e) {
        console.log(e);
        res.send(new Response().withError(ERR_CODE.INVALID_USR));
    }

});

/**
 * UPDATE WORKSHOP
 * 
 * fields: {
 *  name, description, venue, date, fee
 * }
 * headers: {
 *  organizer_id
 * }
 * 
 * Update the existing workshop under the requesting organizer
 * 
 */
router.post('/update', validator(workshopValidator.newWorkshop), async (req, res) => {
    const { name, description, venue, date, fee } = req.body;
    const { organizer_id } = req.headers;

    const stmt = 'UPDATE WORKSHOP SET name = ?, description = ?, time = ?, venue = ?, date = ?, fee = ? WHERE organizer_id = ?';

    try {
        const result = await conn.query(stmt, [name, description, new Date(), venue, date, fee, organizer_id]);
        if (result.affectedRows !== 0) {
            res.send(new Response().noError());
            return;
        }
        // No workshop under the organizer
        res.send(new Response().withError(ERR_CODE.CREATE_WORSHOP));
    } catch (e) {
        console.log(e);
        res.send(new Response().withError(ERR_CODE.INVALID_USR))
    }
});

/**
 * REGISTER A USER TO A WORKSHOP
 * 
 * fields: {
 *  workshop_id
 * }
 * headers: {
 *  user_id
 * }
 * 
 * Register a user to a workshop
 */
router.post('/user/register', validator(workshopValidator.registerToWorkshop), async (req, res) => {
    const { workshop_id } = req.body;
    const { user_id } = req.headers;

    const stmt = 'INSERT INTO WORKSHOP_REG (user_id, workshop_id, payment_made, registration_time) VALUES (?, ?, ?, ?)';

    try {
        await conn.query(stmt, [user_id, workshop_id, 0, new Date()]);
        res.send(new Response().noError());
    } catch (e) {
        console.log(e);
        if (e.code = 'ER_DUP_ENTRY') {
            res.send(new Response().withError(ERR_CODE.ALREADY_REGISTERED))
            return;
        }
        res.send(new Response().withError(ERR_CODE.DB_WRITE));
    }
});


router.get('/user/details', validator(workshopValidator.userDetails), async (req, res) => {
    const { user_id } = req.headers;

    const stmt1 = '' +
        'SELECT name, email, phone_number, college_name FROM USER WHERE user_id = ?';

    const stmt2 = '' +
        'SELECT WS.* ' +
        'FROM WORKSHOP as WS, WORKSHOP_REG as W, USER as U ' +
        'WHERE WS.workshop_id = W.workshop_id ' +
        'AND U.user_id = W.user_id ' +
        'AND W.user_id = ?';

    try {
        const results1 = await conn.query(stmt1, [user_id]);
        if (typeof results1[0] === 'undefined') {
            res.send(new Response().withError(ERR_CODE.INVALID_USR));
            return;
        }
        const obj = {};
        obj.details = results1[0];
        const results2 = await conn.query(stmt2, [user_id]);
        obj.workshopRegistered = results2;
        res.send(new Response().withData(obj));
    } catch (e) {
        console.log(e);
        res.send(new Response().withError(ERR_CODE.DB_READ));
    }
});


module.exports = router;