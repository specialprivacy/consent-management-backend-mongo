const authentication = require("@feathersjs/authentication")
const jwt = require("@feathersjs/authentication-jwt")
const oauth2 = require("@feathersjs/authentication-oauth2")
// const Auth0Strategy = require("passport-auth0")
const OpenIdConnectStrategy = require("passport-openid-connect").Strategy
const logger = require("./logger")

// https://alexbilbie.com/guide-to-oauth-2-grants/
// https://github.com/panva/node-openid-client
// https://www.npmjs.com/package/passport-openid-connect

module.exports = function (app) {
    const config = app.get("authentication")

    // Set up authentication with the secret
    app.configure(authentication(config))
    app.configure(jwt())

    app.configure(oauth2({
        name: "openIdConnect",
        Strategy: OpenIdConnectStrategy,
        issuerHost: "http://localhost/auth/realms/special/protocol/openid-connect/auth",
        clientID: process.env["AUTH_CLIENT_ID"] ||"special-platform",
        clientSecret: process.env["AUTH_CLIENT_SECRET"] || "special-platform-secret",
        scope:["all openid"],
        state: "test",
        callbackUri: "/callback",
        redirectUri: "/redirect",h
        successRedirect: "/success",
    }))
    
    //https://demonstrator-special.tenforce.com/auth/realms/special/protocol/openid-connect/auth
    // ?scope=all%20openid
    // &response_type=code
    // &client_id=special-platform
    // &redirect_uri=https%3A%2F%2Fdemonstrator-special.tenforce.com%2Fcallback
    // &state=eyJub25jZSI6ImRlMjg1ZTk4NjE5MDIwMTdiMTBjOWUxNmYwNGRlMGM1NzY0OTlhMzYiLCJyZWZlcmVyIjoiaHR0cHM6Ly9kZW1vbnN0cmF0b3Itc3BlY2lhbC50ZW5mb3JjZS5jb20vY29uc2VudC9jb25zZW50cyJ9

    // The `authentication` service is used to create a JWT.
    // The before `create` hook registers strategies that can be used
    // to create a new valid JWT (e.g. local or oauth2)
    app.service("authentication").hooks({
        before: {
            create: [
                // logger.info("authentication before create"),
                // authentication.hooks.authenticate("jwt"),
            ],
            remove: [
                // logger.info("authentication before remove"),
                // authentication.hooks.authenticate("jwt"),
            ],
        },
    })
}
