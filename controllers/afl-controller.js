/**
 * AFL CONTROLLER
 * 
 * Contains all the AFL related routes
 * This includes
 * 
 * - GET all names and scores of matches already played
 * - CREATE a new match (take in matchName, team1 name, team2 name, score)
 * - GET on going matches
 * - CREATE an on going match (take in matchName, team1 name, team2 name) 
 *  
 */

const express = require('express');
const { Response, ERR_CODE } = require('../helpers/response-helper');
const router = express.Router();

// INSERT ROUTES HERE

module.exports = router;
