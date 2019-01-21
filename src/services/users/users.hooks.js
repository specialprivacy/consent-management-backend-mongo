const logger = require("../../logger")
const arraysAreEqual = require("../../util/arrays-are-equal")

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
                    
                    return usersService.patch(userId, { policies: context.data.user.policies })
                        .then(result => {
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
                        .catch(error => logger.info(JSON.stringify(error)))
                } else {
                    return context
                }
            },
        ],
        patch: [
            async function(context) {
                const usersService = context.service
                const resultBeforePatch = await usersService.get(context.id)
                context.policiesBeforeUpdate = resultBeforePatch.users[0].policies
                return context
            }
        ],
        remove: [],
    },

    after: {
        all: [],
        find: [
            function(context) {
                // logger.info("after find users")
                // logger.info(JSON.stringify(context))
                const userResult = context.result.data
                context.result = {
                    users: [ ...userResult ],
                }
                return context
            }
        ],
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
        patch: [
            function(context) {
                // logger.info("after user patch")
                // logger.info(JSON.stringify(context))
                if (!arraysAreEqual(context.policiesBeforeUpdate, context.result.policies)) {
                    context.app.handleUserPatch(context.id, context.policiesBeforeUpdate, context.result.policies)
                }    
            }
        ],
        remove: [
            function(context) {
                // logger.info("after user remove hook")
                // logger.info(JSON.stringify(context))
                context.app.handleUserDelete(context.result._id, context.result.policies)
            }
        ],
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
