const logger = require("./logger")
const MongoClient = require("mongodb").MongoClient

module.exports = function(app) {
    const mongoConnection = app.get("mongodb")
    
    const deletedPolicies = {} // xxx still necessary?
    
    // xxx remove the stream we do not need

    // https://docs.mongodb.com/manual/changeStreams/
    // https://docs.mongodb.com/manual/reference/change-events/
    MongoClient
        .connect(mongoConnection, { useNewUrlParser: true })
        .then(client => {
            logger.info("Connected correctly to server")
            const db = client.db(app.get("mongodbName"))

            // applications
            const applicationsCollection = db.collection(app.get("mongodbApplicationsCollection"))
            const applicationsStream = applicationsCollection.watch({ fullDocument: "updateLookup" })
            applicationsStream.on("change", function(change) {
                logger.info("change happened on applications stream")
                logger.info("of type:" + change.operationType)
                logger.info("on document with id:" + change.documentKey._id)
            })
            
            // users
            const usersCollection = db.collection(app.get("mongodbUsersCollection"))
            const usersStream = usersCollection.watch({ fullDocument: "updateLookup" })
            usersStream.on("change", function(change) {
                logger.info("change happened on users stream")
                logger.info("of type: " + change.operationType)
                logger.info("on document with id: " + change.documentKey._id)
                logger.info(JSON.stringify(change))
                logger.info("new document values: " + JSON.stringify(change.fullDocument))
            })

            // policies
            const policiesCollection = db.collection(app.get("mongodbPoliciesCollection"))
            const policiesStream = policiesCollection.watch({ fullDocument: "updateLookup" })
            policiesStream.on("change", async function(change) {
                logger.info("change happened on policies stream")
                logger.info("of type:" + change.operationType)
                logger.info("on document with id:" + change.documentKey._id)
                if (change.operationType === "delete") {
                    // logger.info("handle policy delete")
                    const deletedPolicy = change.fullDocument
                    const deletedPolicyId = change.documentKey._id
                    
                    deletedPolicies[deletedPolicyId] = deletedPolicy

                    // remove the reference to this policy from the applications
                    const applicationsService = app.service("applications")
                    // const allApplications = await applicationsService.find()
                    // logger.info("all applications")
                    // logger.info(JSON.stringify(allApplications))
                    const filteredApplications = await applicationsService.find({
                        query: {
                            policies: {
                                $in: [change.documentKey._id]
                            }
                        }
                    })
                    logger.info("filtered applications")
                    logger.info(JSON.stringify(filteredApplications))
                    filteredApplications.applications.forEach((application) => {
                        applicationsService.patch(application._id, {
                            policies: application.policies.filter(policyId => policyId !== deletedPolicyId)
                        }).err(e => {
                            logger.error(JSON.stringify(e))
                        })    
                    })

                    // remove the reference to this policy from the users     
                    const usersService = app.service("users")
                    // const allUsers = await usersService.find()
                    // logger.info("all users")
                    // logger.info(JSON.stringify(allUsers))
                    const filteredUsers = await usersService.find({
                        query: {
                            policies: {
                                $in: [change.documentKey._id]
                            }
                        }
                    })
                    
                    logger.info("filtered users")
                    logger.info(JSON.stringify(filteredUsers))
                    filteredUsers.users.forEach((user) => {
                        usersService.patch(user._id, {
                            policies: user.policies.filter(policyId => policyId !== deletedPolicyId)
                        }).err(e => {
                            logger.error(JSON.stringify(e))
                        })
                    })
                }
            })
        })
}

