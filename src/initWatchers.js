const logger = require("./logger")
const MongoClient = require("mongodb").MongoClient

module.exports = function(app) {
    const mongoConnection = app.get("mongodb")
    
    app.deletedPolicies = {}

    // https://docs.mongodb.com/manual/changeStreams/
    // https://docs.mongodb.com/manual/reference/change-events/
    MongoClient
        .connect(mongoConnection, { useNewUrlParser: true })
        .then(client => {
            logger.info("Connected correctly to MongoDB server")
            const db = client.db(app.get("mongodbName"))
            
            // users
            const usersCollection = db.collection(app.get("mongodbUsersCollection"))
            const usersStream = usersCollection.watch({ fullDocument: "updateLookup" })
            usersStream.on("change", function(change) {
                // logger.info("change happened on users stream")
                // logger.info("of type: " + change.operationType)
                // logger.info("on document with id: " + change.documentKey._id)
                
                if (change.operationType === "insert") {
                    const user = change.fullDocument
                    app.handleUserCreate(user._id, user.policies)
                }
            })

            // policies
            const policiesCollection = db.collection(app.get("mongodbPoliciesCollection"))
            const policiesStream = policiesCollection.watch({ fullDocument: "updateLookup" })
            policiesStream.on("change", async function(change) {
                // logger.info("change happened on policies stream")
                // logger.info("of type:" + change.operationType)
                // logger.info("on document with id:" + change.documentKey._id)
                if (change.operationType === "delete") {
                    const deletedPolicy = change.fullDocument
                    const deletedPolicyId = change.documentKey._id
                    
                    app.deletedPolicies[deletedPolicyId] = deletedPolicy

                    // remove the reference to this policy from the applications
                    const applicationsService = app.service("applications")
                    
                    const filteredApplications = await applicationsService.find({
                        query: {
                            policies: { $in: [ deletedPolicyId ] },
                        },
                    })
                    filteredApplications.applications.forEach((application) => {
                        applicationsService.patch(application._id, {
                            policies: application.policies.filter(policyId => policyId !== deletedPolicyId),
                        }).err(e => {
                            logger.error(JSON.stringify(e))
                        })    
                    })

                    // remove the reference to this policy from the users     
                    const usersService = app.service("users")
                    const filteredUsers = await usersService.find({
                        query: {
                            policies: { $in: [ deletedPolicyId ] },
                        },
                    })
                    filteredUsers.users.forEach((user) => {
                        usersService.patch(user._id, {
                            policies: user.policies.filter(policyId => policyId !== deletedPolicyId),
                        }).err(e => {
                            logger.error(JSON.stringify(e))
                        })
                    })
                }
            })
        })
}
