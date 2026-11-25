import redis from "../../../shared/redis/redis.js"
import { Project } from "../models/project.model.js"
// import { deductCredtisProject } from "../utils/deductCredits.js"

export const createProjectController = async (req, res) => {
    try {

        const {
            name,
            description
        } = req.body

        const userID = req.headers["x-user-id"]

        //delete redis
        const key = `project-${userID}`

        //delete the redis project with new add the latest project addition
        await redis.del(key)

        if (!userID) {
            return res.status(400).json({ message: `UserId is required!` })
        }

        const projectList = await Project.create({
            owner: userID,
            name,
            description
        })

        // await deductCredtisProject({ userId: userID, amount: 10 })

        return res.status(200).json(projectList)
    } catch (error) {
        return res.status(500).json({ message: `Create project getting error ${erorr}` })
    }
}

//Get All projects
export const getProjectController = async (req, res) => {
    try {

        const userID = req.headers["x-user-id"]

        if (!userID) {
            return res.status(400).json({ message: `UserId is required!` })
        }

        //redis key create
        const key = `project-${userID}`

        let results = await redis.get(key)

        if (results) {
            return res.status(200).json(JSON.parse(results))
        }

        //Get all created projects
        const projectList = await Project.find({
            owner: userID
        }).sort({ updatedAt: -1 })

        // redis store
        await redis.set(key, JSON.stringify(projectList))


        return res.status(200).json(projectList)
    } catch (error) {
        return res.status(500).json({ message: `Get project getting error ${erorr}` })
    }
}


//Get specific project by project id
export const getProjectByIdController = async (req, res) => {
    try {

        const { id } = req.params

        //Get specific project by id
        const getProjectbyId = await Project.findById(id)
        getProjectbyId.lastOpenedAt = new Date()
        await getProjectbyId.save()

        return res.status(200).json(getProjectbyId)
    } catch (error) {
        return res.status(500).json({ message: `Get specific project getting error ${erorr}` })
    }
}

//Get all starred project
export const getAllStarredPorjectController = async (req, res) => {
    try {
        const userID = req.headers["x-user-id"]

        if (!userID) {
            return res.status(401).json({ message: "UserId is required!" })
        }

        const key = `starred-projects-${userID}`

        // 1. Try the cache first
        const cached = await redis.get(key)
        if (cached) {
            return res.status(200).json(JSON.parse(cached))
        }

        // 2. Cache miss: read from MongoDB
        const starredProjects = await Project.find({
            owner: userID,
            starred: true
        }).sort({ updatedAt: -1 })

        console.log('starredProjects', starredProjects)
        // 3. Store in Redis with an expiry (ioredis syntax)
        await redis.set(key, JSON.stringify(starredProjects), "EX", 3600)

        // An empty array is a valid result, not an error
        return res.status(200).json(starredProjects)

    } catch (error) {
        return res.status(500).json({ message: `Starred projects list getting error ${error.message}` })
    }
}

//Toggels Starres project
export const toggleStarreProjectController = async (req, res) => {
    try {
        //this userID come from middleware and call the proxyWithheader function
        const userID = req.headers["x-user-id"]
        if (!userID) {
            return res.status(401).json({ message: "UserId not found!" })
        }

        const { projectid } = req.params;
        console.log('toggleStarreProjectController project id', projectid)
        const project = await Project.findById(projectid)
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        project.starred = project.starred ? false : true

        console.log('project', project)

        await project.save()

        //delete redis
        const key = `starred-projects-${userID}`
        await redis.del(key)

        const projectkey = `project-${userID}`
        await redis.del(projectkey)

        // const cached = await redis.get(projectkey)

        // if (cached) {
        //     const projects = JSON.parse(cached).map(p =>
        //         p._id === projectid ? { ...p, starred: project.starred } : p
        //     )
        //     await redis.set(projectkey, JSON.stringify(projects))
        // }

        return res.status(200).json(project)

    } catch (error) {
        return res.status(500).json({
            message: `Starred project toggle function getting error ${error}`
        })
    }
}

//DELETE PRoject
export const deleteProjectController = async (req, res) => {
    try {

        const userID = req.headers["x-user-id"]
        if (!userID) {
            return res.status(401).json({ message: "UserId not found!" })
        }

        const { projectid } = req.params


        const project = await Project.findByIdAndDelete(projectid)
        if (!project) {
            return res.status(400).json({
                message: "Project not found"
            })
        }

        //delete redis
        const key = `project-${userID}`
        await redis.del(key)

        //delete start data
        const starkey = `starred-projects-${userID}`
        await redis.del(starkey)

        return res.status(200).json({
            message: "Project deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({ message: `Delete project getting error ${error}` })
    }
}