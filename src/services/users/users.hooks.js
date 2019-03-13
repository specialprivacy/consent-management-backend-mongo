const logger = require("../../logger")

module.exports = {
    before: {
        all: [],
        find: [],
        get: [
            // upsert user if current
            async function(context) {
                // logger.info("before get user")
                // logger.info(JSON.stringify(context))
                
                const userId = context.params.userId
                if (userId === "current") {
                    const userObject = context.params.userObject
                    const usersService = context.service
                    
                    const result = await usersService.find({ query: { id: userObject.id }})
                    // logger.info("result find by id")
                    // logger.info(JSON.stringify(result))
                    
                    if (result.users.length === 0) {
                        // user did not exist yet
                        // save with empty set of policies
                        // logger.info("auth user create new")
                        await usersService.create({ ...userObject, _id: userObject.id })
                    } else if (result.users.length === 1) {
                        // user already existed
                        // update info just received
                        // logger.info("auth user update")
                        await service.patch(result.users[0]._id, { ...userObject })
                        // logger.info("after patch")
                        // logger.info(JSON.stringify(result))
                    } else {
                        logger.info(`more than 1 user found with the same id: ${userId}`)
                    }
                }
                return context
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
