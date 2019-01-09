const logger = require("../../logger")

module.exports = {
    before: {
        all: [],
        find: [],
        get: [
            function(context) {
                // logger.info("before get user hook")
                // logger.info(JSON.stringify(context))
                if (context.id === "current") {
                    context.id = context.params.userId
                }
                return context
            },
        ],
        create: [],
        update: [
            async function(context) {
                // logger.info("before update user hook")
                // logger.info(JSON.stringify(context))
                if (context.id === "current") {
                    // logger.info("before update user hook - current")
                    const userId = context.params.userId
                    const usersService = context.service
                    return usersService.patch(userId, { policies: context.data.user.policies }).then(result => {
                        // logger.info("after patch current user")
                        // logger.info(JSON.stringify(result))
                        context.result = { 
                            email_verified: result.email_verified,
                            id: "current",
                            policies: result.policies,
                            preferred_username: result.preferred_username,
                        }
                        return context
                    })
                } else {
                    // logger.info("before update user hook - not current")
                    return context
                }
            },
        ],
        patch: [],
        remove: [],
    },

    after: {
        all: [],
        find: [],
        get: [
            // return what frontend expects to get
            function(context) {
                const userResult = context.result
                userResult.id =  "current"
                userResult.email_verified = false
                userResult.links = {
                    policies: "/users/current/policies",
                }
                context.result = {
                    users: [ userResult ],
                }
            },
        ],
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
