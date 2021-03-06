const uuidv4 = require("uuid/v4")

// user-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get("mongooseClient")
    const { Schema } = mongooseClient
    const user = new Schema({
        _id: { type: String, required: false, default: uuidv4 },
        preferred_username: { type: String, required: false },
        email_verified: { type: Boolean, required: false },
        policies: [ { type: String, ref: "policy" } ],
    }, {
        timestamps: false,
        versionKey: false,
    })
  
    return mongooseClient.model("user", user)
}
