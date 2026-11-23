import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()
const FILE_SERVICE_URL = process.env.FILE_SERVICE_URL


export const createFolder = async ({ projectId, name, parentId, userId }) => {
    try {
        const res = await axios.post(`${FILE_SERVICE_URL}/create-folder`, {
            projectId, name, parentId
        }, {
            headers: { 'x-user-id': String(userId) }
        })
        return res.data
    }
    catch (error) {
        console.log('Create Folder getting error', error)
        throw new Error(error)
    }
}

export const createFile = async ({ projectId, name, parentId, content = '', language = 'plaintext', userId }) => {
    try {
        const res = await axios.post(`${FILE_SERVICE_URL}/create-file`, {
            projectId,
            name,
            parentId,
            content,
            language
        }, {
            headers: { 'x-user-id': String(userId) }
        })
        return res.data
    }
    catch (error) {
        console.log('createFile getting error', error)
        throw new Error(error)
    }
}

export const UpdateFile = async ({ name, content, userId, id, }) => {
    try {
        const res = await axios.put(`${FILE_SERVICE_URL}/update-file/${id}`, {
            name,
            content,
        }, {
            headers: { 'x-user-id': String(userId) }
        })
        return res.data
    }
    catch (error) {
        console.log('UpdateFile getting error', error)
        throw new Error(error)
    }
}


export const DeleteFile = async ({ id, userId }) => {
    try {
        const res = await axios.delete(`${FILE_SERVICE_URL}/delete-file/${id}`, {

        }, {
            headers: { 'x-user-id': String(userId) }
        })
        return res.data
    }
    catch (error) {
        console.log('UpdateFile getting error', error)
        throw new Error(error)
    }
}



export const GetFile = async ({ id, userId }) => {
    try {
        const res = await axios.get(`${FILE_SERVICE_URL}/get-file-byid/${id}`, {
            headers: { 'x-user-id': String(userId) }
        })
        return res.data
    }
    catch (error) {
        console.log('UpdateFile getting error', error)
        throw new Error(error)
    }
}


export const GetTree = async ({ projectId, userId }) => {
    try {
        const res = await axios.get(`${FILE_SERVICE_URL}/get-tree-byid/${projectId}`, {
            headers: { 'x-user-id': String(userId) }
        })
        return res.data
    }
    catch (error) {
        console.log('UpdateFile getting error', error)
        throw new Error(error)
    }
}