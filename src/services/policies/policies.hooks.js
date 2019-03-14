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
                            _id: { $in: [ ...currentApplication.policies ] },
                        },
                    })
                }
                return context
            },
        ],
        get: [],
        create: [
            function(context) {
                // logger.info("before create policy hook")
                // logger.info(JSON.stringify(context))
                if (context.data && context.data.policy) {
                    context.data = context.data.policy
                }
            },
        ],
        update: [
            // redirect to patch
            async function(context) {
                // logger.info("before update policy hook")
                // logger.info(JSON.stringify(context))
                const policyId = context.id
                const policiesService = context.service
        
                return policiesService.patch(policyId, { ...context.data.policy })
                    .then(result => {
                        // logger.info("after patch policy")
                        // logger.info(JSON.stringify(result))
                        context.result = {
                            ...result,
                            id: result._id,
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
                if (context.params.provider === "rest") {
                    const policiesResult = context.result
                    if (policiesResult.data && !policiesResult.policies) {
                        const rawPolicies = policiesResult.data
                        context.result = {
                            policies: rawPolicies.map(p => {
                                return {
                                    ...p,
                                    id: p._id,
                                }
                            }),
                        }
                    }
                }
            },
        ],
        get: [
            function(context) {
                // logger.info("after get applications hook")
                // logger.info(JSON.stringify(context))
                if (context.params.provider === "rest") {
                    const rawPolicy = context.result
                    const policy = {
                        ...rawPolicy,
                        id: rawPolicy._id,
                    }
                    context.result = {
                        policies: [ policy ],
                    }
                }
            },
        ],
        create: [
            function(context) {
                if (context.params.provider === "rest") {
                    const rawPolicy = context.result
                    const policy = {
                        ...rawPolicy,
                        id: rawPolicy._id,
                    }
                    context.result = {
                        policy,
                    }
                }
            },
        ],
        update: [],
        patch: [],
        remove: [
            function(context) {
                // logger.info("after delete policies hook")
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
