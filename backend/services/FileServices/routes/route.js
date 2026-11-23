import express from 'express'
import { createFile, createFolder, createRootFolder, DeleteFile, getFile, getTree, UpdateFile } from '../controller/file.controller.js'
const router = express.Router()
router.post('/create-root-folder', createRootFolder)
router.post('/create-folder', createFolder)
router.post('/create-file', createFile)
router.put('/update-file/:id', UpdateFile)
// router.put('/delete-file/:id', DeleteFile)
router.delete('/delete-file/:id', DeleteFile)

router.get('/get-file-byid/:id', getFile)
router.get('/get-tree-byid/:projectId', getTree)
export default router