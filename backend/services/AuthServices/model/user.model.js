import mongoose from "mongoose";

const userAuthSchema = new mongoose.Schema({
    firbaseUid: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowerCase: true
    },
    avatar: {
        type: String,
        default: ''
    },
    credits: {
        type: Number,
        default: 100,
        min: 0
    }
}, {
    timestamps: true
})


export const User = mongoose.model("User", userAuthSchema)
