/**
 * HOLYMPICS CONTROLLER (HABBA OLYMPICS)
 * 
 * Contains all the Habba Olympics related routes
 * This includes
 * 
 * - GET current departments and scores (Ordered)
 * - ADD points for a specific department
 * - SUBTRACT points for a specific department
 *   
 */

const express = require('express');
const { Response, ERR_CODE } = require('../helpers/response-helper');
const router = express.Router();

// INSERT ROUTES HERE

module.exports = router;