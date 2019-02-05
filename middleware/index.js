const { conn } = require('../config');
const { Response, ERR_CODE } = require('../helpers/response-helper');

module.exports = {
    /**
     * Update the database version each time a substantial change happens
     * In order to make the master fetch for the client non redundent
     */
    updateVersion: async (req, res, next) => {
        const stmt = 'UPDATE VERSION SET version = version + 1'
        try {
            await conn.query(stmt)
            next()
        } catch (e) {
            console.log(e);
            console.log(new Response().withError(ERR_CODE.DB_WRITE));
        }
    }
}