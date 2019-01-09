// Initializes the `policies` service on path `/policies`
const checkUserAccess = require("../../hooks/checkUserAccess")
const createModel = require("../../models/policy.model")
const createService = require("feathers-mongoose")
const hooks = require("./policies.hooks")
const logger = require("../../logger")

module.exports = function (app) {
    const Model = createModel(app)
    const paginate = app.get("paginate")

    const options = {
        Model,
        multi: true,
        paginate,
    }

    // Initialize our service with any options it requires
    const policiesService = createService(options)
  
    // Register the service on the necessary routes
    app.use("/policies", policiesService)
  
    // Register the policiesService on the nested applications & users routes
    app.use("/applications/:applicationId/policies", policiesService)
    function mapApplicationIdToData(context) {
        if(context.data && context.params.route.applicationId) {
            context.data.applicationId = context.params.route.applicationId
        }
    }
    app.service("/applications/:applicationId/policies").hooks({
        before: {
            find: [
                function(context) {
                    // logger.info("get application policies hook")
                    context.params.query.applicationId = context.params.route.applicationId
                },
            ],
            create: [mapApplicationIdToData],
            update: [mapApplicationIdToData],
            patch: [mapApplicationIdToData],
        },
    })
  
    app.use("/users/:userId/policies", policiesService)
    function mapUserIdToData(context) {
        if(context.data && context.params.route.userId) {
            context.data.userId = context.params.route.userId
        }
    }
    app.service("/users/:userId/policies").hooks({
        // maybe check not implemented
        before: {
            find: [
                // checkUserAccess,
                async function(context) {
                    // logger.info("before find user policies hook")
                    // logger.info(JSON.stringify(context))
                    const usersService = context.app.service("users")
                    const userId  = context.params.userId
                    return usersService.get(userId).then(userResult => {
                        // logger.info("after patch current user")
                        // logger.info(JSON.stringify(userResult))
                        context.result = {
                            policies: userResult.data[0].policies,
                        }
                        return context
                    })
                },
            ],
            create: [mapUserIdToData],
            update: [mapUserIdToData],
            patch: [mapUserIdToData],
        },
        after : {
            find: [
                function(context) {
                    // return what frontend expects to get
                    // logger.info("after find user policies hook")
                    // logger.info(JSON.stringify(context))
                    const policiesResult = context.result
                    context.result = {
                        policies: [ ...policiesResult.data],
                    }
                },
            ],
        },
    })
  
    // Get our initialized service so that we can register hooks
    const service = app.service("policies")

    service.hooks(hooks)
}
