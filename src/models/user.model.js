// user-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get("mongooseClient")
    const { Schema } = mongooseClient
    const user = new Schema({
        _id: { type: Schema.Types.ObjectId, required: false, auto: true }, // internal mongodb id
        id: { type: String, required: true }, // keycloak id
        preferred_username: { type: String, required: true },
        email_verified: { type: Boolean, required: false },
        policies: [{ type: Schema.Types.ObjectId, ref: "policy" }],
    }, {
        timestamps: true,
    })

    return mongooseClient.model("user", user)
}
