// Initializes the `policies` service on path `/policies`
const createService = require("feathers-mongoose")
const createModel = require("../../models/policy.model")
const hooks = require("./policies.hooks")

module.exports = function (app) {
    const Model = createModel(app)
    const paginate = app.get("paginate")

    const options = {
        Model,
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
        before: {
            find: [
                function(context) {
                    context.params.query.userId = context.params.route.userId
                },
            ],
            create: [mapUserIdToData],
            update: [mapUserIdToData],
            patch: [mapUserIdToData],
        },
    })
  
    // Get our initialized service so that we can register hooks
    const service = app.service("policies")

    service.hooks(hooks)
}
