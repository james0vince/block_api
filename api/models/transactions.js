const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    recipient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    created_at: { type: Number, required: true },
    amount_fiat: { type: Number, required: true },
    amount_vox: { type: Number, required: true },
    description: { type: String, required: true },
    currency: { type: String, required: true }
});

module.exports = mongoose.model('Transaction', transactionSchema);
