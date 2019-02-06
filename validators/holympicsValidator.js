const joi = require('joi');

const string = joi.string();
const reqString= string.required();
module.exports = {
    addingPoints: {
        body: {
            points: reqString,
            name: reqString
        }
    },
    subtractingPoints: {
        body: {
            points: reqString,
            name: reqString
        }
    }
}