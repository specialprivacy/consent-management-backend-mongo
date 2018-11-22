// Initializes the `policies` service on path `/policies`
const createService = require("feathers-mongoose")
const createModel = require("../../models/policy.model")
const hooks = require("./policies.hooks")

module.exports = function (app) {
    const Model = createModel(app)
    const paginate = app.get("paginate")

    const options = {
        Model,
        paginate
    }

    // Initialize our service with any options it requires
    const policiesService = createService(options)
  
    // Get our initialized service so that we can register hooks
    const service = app.service("policies")

    service.hooks(hooks)
}
