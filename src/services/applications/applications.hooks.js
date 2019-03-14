const logger = require("../../logger")

module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [
            function(context) {
                // logger.info("before create application hook")
                // logger.info(JSON.stringify(context))
                if (context.data && context.data.application) {
                    context.data = context.data.application
                }
            },
        ],
        update: [
            // redirect to patch
            async function(context) {
                // logger.info("before update application hook")
                // logger.info(JSON.stringify(context))
                const applicationId = context.id
                const applicationsService = context.service
        
                return applicationsService.patch(applicationId, { ...context.data.application })
                    .then(result => {
                        // logger.info("after patch application")
                        // logger.info(JSON.stringify(result))
                        context.result = {
                            id: result._id,
                            links: { policies: "/applications/" + result._id + "/policies" },
                            name: result.name,
                        }
                        return context
                    })
                    .catch(error => logger.info(JSON.stringify(error)))
            },

        ],
        patch: [],
        remove: [],
    },

    after: {
        all: [],
        find: [
            function(context) {
                // logger.info("after find applications hook")
                // logger.info(JSON.stringify(context))
                const applications = context.result.data.map(a => ({
                    ...a,
                    id: a._id,
                    links: { policies: "/applications/" + a._id + "/policies" },
                }))
                context.result = {
                    applications,
                }
            },
        ],
        get: [
            function(context) {
                // logger.info("after get applications hook")
                // logger.info(JSON.stringify(context))
                if (context.params.provider === "rest") {
                    const rawApplication = context.result
                    const application = {
                        ...rawApplication,
                        id: rawApplication._id,
                        links: { policies: "/applications/" + rawApplication._id + "/policies" },
                    }
                    context.result = {
                        applications: [ application ],
                    }
                }
            },
        ],
        create: [
            function(context) {
                if (context.params.provider === "rest") {
                    const rawApplication = context.result
                    const application = {
                        ...rawApplication,
                        id: rawApplication._id,
                        links: { policies: "/applications/" + rawApplication._id + "/policies" },
                    }
                    context.result = {
                        application: [ application ],
                    }
                }
            },

        ],
        update: [],
        patch: [],
        remove: [
            function(context) {
                // logger.info("after delete applications hook")
                // logger.info(JSON.stringify(context))
                if (context.params.provider === "rest") {
                    context.statusCode = 204
                }
            },

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
