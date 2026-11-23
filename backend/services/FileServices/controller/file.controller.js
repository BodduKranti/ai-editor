import { File } from "../model/file.model.js"
import { buildTree } from "../utils/buildtree.js"

//Root Folder
export const createRootFolder = async (req, res) => {
    try {
        const { projectId, projectName } = req.body
        const userId = req.headers["x-user-id"]

        if (!projectId || !projectName) {
            return res.status(400).json({
                message: `Project name and Project is required`
            })
        }

        // find the existing root foler
        const existingRootfolder = await File.findOne({
            projectId,
            parentId: null,
            isDeleted: false
        })

        //Check the root folder already created
        if (existingRootfolder) {
            return res.status(400).json({ message: "Root folder already exist" })
        }

        //if root folder not created then create the root folder
        const rootFolder = await File.create({
            owner: userId,
            name: projectName,
            projectId,
            type: "folder",
            parentId: null
        })

        return res.status(200).json(rootFolder)


    } catch (error) {
        return res.status(500).json({
            message: `Create file getting ${error}`
        })
    }
}

//Create Folder
export const createFolder = async (req, res) => {
    try {
        const { projectId, name, parentId } = req.body
        const userId = req.headers['x-user-id']
        if (!projectId || !name || !parentId) {
            return res.status(400).json({ message: `ProjectID, Project name and ParentId required ` })
        }

        //is exist folder
        const exist = await File.findOne({
            name,
            projectId,
            parentId,
            isDeleted: false
        })

        if (exist) {
            return res.status(400).json({ mesasge: "Folder already exsit" })
        }

        const folder = await File.create({
            name,
            projectId,
            parentId,
            type: 'folder',
            owner: userId
        })


        return res.status(200).json(folder)


    } catch (error) {
        return res.status(500).json({
            message: `Create Folder getting ${error}`
        })
    }
}

//Create File
export const createFile = async (req, res) => {
    try {
        const { projectId, name, parentId, content = '', language = 'plaintext' } = req.body
        const userId = req.headers['x-user-id']
        if (!projectId || !name || !parentId) {
            return res.status(400).json({ message: `ProjectID, Project name and ParentId required ` })
        }

        //is exist folder
        const exist = await File.findOne({
            name,
            projectId,
            parentId,
            isDeleted: false
        })

        if (exist) {
            return res.status(400).json({ mesasge: "File already exsit" })
        }

        const extension = name?.includes(".") ? name?.split(".").pop() : ""

        const file = await File.create({
            name,
            projectId,
            parentId: parentId || null,
            type: 'file',
            owner: userId,
            language,
            content,
            extension,
            size: content?.length
        })


        return res.status(200).json(file)


    } catch (error) {
        return res.status(500).json({
            message: `Create File getting ${error}`
        })
    }
}

//update File
export const UpdateFile = async (req, res) => {
    try {
        const { name, content } = req.body
        const userId = req.headers['x-user-id']
        //is exist folder
        const file = await File.findOne({
            _id: req?.params?.id,
            owner: userId,
            isDeleted: false
        })

        if (!file) {
            return res.status(400).json({ mesasge: "File not found" })
        }


        if (name) {
            file.name = name
            const extension = name?.includes(".") ? name?.split(".").pop() : ""
            file.extension = extension
        }

        if (content !== undefined) {
            file.content = content
            file.size = content.length
        }

        // const file = await File.findByIdAndUpdate(req.params?._id, {
        //     name,
        //     projectId,
        //     parentId: parentId || null,
        //     type: 'file',
        //     owner: userId,
        //     language,
        //     content,
        //     extension,
        //     size: content?.length
        // })

        await file.save()

        return res.status(200).json(file)


    } catch (error) {
        return res.status(500).json({
            message: `Update File getting ${error}`
        })
    }
}

//Delete File
export const DeleteFile = async (req, res) => {
    try {

        const file = await File.findByIdAndUpdate(req?.params?.id, {
            isDeleted: true
        })

        return res.status(200).json(file)


    } catch (error) {
        return res.status(500).json({
            message: `Delete File getting ${error}`
        })
    }
}

//GET FILE
export const getFile = async (req, res) => {
    try {
        const userId = req.headers['x-user-id']

        //is exist folder
        const file = await File.findOne({
            _id: req?.params?.id,
            owner: userId,
            isDeleted: false
        })

        if (file) {
            return res.status(400).json({ mesasge: "File not found" })
        }

        return res.status(200).json(file)


    } catch (error) {
        return res.status(500).json({
            message: `File getting error ${error}`
        })
    }
}

//TREE BUILD
export const getTree = async (req, res) => {
    try {
        const userId = req.headers['x-user-id']
        const { projectId } = req.params

        //is exist folder
        const files = await File.find({
            projectId,
            owner: userId,
            isDeleted: false
        }).sort({
            name: 1,
            type: -1
        })


        //Tree

        const tree = await buildTree(files)
        console.log('tree', tree)


        return res.status(200).json(tree)


    } catch (error) {
        return res.status(500).json({
            message: `Get Tree error ${error}`
        })
    }
}