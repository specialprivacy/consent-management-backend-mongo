// subject-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get("mongooseClient")
    const { Schema } = mongooseClient
    const subject = new Schema({
        _id: { type: Schema.Types.ObjectId, required: false, auto: true },
        name: { type: String, required: true },
        policies: [{ type: Schema.Types.ObjectId, ref: "policy" }]
    }, {
        timestamps: true
    })

    return mongooseClient.model("subject", subject)
}
