

module.exports = {
    before: {
        all: [],
        find: [],
        get: [
            // replace current by other other user
            // user should get by auth
            // but can be faked at the moment
            async function(context) {
                if (context.id === "current") {
                    const usersService = context.service
                    return usersService.find({}).then(allUsers => {
                        const firstUser = allUsers.data[0]
                        context.id = firstUser._id
                        return context
                    })
                } else {
                    return context
                }
            },
        ],
        create: [],
        update: [],
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
