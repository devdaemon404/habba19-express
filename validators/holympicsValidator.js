const joi = require('joi');

const string = joi.string();
const reqString = string.required();


module.exports = {
    points: {
        fields: {
            points_value: reqString,
            description: reqString,
            college_id: reqString
        },
        headers: {
             organizer_id: reqString
        }
    }
}