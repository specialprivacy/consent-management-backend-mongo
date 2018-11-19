const applications = require("./applications/applications.service.js")
const policies = require("./policies/policies.service.js")
const subjects = require("./subjects/subjects.service.js")
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(applications)
  app.configure(policies)
  app.configure(subjects)
}
