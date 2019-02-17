const express = require('express');
const {
    Response,
    ERR_CODE
} = require('../helpers/response-helper');
const router = express.Router();
const {
    conn
} = require('../config');

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://habba19x.firebaseio.com"
},'Newsfeed');


router.get('/new', async (req, res) => {
    res.render('../views/news_feed.ejs');
    
});

router.post('/new', async (req, res) => {
    const { password, title, body, url} = req.body;
    const message = {
        notification: {
            title: title,
            body: body,
            url: url
        },
    };
    const stmt = 'INSERT INTO NEWSFEED (title, body, url) VALUES (?, ?, ?)';
    
    if( password === process.env.ADMIN_PASSWORD) {
        
        try {
            const result = await conn.query(stmt, [title, body, url]);   
            const result1 = await admin.messaging().sendToTopic('ALL', message);
            res.send(new Response().noError());
        }
        catch(e) {
            console.log(e);
            res.send(new Response().withError(ERR_CODE.DB_WRITE));
        }
    }
    
    else 
        res.send(new Response().withError(ERR_CODE.INVALID_PWD));
    
})

router.get('/all',async (req, res) => {
    const stmt = 'SELECT * FROM NEWSFEED';
    try {
        const results = await conn.query(stmt);
      
        res.send(new Response().withData(results).noError());
    }
    catch(e) {
        console.log(e);
        res.send(new Response().withError(ERR_CODE.DB_READ));
    }
})

module.exports = router;
