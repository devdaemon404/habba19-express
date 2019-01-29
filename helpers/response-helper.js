class Response {
    withToken(token) {
        this.token = token;
        return this;
    }
    withData(data) {
        this.data = data;
        return this;
    }
    withError(err) {
        this.success = false;
        this.error = err;
        return this;
    }
    noError() {
        this.success = true;
        return this;
    }

}
const ERR_CODE = {
    ALREADY_REGISTERED: {
        code: 501,
        message: 'User already registered'
    },
    INVALID_CATEGORY: {
        code: 603,
        message: 'Invalid Category'
    },
    VALIDATION_ERR: {
        code: 601,
        message: 'Invalid form entities'
    },
    UNAUTH: {
        code: 602,
        message: 'Invalid token',
        unauthorize: true
    },
    INVALID_USR: {
        code: 701,
        message: 'Invalid username/password'
    },
    INVALID_PWD: {
        code: 702,
        message: 'Invalid username/password'
    },
    USER_EXISTS: {
        code: 703,
        message: 'User already exists with the username'
    },
    DB_WRITE: {
        code: 801,
        message: 'Error writing to database'
    },
    DB_READ: {
        code: 802,
        message: 'Error reading from database'
    }
};
module.exports = {
    Response, ERR_CODE
};