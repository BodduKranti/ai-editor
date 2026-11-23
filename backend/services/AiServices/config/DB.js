import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
dotenv.config()

export const AiDbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log('Ai DB Connected successfully')
    } catch (error) {
        console.log('Ai Services DB Connection error')
    }
}