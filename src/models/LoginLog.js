const { Schema, model, Types } = require('mongoose');

const loginLogSchema = new Schema({
    user_id: { type: Types.ObjectId, ref: 'User' },
    ip_address: { type: String, required: true },
    user_agent: { type: String, required: true },
    login_time: { type: Date, default: Date.now },
    logout_time: { type: Date },
    session_duration: { type: Number }, 
    error_message: { type: String }, 
    mobile_number: { type: String }, 
    email: { type: String },
    status: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success'
    }
}, {
    timestamps: true
});

module.exports = model('LoginLog', loginLogSchema);