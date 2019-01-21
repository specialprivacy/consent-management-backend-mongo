const logger = require("../../logger")

module.exports = {
    before: {
        all: [],
        find: [
            async function(context) {
                // logger.info("before find policies")
                // logger.info(JSON.stringify(context))
                const applicationId = context.params.applicationId
                if (applicationId) {
                    const applicationService = context.app.service("applications")
                    const policiesService = context.service
                    const currentApplication = await applicationService.get(applicationId)
                    
                    context.result = await policiesService.find({
                        query: {
                            id: { $in: [...currentApplication.policies] }
                        }
                    })
                }
                return context
            }
        ],
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
                const policiesResult = context.result
                if (policiesResult.data && !policiesResult.policies) {
                    context.result = {
                        policies: [ ...policiesResult.data ],
                    }
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
