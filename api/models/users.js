const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
      type: String,
      required: true,
      createIndexes: true,
      match: /[^\s]*@[a-z0-9.-]*/i
    },
    password: { type: String, required: true },
    roles: Array(String),
    profile: {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        address: { type: String, default: 'Not given' }
    },
    kyc: { type: Boolean, default: false }
});

module.exports = mongoose.model('Users', userSchema);
