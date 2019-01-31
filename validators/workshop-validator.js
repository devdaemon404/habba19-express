const joi = require('joi');

const string = joi.string();
const reqString = string.required();

module.exports = {}