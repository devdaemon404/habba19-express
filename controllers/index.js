const aflRouter = require('./afl-controller');
const aplRouter = require('./apl-controller');
const authRouter = require('./auth-controller');
const eventRouter = require('./event-controller');
const holympicsRouter = require('./holympics-controller');
const workshopRouter = require('./workshop-controller');
const newsfeedRouter = require('./newsfeed-controller');

module.exports = {
    aflRouter,
    aplRouter,
    authRouter,
    eventRouter,
    holympicsRouter,
    workshopRouter,
    newsfeedRouter
}