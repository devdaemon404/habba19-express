const joi = require('joi');

const string = joi.string();

module.exports = {
    addingPoints: {
        body: {
            points: string.required(),
            name: string.required()
        }
    },
    subtractingPoints: {
        body: {
            points: string.required(),
            name: string.required()
        }
    }
}