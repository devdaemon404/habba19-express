const joi = require('joi');

const string = joi.string();

module.exports = {
    userSignup: {
        fields: {
            email: string.required(),
            name: string.required(),
            password: string.required(),
            phone_number: string.required(),
            college_name: string.required()
        }
    },
    userLogin: {
        fields: {
            email: string.required(),
            password: string.required()
        }
    },
    organizerSignup: {
        fields: {
            name: string.required(),
            email: string.required(),
            password: string.required(),
            phone_number: string.required(),
        }
    },
    organizerLogin: {
        fields: {
            email: string.required(),
            password: string.required()
        }
    }
}