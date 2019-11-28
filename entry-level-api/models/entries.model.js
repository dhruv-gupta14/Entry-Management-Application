// Include the mongoose library
const mongoose = require('mongoose');

// Create a schema for entry collection that wil hold following information as fields and types.
const EntrySchema = mongoose.Schema({
        visitor_name: String,
        visitor_phone: String,
        visitor_email: String,
        host_name: String,
        host_phone: String,
        host_email: String,
        check_in_time: {type: Date, default: Date.now},
        check_out_time: {type: Date}
    }, {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
        toObject: {getters: true, setters: true},
        toJSON: {getters: true, setters: true}
    }
);

module.exports = mongoose.model('Entry', EntrySchema);