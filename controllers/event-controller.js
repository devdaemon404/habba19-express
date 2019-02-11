/**
 * EVENT CONTROLLER
 * 
 * Contains the routes for handling all event related controls
 * This includes the following
 * 
 * - CREATE a new event
 * - UPDATE and existing event (details)
 * 
 * - REGISTER an user for an event
 * 
 * - GET all registered events for a user
 * 
 * - GET all registrations for an organizer's event
 * 
 * - SEND notifications to the registered user from the organizer
 * 
 * - Handle payments (!!!)
 * 
 * 
 */

const express = require('express');
const {
    Response,
    ERR_CODE
} = require('../helpers/response-helper');
const router = express.Router();
const {
    conn
} = require('../config');
const {
    eventValidator
} = require('../validators');
const validator = require('express-validation');
const {
    updateVersion
} = require('../middleware');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://habba19x.firebaseio.com"
});


/**
 * NEW EVENT
 * 
 * fields: {
 *  name, description, rules, venue, date, fee
 * }
 * headers: {
 *  organizer_id
 * }
 * 
 * Add a new event under the requesting organizer
 * 
 */
router.post('/new', [validator(eventValidator.newEvent), updateVersion], async (req, res) => {
    const {
        name,
        description,
        rules,
        venue,
        date,
        fee,
        category_id
    } = req.body;
    const {
        organizer_id
    } = req.headers;

    const stmt1 = 'SELECT COUNT(*) AS count FROM EVENT WHERE organizer_id = ?';
    const stmt2 = 'INSERT INTO EVENT (name, description, rules, venue, date, fee, organizer_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    /**
     * One organizer can only organize one event. Hence the check
     */
    try {
        const results = await conn.query(stmt1, [organizer_id]);
        if (results[0]['count'] !== 0) throw new Error('event already registered'); // Check if organizer already has an event registered
    } catch (e) {
        console.log(e);
        res.send(new Response().withError(ERR_CODE.INVALID_USR));
        return;
    }

    try {
        await conn.query(stmt2, [name, description, rules, venue, date, fee, organizer_id, category_id]);
        res.send(new Response().noError())
    } catch (e) {
        console.log(e)
        res.send(new Response().withError(ERR_CODE.DB_WRITE))
    }
});

/**
 * GET DETAILS
 * headers {
 *  organizer_id
 * }
 * 
 * Returns the details of the event being organized by the requesting organizer
 * Also returns the details of the currently registered participants
 * For Events
 * 
 */
router.get('/details', validator(eventValidator.eventDetails), async (req, res) => {
    const {
        organizer_id
    } = req.headers;

    const stmt1 = '' +
        'SELECT E.*, C.name as category_name ' +
        'FROM EVENT as E ' +
        'INNER JOIN CATEGORY as C ' +
        'ON E.category_id = C.category_id ' +
        'WHERE organizer_id = ? ';

    const stmt2 = '' +
        'SELECT U.name, U.email, E.registration_time, U.college_name, U.phone_number ' +
        'FROM USER as U ' +
        'INNER JOIN EVENT_REG as E ' +
        'ON U.user_id = E.user_id ' +
        'INNER JOIN EVENT as EV ' +
        'ON E.event_id = EV.event_id ' +
        'WHERE EV.organizer_id = ?';


    try {
        const results = await conn.query(stmt1, [organizer_id]);
        if (typeof results[0] === 'undefined') {
            // The organizer has no event being organized by him currently
            res.send(new Response().withError(ERR_CODE.CREATE_EVENT));
            return;
        }
        const obj = {};
        obj.details = results[0];
        const results2 = await conn.query(stmt2, [organizer_id]);
        obj.eventRegistration = results2;
        res.send(new Response().withData(obj).noError());

    } catch (e) {
        console.log(e);
        res.send(new Response().withError(ERR_CODE.INVALID_USR));
    }

});

/**
 * UPDATE EVENT
 * 
 * fields: {
 *  name, description, rules, venue, date, fee
 * }
 * headers: {
 *  organizer_id
 * }
 * 
 * Update the existing event under the requesting organizer
 * 
 */
router.post('/update', [validator(eventValidator.newEvent), updateVersion], async (req, res) => {
    const {
        name,
        description,
        rules,
        venue,
        date,
        fee,
        category_id
    } = req.body;
    const {
        organizer_id
    } = req.headers;

    const stmt = 'UPDATE EVENT SET name = ?, description = ?, rules = ?, venue = ?, date = ?, fee = ?, category_id = ? WHERE organizer_id = ?';

    try {
        const result = await conn.query(stmt, [name, description, rules, venue, date, fee, category_id, organizer_id]);
        if (result.affectedRows !== 0) {
            res.send(new Response().noError());
            return;
        }
        // No event under the organizer
        res.send(new Response().withError(ERR_CODE.CREATE_EVENT));
    } catch (e) {
        console.log(e);
        res.send(new Response().withError(ERR_CODE.INVALID_USR))
    }
});

/**
 * REGISTER A USER TO AN EVENT
 * 
 * fields: {
 *  event_id
 * }
 * headers: {
 *  user_id
 * }
 * 
 * Register a user to an event
 */
