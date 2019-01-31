const joi = require('joi');

const string = joi.string();
const reqString = string.required();

module.exports = {
    newEvent: {
        fields: {
            name: reqString,
            description: reqString,
            rules: reqString,
            venue: reqString,
            date: string,
            fee: string,
            category_id: reqString
        },
        headers: {
            organizer_id: reqString
        }
    },
    eventDetails: {
        headers: {
            organizer_id: reqString
        }
    },
    registerToEvent: {
        headers: {
            user_id: reqString
        },
        fields: {
            event_id: reqString
        }
    },
    userDetails: {
        headers: {
            user_id: reqString
        }
    },
    notification: {
        fields: {
            title: reqString,
            message: reqString
        },
        headers: {
            organizer_id: reqString
        }
    }
}