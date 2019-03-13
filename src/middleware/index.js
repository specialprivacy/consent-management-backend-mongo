const cookieParser = require("cookie-parser")
const crypto = require("crypto")
const { FORBIDDEN } = require("http-status-codes")
const querystring = require("querystring")
const request = require("request-promise-native")
const session = require("express-session")

const APIError = require("../util/api-error")
const logger = require("../logger")

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
    // Add your custom middleware here. Remember that
    // in Express, the order matters.

    const baseAuthURL = "https://demonstrator-special.tenforce.com/auth/realms/special/protocol/openid-connect/auth"
    // const baseAuthURL = process.env["AUTH_LOGIN_ENDPOINT"] || "https://demonstrator-special.tenforce.com/auth/realms/special/protocol/openid-connect/auth"
    const clientId = process.env["AUTH_CLIENT_ID"] || "special-platform"
    const clientSecret = "84be2f39-35dd-4976-89db-57285eadf30e"
    // const clientSecret = process.env["AUTH_CLIENT_SECRET"] || "special-platform-secret"
    const redirectUri = process.env["SERVER_AUTH_CALLBACK_ENDPOINT"] || "consent-management-backend-mongo:3030/callback"
    const sessionSecret = process.env["SESSION_SECRET"] || crypto.randomBytes(20).toString("hex")
    // const tokenUri = process.env["AUTH_TOKEN_ENDPOINT"] || "https://demonstrator-special.tenforce.com/auth/realms/special/protocol/openid-connect/token"
    const tokenUri = "https://demonstrator-special.tenforce.com/auth/realms/special/protocol/openid-connect/token"
    // const userInfoUri = process.env["AUTH_USERINFO_ENDPOINT"] || "https://demonstrator-special.tenforce.com/auth/realms/special/protocol/openid-connect/userinfo"
    const userInfoUri = "https://demonstrator-special.tenforce.com/auth/realms/special/protocol/openid-connect/userinfo"
    
    app.use(session({
        resave: false,
        secret: sessionSecret,
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
    
    // app.get("/users/current", cookieParser(), (req, res, next) => {
    //     if (req.session.authenticated) {
    //         return next()
    //     }
    //    
    //     if (!req.session.nonce) {
    //         req.session.nonce = crypto.randomBytes(20).toString("hex")
    //     }
    //    
    //     const state = {
    //         "nonce": req.session.nonce,
    //         // The original request path, we will redirect to it after the authentication
    //         "referer": req.header("Referer"),
    //     }
    //     const options = {
    //         "scope": "all openid",
    //         "response_type": "code",
    //         "client_id": clientId,
    //         "redirect_uri": redirectUri,
    //         "state": Buffer.from(JSON.stringify(state)).toString("base64"),
    //     }
    //     let authRedirect = `${baseAuthURL}?${querystring.stringify(options)}`
    //     return res.redirect(401, authRedirect)
    // })
    
    // app.get("/callback", async (req, res, next) => {
    //     // To mitigate CSRF attacks, we ensure that the extra parameter we created when redirecting is the same as the one we received
    //     const state = JSON.parse(Buffer.from(req.query.state, "base64"))
    //     if (state.nonce !== req.session.nonce) {
    //         return next(new APIError({ statusCode: FORBIDDEN, detail: "Unknown state" }))
    //     }
    //    
    //     // Get token
    //     const authCode = req.query.code
    //
    //     const tokenRequestOptions = {
    //         "uri": tokenUri,
    //         "method": "POST",
    //         "content-type": "application/x-www-form-urlencoded",
    //         "form": {
    //             "client_id": clientId,
    //             "client_secret": clientSecret,
    //             "code": authCode,
    //             "grant_type": "authorization_code",
    //             "redirect_uri": redirectUri,
    //         },
    //         "json": true,
    //     }
    //    
    //     request(tokenRequestOptions)
    //         .then(tokenResponse => {
    //             const accessToken = tokenResponse["access_token"]
    //             // We've obtained our access token, we now need to use it to get the user information
    //             const clientServerOptions = {
    //                 "uri": userInfoUri,
    //                 "method": "GET",
    //                 "content-type": "application/x-www-form-urlencoded",
    //                 "headers": {
    //                     "Authorization": "Bearer " + accessToken,
    //                 },
    //                 "json": true,
    //             }
    //             return request(clientServerOptions)
    //         })
    //         .then(userInfoResponse => {
    //             // if we use correctly the models and the services
    //             // I think we will be able to do this in a different
    //             // and cleaner way
    //             userInfoResponse["id"] = userInfoResponse["sub"]
    //             delete userInfoResponse["sub"]
    //             return userInfoResponse
    //         })
    //         .then(user => {
    //             // We update the users table with the logged in user
    //             // if he didn't exist yet, we give him an empty set of policies
    //             // if he existed, we just update his other information
    //            
    //             // https://stackoverflow.com/questions/7267102/how-do-i-update-upsert-a-document-in-mongoose
    //             // logger.info("before save and stuff")
    //             // logger.info(JSON.stringify(user))
    //             const service = app.service("users")
    //             service.find({ query: { id: user.id }}).then(result => {
    //                 // logger.info("result find by id")
    //                 // logger.info(JSON.stringify(result))
    //                 if (result.users.length === 0) {
    //                     // user did not exist yet
    //                     // save with empty set of policies
    //                     // logger.info("auth user create new")
    //                     service.create({ ...user, _id: user.id }).then(result => {
    //                         // logger.info("after create")
    //                         // logger.info(JSON.stringify(result))
    //                         req.session.user = user
    //                         req.session.authenticated = true
    //                         res.redirect(state.referer)
    //                         return user
    //                     })
    //                 } else if (result.users.length === 1) {
    //                     // user already existed
    //                     // update info just received
    //                     // logger.info("auth user update")
    //                     service.patch(result.users[0]._id, { ...user }).then(() => {
    //                         // logger.info("after patch")
    //                         // logger.info(JSON.stringify(result))
    //                         req.session.user = user
    //                         req.session.authenticated = true
    //                         res.redirect(state.referer)
    //                         return user
    //                     })
    //                 } else {
    //                     logger.info(`more than 1 user found with the same id: ${user.id}`)
    //                 }
    //             })
    //         })
    //         .catch(error => {
    //             logger.info("error callback")
    //             logger.info(JSON.stringify(error))
    //         })
    // })

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
