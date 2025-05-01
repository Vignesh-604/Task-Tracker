import {createTask, getTasksForProject, updateTask, deleteTask} from "../controllers/task.controller.js"
import {Router} from "express"
import verifyJWT from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/", verifyJWT, createTask)

router.get("/:projectId", verifyJWT, getTasksForProject)

router.put("/:taskId", verifyJWT, updateTask)

router.delete("/:taskId", verifyJWT, deleteTask)

export default router