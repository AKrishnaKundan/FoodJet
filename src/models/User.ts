import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    email_verified: {type: Boolean, required: true, default: false},
    verification_token: {type: String, required: true},
    verification_token_time: {type: Date, required: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    type: {type: String, required: true},
    status: {type: String, required: true},
    createdAt: {type: Date, required: true, default: new Date()},
    updatedAt: {type: Date, required: true, default: new Date()}
}) 

export const User = mongoose.model("users", userSchema);


