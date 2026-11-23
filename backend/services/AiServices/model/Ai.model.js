import mongoose from "mongoose";


const AiSchema = new mongoose.Schema({

}, {
    timestamps: true
})


export const AI = mongoose.model("AI", AiSchema)