const joi = require('joi');

const string = joi.string();
const reqString = string.required();

module.exports = {
    userSignup: {
        body: {
            email: reqString,
            name: reqString,
            password: reqString,
            phone_number: reqString,
            college_name: reqString
        }
    },
    organizerLogin: {
        body: {
            organizer_id: reqString,
            password: reqString
        }
    },
    organizerSignup: {
        body: {
            name: reqString,
            email: reqString,
            password: reqString,
            phone_number: reqString,
        }
    },
    userLogin: {
        body: {
            email: reqString,
            password: reqString
        }
    }
}
