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
 * NEW EVENT
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
router.post('/new');

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
router.post('/update');

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
router.post('/user/register');

module.exports = router;