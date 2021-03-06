// Initializes the `applications` service on path `/applications`
const createService = require("feathers-mongoose")
const createModel = require("../../models/application.model")
const hooks = require("./applications.hooks")

module.exports = function (app) {
    const Model = createModel(app)
    const paginate = app.get("paginate")

    const options = {
        Model,
        multi: true,
        paginate,
    }

    // Initialize our service with any options it requires
    app.use("/applications", createService(options))

    // Get our initialized service so that we can register hooks
    const service = app.service("applications")

    service.hooks(hooks)
}
