import { tool } from '@langchain/core/tools'
import {
    createFile,
    createFolder,
    DeleteFile,
    GetFile,
    GetTree,
    UpdateFile
} from '../../utils/fetchFilesApis.js'
import z from 'zod/v3'

const compactTree = (items = []) => {
    return items.map((i) => {
        return {
            _id: i._id,
            parentId: i.parentId,
            name: i.name,
            language: i.language,
            type: i.type,
            extension: i.extension,
            children: compactTree(
                i.children || []
            )
        }
    })
}

export const FileTools = ({ projectId, userId }) => {

    //get Tree tool
    const getreeTool = tool(
        async () => {
            console.log("ai tool - get_tree")
            const result = await GetTree({ projectId, userId })
            const tree = compactTree(result)
            return JSON.stringify({
                success: true,
                tree
            })
        },
        {
            name: 'get_tree',
            description: `
                Get the complete project file and folder tree.

                IMPORTANT:
                
                1. Use this when the project structure is unknown.
                2. Do not repeatedly call get_tree.
                3. type="folder" means folder.
                4. type="file" means file.
                5. Folder IDs are used as parentId.
                6. NEVER call get_file with a folder ID.
                7. Do not use terminal commands to inspect the project.
                8. Use the exact IDs returned by this tool.

                The tree contains:
                _id
                parentId
                name
                type
                language
                extension
                children
            `,
            schema: z.object({})//no need to call any input parameter
        }
    )

    //get file tool
    const getFileTool = tool(
        async ({ fileId }) => {
            console.log("ai tool - get_File")
            const file = await GetFile({ id: fileId, userId })
            if (!file && file?.type !== 'file') {
                console.log('get:file blocked, id is folder')
                return JSON.stringify({
                    success: false,
                    error: 'The provided ID belongs to a folder, not a file.',
                    instruction: "Do not call get_file for get_folder. Use the folder ID as parentId"

                })
            }
            if (!file) {
                console.log("file not found")
                return JSON.stringify({
                    success: false,
                    error: "File not found"
                })
            }
            return JSON.stringify({
                success: true,
                file: {
                    _id: file._id,
                    name: file?.name,
                    content: file.content || '',
                    type: file?.type,
                    language: file?.language,
                    extension: file?.extension,
                    parentId: file?.parnentId
                }
            })
        },
        {
            name: 'get_file',
            description: `
                REad and ESISTING file before modifying it.

                STRICT RULES:
                
                1. FiledId must belong to a file.
                2. NEVER pass a folder ID.
                3. Use exact file ID from get_tree.
                4. call this before update_file.
                5. Do not call this for newly created files unless necessary.
                6. Do not call this repleatedly for the same file.

               The response contains the complete file content
            `,
            schema: z.object({
                fileId: z.string()
            })//no need to call any input parameter
        }
    )

    //get Folder tool
    const createFolderTool = tool(
        async ({ name, parentId }) => {
            console.log("ai tool - create_folder")
            const folder = await createFolder({ projectId, name, parentId, userId })

            return JSON.stringify({
                success: true,
                operation: "folder_created",
                folder: {
                    _id: folder._id,
                    name: folder?.name,
                    type: folder.type,
                    parentId: folder?.parnentId
                }
            })
        },
        {
            name: 'create_folder',
            description: `
                Create a new folder.

                RULES:

                1. Create parent folders first.
                2. Use exact parentId from get_tree.
                3. Never create dublicate folders.
                4. A folder directly inside another folder must use that folder's ID as parentId.
                5. After creation continue with the remaining files.
                6. Do not call te_tree again just to verify the folder.
            `,
            schema: z.object({
                name: z.string(),
                parentId: z.string().nullable()
            })//no need to call any input parameter
        }
    )


    //Create File tool
    const createFileTool = tool(
        async ({ name, parentId, content, language }) => {
            console.log("ai tool - create_file")
            const file = await createFile({
                projectId,
                name,
                parentId,
                content,
                language: language || 'plaintext', userId
            })

            return JSON.stringify({
                success: true,
                operation: "file_created",
                file: {
                    _id: file._id,
                    name: file?.name,
                    type: file.type,
                    content: file?.content,
                    language: file?.language,
                    parentId: file?.parnentId
                }
            })
        },
        {
            name: 'create_file',
            description: `
                Create a new FILE.

                RULES:

                1. Use get_tree firest when project structure is unknown.
                2. Use exact folder ID as parentId.
                3. Never create dublicate files.
                4. Send complete file content.
                5. Create folders before files inside them.
                6. Never use terminal commands to create files.
                7. Do not call get_file immediately after creteing a file.
                8. Continue creating all required files.
                9. Do not stop after creating only one file.

                For a React/Vite project, create ALL required files.

            `,
            schema: z.object({
                name: z.string(),
                parentId: z.string(),
                content: z.string(),
                language: z.string().optional()
            })//no need to call any input parameter
        }
    )

    //Update File tool
    const updateFileTool = tool(
        async ({ name, content, fileId }) => {
            console.log("ai tool - update_file")
            const file = await UpdateFile({
                name,
                content,
                userId,
                id: fileId
            })

            return JSON.stringify({
                success: true,
                operation: "file_updated",
                file: {
                    _id: file._id,
                    name: file?.name,
                    type: file.type,
                    content: file?.content,
                    language: file?.language,
                    parentId: file?.parnentId
                }
            })
        },
        {
            name: 'update_file',
            description: `
                Update an EXISTING FILE.

                RULES:

                1. Call get_file before updating.
                2. filed must be an actual file ID.
                3. NEVER use a folder ID.
                4. Send the complete update file content.
                5. Do not update files that do not exist.
                6. After successful update continue with remaining work.
                7. Do not call get_file agian unless another modification is needed.

            `,
            schema: z.object({
                name: z.string(),
                content: z.string(),
                fileId: z.string(),
            })//no need to call any input parameter
        }
    )


    //Delete File tool
    const deleteFileTool = tool(
        async ({ fileId }) => {
            console.log("ai tool - delete_file")
            const file = await DeleteFile({
                userId,
                id: fileId
            })

            return JSON.stringify({
                success: true,
                operation: "file_deleted",
                file: {
                    _id: file._id,
                    name: file?.name
                }
            })
        },
        {
            name: 'delete_file',
            description: `
                Delete an EXISTING FILE from the project.

                STRICT RULES:

                1. filedId must belong to an actual file.
                2. NEVER pass a folder ID.
                3. Use the exact file ID from get_tree.
                4. Before deleing, make sure the target is actually a file.
                5. Do not delete a file unless the user's request requires it.
                6. Never use terminal commands to delete files.
                8. Do not call get_files after deletion.
            `,
            schema: z.object({
                fileId: z.string(),
            })//no need to call any input parameter
        }
    )


    return [
        getreeTool,
        getFileTool,
        createFolderTool,
        createFileTool,
        updateFileTool,
        deleteFileTool
    ]

}