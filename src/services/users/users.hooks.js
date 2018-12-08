const logger = require("../../logger")
const { authenticate } = require("@feathersjs/authentication").hooks

module.exports = {
    before: {
        all: [
            authenticate("jwt"),
        ],
        find: [],
        get: [
            function(context) {
                if (context.id === "current") {
                    logger.info("before hook /users/current")    
                }
            }
        ],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },
}
