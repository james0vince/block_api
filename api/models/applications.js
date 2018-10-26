const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    created_at: { type: Number, required: true },
    type: { type: String, required: true },
    api_key: { type: String, required: true },
    api_secret: { type: String, required: true },
    users: { type: Array(mongoose.Schema.Types.ObjectId), required: true },
});

module.exports = mongoose.model('Application', applicationSchema);
