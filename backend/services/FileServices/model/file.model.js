import mongoose from "mongoose";


const fileSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // this indicate to found the file in which folder
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        default: null
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    //name indicates to File name
    name: {
        type: String,
        required: true
    },
    //Type indicated to  [foled or file]
    type: {
        type: String,
        enum: ["file", "folder"],
        required: true
    },
    //Extension indicates to file extension [.js,.ts,.tsx]
    extension: {
        type: String,
        default: ''
    },
    //langauge [javascript ,plain text]
    language: {
        type: String,
        default: "plaintext"
    },
    //content
    content: {
        type: String,
        default: "",
    },

    //File size
    size: {
        type: Number,
        default: 0
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export const File = mongoose.model("File", fileSchema)

