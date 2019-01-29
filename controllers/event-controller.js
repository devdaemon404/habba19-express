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
 * - SEND notifications to the registered user from the organizer
 * 
 * - Handle payments (!!!)
 * 
 * 
 */

const express = require('express');
const { Response, ERR_CODE } = require('../helpers/response-helper');
const router = express.Router();

// INSERT ROUTES HERE

module.exports = router;