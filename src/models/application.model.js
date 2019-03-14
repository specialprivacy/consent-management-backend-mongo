const uuidv4 = require("uuid/v4")

// application-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get("mongooseClient")
    const { Schema } = mongooseClient
    const application = new Schema({
        _id: { type: String, required: false, default: uuidv4 },
        name : { type: String, required: true },
        policies: [ { type: String, ref: "policy" } ],
    }, {
        timestamps: false,
        versionKey: false,
    })

    return mongooseClient.model("application", application)
}
