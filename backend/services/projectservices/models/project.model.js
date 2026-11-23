import mongoose from "mongoose";


const projectSchema = new mongoose.Schema({
    // who created this project then owner
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    starred: {
        type: Boolean,
        default: false
    },
    lastOpenedAt: {
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true
})


export const Project = mongoose.model('Project', projectSchema)