const applications = require("./applications/applications.service.js");
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(applications);
};
