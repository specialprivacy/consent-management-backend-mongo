const APIError = require("../util/api-error")
const logger = require("../logger")

module.exports = function (context) {
    try {
        logger.info("check user access hook")
        // logger.info(JSON.stringify(context))
        // let reqId = req.params.id
        // let userId = req.session.user.id
        // if (reqId === "current") return userId
        // if (reqId === userId) return userId
        return Promise.resolve(context)
        // Not current and not the same, check
        // TODO: Check if admin
        // throw new APIError({ statusCode: 401, detail: "Not Authorized" })
    } catch (error) {
        throw new APIError({ statusCode: 401, detail: "Current user is not authorized to do this" })
    }
}