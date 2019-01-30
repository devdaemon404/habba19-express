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


router.get('/getscore',async (req,res) => {
    
    const stmt = 'SELECT name,points FROM COLLEGE ORDER BY name'
    
    try {
        const results = await conn.query(stmt);
        res.send(new Response().withData(results).noError());
    }
    catch(err){
        console.log(err);
        res.send(new Response().withError(ERR_CODE.DB_READ));
    }

})


router.post('/addpoints', async (req,res) => {

    const { points, name } = req.fields;
    const stmt = 'UPDATE COLLEGE SET points = points + ? WHERE name = ?';

    try {
        const results = await conn.query(stmt,[points,name]);
        res.send(new Response().noError());
    }
    catch(err){
        console.log(err);
        res.send(new Response().withError(ERR_CODE.DB_WRITE));
    }
})

router.post('/subpoints', async (req,res) => {

    const { points, name } = req.fields;
    const stmt = 'UPDATE COLLEGE SET points = points - ? WHERE name = ?';

    try {
        const results = await conn.query(stmt,[points,name]);
        res.send(new Response().noError());
    }
    catch(err){
        console.log(err);
        res.send(new Response().withError(ERR_CODE.DB_WRITE));
    }
})




module.exports = router;
