import express from 'express'
import {
    createProjectController,
    deleteProjectController,
    getAllStarredPorjectController,
    getProjectByIdController,
    getProjectController,
    toggleStarreProjectController
} from '../controller/project.controller.js'
const projectroutes = express.Router()

// get all projects routes here
projectroutes.post("/create-project", createProjectController)
projectroutes.get("/getall-projects", getProjectController)
projectroutes.get("/get-allstarred-project", getAllStarredPorjectController)
projectroutes.get("/get-project-byid/:id", getProjectByIdController)
projectroutes.put("/project-star/:projectid", toggleStarreProjectController)
projectroutes.delete("/delete-project/:projectid", deleteProjectController)
export default projectroutes
