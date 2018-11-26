// Initializes the `subjects` service on path `/subjects`
const createService = require("feathers-mongoose")
const createModel = require("../../models/subject.model")
const hooks = require("./subjects.hooks")

module.exports = function (app) {
    const Model = createModel(app)
    const paginate = app.get("paginate")

    const options = {
        Model,
        paginate,
    }

    // Initialize our service with any options it requires
    app.use("/subjects", createService(options))

    // Get our initialized service so that we can register hooks
    const service = app.service("subjects")

    service.hooks(hooks)
}
