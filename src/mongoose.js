const mongoose = require("mongoose")
const logger = require("./logger")
function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

module.exports = function (app) {
    const mongoConnection = app.get("mongodb")
    
    // define the mongo connection options
    const options = {
        useCreateIndex: true,
        useNewUrlParser: true,
    }
    // some extra config if we're dealing with a replica set
    if (isReplicaConnection(mongoConnection)) {
        options.auto_reconnect = false
        options.native_parser = true
        options.poolSize = 5
    }
    mongoose.connect(mongoConnection, options)
        .catch(async (e) => {
        logger.error("Could not connect to MongoDB through Mongoose, exiting in 10 seconds.")
        await sleep(10000)
        process.exit(1)
    })

    mongoose.Promise = global.Promise

    app.set("mongooseClient", mongoose)
}

const isReplicaConnection = (connectionString) => {
    return connectionString.indexOf("replicaSet") > -1
}
