// application-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get("mongooseClient")
    const { Schema } = mongooseClient
    const application = new Schema({
        _id: { type: String, required: true, auto: false },
        id: { type: String, required: true },
        name : { type: String, required: true },
        policies: [{ type: String, ref: "policy" }],
    }, {
        timestamps: true,
    })

    return mongooseClient.model("application", application)
}
