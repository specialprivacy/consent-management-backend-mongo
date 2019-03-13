const request = require("request-promise-native")
const session = require("express-session")

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
    // Add your custom middleware here. Remember that
    // in Express, the order matters.
    
    app.use(session({
        resave: false,
        saveUninitialized: false,
    }))

    app.use((req, res, next) => {
        // extract userObject from header
        // and make it available for subsequent logic
        if (request.headers) {
            req.feathers.userObject = getUserFromRequest(req)
        }

        // applicationId
        if (req.headers) {
            req.feathers.applicationId = req.headers["application-id"]
        }
        next()
    })
    
    const getUserFromRequest = (request) => {
        // extract user from x-userinfo header, added by Kong OIDC
        const encodedUserString = request.headers["x-userinfo"]
        const decodedUserString = Buffer.from(encodedUserString, "base64").toString("ascii")
        const userObject = JSON.parse(decodedUserString)

        // put id where we want it
        userObject["id"] = userObject["sub"]
        delete userObject["sub"]

        return userObject
    }
}
