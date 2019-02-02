const joi = require('joi');

const string = joi.string();
const reqString = string.required();

module.exports = {
    userSignup: {
        fields: {
            email: reqString,
            name: reqString,
            password: reqString,
            phone_number: reqString,
            college_name: reqString
        }
    },
    userLogin: {
        fields: {
            organizer_id: reqString,
            password: reqString
        }
    },
    organizerSignup: {
        fields: {
            name: reqString,
            email: reqString,
            password: reqString,
            phone_number: reqString,
        }
    },
    organizerLogin: {
        fields: {
            email: reqString,
            password: reqString
        }
    }
}