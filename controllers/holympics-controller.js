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
const { conn } = require('../config');
const validator = require('express-validation');
const { holympicsValidator } = require('../validators');


router.get('/colleges', async (req,res) => {
    
    const stmt = 'SELECT name FROM COLLEGE ORDER BY name';
    
    try {
        const results = await conn.query(stmt);
        res.send(new Response().withData(results).noError());
    }
    catch(err){
        console.log(err);
        res.send(new Response().withError(ERR_CODE.DB_READ));
    }

})
/*
* header {
    organizer_id
   }
  fields {
      points_value,description,college_id
  }
  =>Updates the points in College table and
  =>Inserts points table that includes  points_value,description,college_id
  
*
*/
router.post('/points', validator(holympicsValidator.points), async (req,res) => {

    const { organizer_id } = req.headers;
    const { points_value , description , college_id } = req.fields;
    const stmt = 'SELECT COUNT(*) AS count FROM ORGANIZER WHERE organizer_id = ?';
    const stmt1 = 'INSERT into POINTS (points_value, description, college_id, organizer_id) VALUES (?, ?, ?, ?)';
    const stmt2 = 'UPDATE COLLEGE SET points = points + ? WHERE college_id = ?';
  
    try {
        const result = await conn.query(stmt,[organizer_id]);
            if (result[0]['count'] !=0) {
                const result1 = await conn.query(stmt1,[points_value, description, college_id, organizer_id]);
                const result2 = await conn.query(stmt2,[points_value, college_id]);
                res.send(new Response().noError());
                return;
            }
            
            else {
                res.send(new Response().withError(ERR_CODE.INVALID_ORG));
             
            }
        }            
    catch(err){
        console.log(err);
        res.send(new Response().withError(ERR_CODE.DB_WRITE));
    }
});

module.exports = router;