router.post('/user/register', validator(eventValidator.registerToEvent), async (req, res) => {
    const {
        event_id,
        device_id
    } = req.body;
    const {
        user_id
    } = req.headers;

    const stmt = 'INSERT INTO EVENT_REG (user_id, event_id, payment_made, registration_time) VALUES (?, ?, ?, ?)';

    try {
        await conn.query(stmt, [user_id, event_id, 0, new Date()]);
        const result = await admin.messaging().subscribeToTopic(device_id, event_id)
        console.log(result);
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

/**
 * USER DETAILS
 * 
 * headers: {
 *    user_id
 * }
 * Retrieve: 
 *  details of the requesting user
 *  details of the events they are registered to
 *  details of the workshops they are registered to
 *  notifications recieved for their event
 */
router.get('/user/details', validator(eventValidator.userDetails), async (req, res) => {
    const {
        user_id
    } = req.headers;

    const stmt1 = '' +
        'SELECT name, email, phone_number, college_name FROM USER WHERE user_id = ?';

    const stmt2 = '' +
        'SELECT EV.* ' +
        'FROM EVENT as EV, EVENT_REG as E, USER as U ' +
        'WHERE EV.event_id = E.event_id ' +
        'AND U.user_id = E.user_id ' +
        'AND E.user_id = ?';

    const stmt3 = '' +
        'SELECT WS.* ' +
        'FROM WORKSHOP as WS, WORKSHOP_REG as W, USER as U ' +
        'WHERE WS.workshop_id = W.workshop_id ' +
        'AND U.user_id = W.user_id ' +
        'AND W.user_id = ?';

    const stmt4 = '' +
        'SELECT N.title, N.message ' +
        'FROM NOTIFICATION as N ' +
        'INNER JOIN EVENT_REG as E ' +
        'ON N.event_id = E.event_id ' +
        'WHERE E.event_id IN ' +
        '(SELECT ER.event_id ' +
        'FROM EVENT_REG as ER ' +
        'WHERE ER.user_id = ?)';

    try {
        const results1 = await conn.query(stmt1, [user_id]);
        if (typeof results1[0] === 'undefined') {
            res.send(new Response().withError(ERR_CODE.INVALID_USR));
            return;
        }
        const obj = {};
        obj.details = results1[0];
        const results2 = await conn.query(stmt2, [user_id]);
        obj.eventsRegistered = results2;
        const results3 = await conn.query(stmt3, [user_id]);
        obj.workshopsRegistered = results3;
        const results4 = await conn.query(stmt4, [user_id]);
        obj.notifications = results4;
        res.send(new Response().withData(obj));
    } catch (e) {
        console.log(e);
        res.send(new Response().withError(ERR_CODE.DB_READ));
    }
});

/**
 * NOTIFICATION
 * feilds: {
 *  title, message
 * }
 * headers: {
 *  organizer_id
 * }
 * Register a notification for the event under the requesting organizer and getting his/her event's ID.
 */
router.post('/notification', validator(eventValidator.notification), async (req, res) => {
    const {
        title,
        message
    } = req.body;
    const {
        organizer_id
    } = req.headers;

    const stmt1 = 'SELECT event_id ' +
        'FROM EVENT ' +
        'WHERE organizer_id= ? ';
    const stmt2 = '' +
        'INSERT INTO NOTIFICATION (event_id, title, message, sent_date) VALUES (?,?,?,?) '


    try {
        const result = await conn.query(stmt1, [organizer_id]);
        const event_id = result[0].event_id;
        const topic = event_id;

        const nmessage = {
            notification: {
                title: title,
                body: message
            },
        };
        const nresult = await admin.messaging().sendToTopic(event_id.toString(), nmessage);
        await conn.query(stmt2, [event_id, title, message, new Date()]);
        res.send(new Response().noError());
    } catch (e) {
        console.log(e);
        res.send(new Response().withError(ERR_CODE.NOTIFICATION_FAILED));
    }
});

/**
 * MASTER FETCH
 * 
 * Get all categories, events and workshops in one request
 * 
 */
router.get('/masterfetch', async (req, res) => {

    const stmt1 = '' +
        'SELECT E.*, C.name as category_name, C.img_url as category_images FROM EVENT AS E, CATEGORY as C WHERE E.category_id = C.category_id ORDER BY E.category_id' +
        '';

    try {
        const result1 = await conn.query(stmt1);
        let arr = [];
        result1.forEach(row => {
            if (arr.findIndex(o => o.category_id === row.category_id) === -1)
                arr.push({
                    category_id: row.category_id,
                    category_name: row.category_name,
                    category_images: row.category_images,
                    events: []
                })
        })
        arr = arr.map(obj => {
            const eventsArr = result1.filter(o => o.category_id === obj.category_id);
            obj.events = [...eventsArr];
            return obj;
        })

        const obj = {};
        obj.mainEvents = arr;
        // IMPLEMENT WORKSHOPS
        obj.workshops = {};

        res.send(new Response().withData(obj).noError());
    } catch (e) {
        console.log(e);
        res.send(new Response().withError(ERR_CODE.DB_READ));
    }
});

/**
 * VERSION
 * 
 * Get the database version in the current state
 * 
 */
router.get('/version', async (req, res) => {
    const stmt = 'SELECT version FROM VERSION';

    try {
        const results = await conn.query(stmt);
        res.send(new Response().withData(results[0]).noError());
    } catch (e) {
        console.log(e);
        res.send(new Response().withError(ERR_CODE.DB_READ));
    }
})

router.post('/subgen', async (req, res) => {
    const { device_id } = req.body;
    try {
        const result = await admin.messaging().subscribeToTopic(device_id, 'ALL');
        console.log(result);
        res.send(new Response().noError());
    }
    catch(e) {
        console.log(e);
        res.send(new Response().withError(ERR_CODE.NOTIFICATION_FAILED));
    }
})

module.exports = router;