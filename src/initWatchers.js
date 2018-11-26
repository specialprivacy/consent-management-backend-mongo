const MongoClient = require("mongodb").MongoClient

module.exports = function(app) {
    const mongoConnection = app.get("mongodb")

    // https://docs.mongodb.com/manual/changeStreams/
    // https://docs.mongodb.com/manual/reference/change-events/
    MongoClient
        .connect(mongoConnection, { useNewUrlParser: true })
        .then(client => {
            console.log("Connected correctly to server")
            const db = client.db(app.get("mongodbName"))

            // applications
            const applicationsCollection = db.collection(app.get("mongodbApplicationsCollection"))
            const applicationsStream = applicationsCollection.watch({ fullDocument: "updateLookup" })
            applicationsStream.on("change", function(change) {
                console.log("change happened on applications stream")
                console.log(change)
            })
            
            // subjects
            const subjectsCollection = db.collection(app.get("mongodbSubjectsCollection"))
            const subjectsStream = subjectsCollection.watch({ fullDocument: "updateLookup" })
            subjectsStream.on("change", function(change) {
                console.log("change happened on subjects stream")
                console.log(change)
            })

            // policies
            const policiesCollection = db.collection(app.get("mongodbPoliciesCollection"))
            const policiesStream = policiesCollection.watch({ fullDocument: "updateLookup" })
            policiesStream.on("change", function(change) {
                console.log("change happened on policies stream")
                console.log(change)
            })
        })
}

