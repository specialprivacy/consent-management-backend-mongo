const { authenticate } = require("@feathersjs/authentication").hooks

module.exports = {
    before: {
        all: [
            // authenticate("jwt"),
        ],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },

    after: {
        all: [],
        find: [
            // return what frontend expects to get
            function(context) {
                const applications = context.result.data.map(a => ({
                    ...a,
                    links: { policies: "/applications/" + a.id + "/policies" },
                }))
                context.result = {
                    applications,
                }
            },
        ],
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
