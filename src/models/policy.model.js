// policy-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get("mongooseClient")
    const { Schema } = mongooseClient
    const policy = new Schema({
        _id: { type: Schema.Types.ObjectId, required: false, auto: true },
        dataCollection: { type: String, required: true },
        storageCollection: { type: String, required: true },
        processingCollection: { type: String, required: true },
        purposeCollection: { type: String, required: true },
        recipientCollection: { type: String, required: true },
        explanation: { type: String, required: true },
    }, {
        timestamps: true,
    })

    return mongooseClient.model("policy", policy)
}
