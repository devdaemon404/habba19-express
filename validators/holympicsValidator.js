const joi = require('joi');

const string = joi.string();

module.exports = {
    addingPoints: {
        fields: {
            points: string.required(),
            name: string.required()
        }
    },
    subtractingPoints: {
        fields: {
            points: string.required(),
            name: string.required()
        }
    }
}