const mongoose = require("mongoose")

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
    
    mongoose.Promise = global.Promise

    app.set("mongooseClient", mongoose)
}

const isReplicaConnection = (connectionString) => {
    return connectionString.indexOf("replicaSet") > -1
}
