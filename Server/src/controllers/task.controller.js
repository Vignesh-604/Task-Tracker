import mongoose from "mongoose"
import Task from "../models/task.model.js"
import ApiResponse from "../utils/ApiResponse.js"

const createTask = async (req, res) => {

    const { projectId } = req.params
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json(new ApiResponse(400, null, 'Invalid project Id'))
    }
    const { title, description } = req.body
    
    const newTask = await Task.create({
        title,
        description,
        project: projectId
    })

    const tasks = await Task.find({ project: projectId })

    const userProjects = req.user?.projects
    const project = userProjects.filter(p => p._id.toString() === projectId)[0]

    return res.status(201).json(new ApiResponse(201, {project, tasks}, 'Task created'))
}


const getTasksForProject = async (req, res) => {

        const { projectId } = req.params
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json(new ApiResponse(400, null, 'Invalid project Id'))
        }
        const tasks = await Task.find({ project: projectId })

        const userProjects = req.user?.projects
        const project = userProjects.filter(p => p._id.toString() === projectId)[0]
        
        return res.status(200).json(new ApiResponse(200, {project, tasks}, 'Tasks fetched'))
}

const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params
        const { status } = req.body
        
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json(new ApiResponse(400, null, 'Invalid task Id'))
        }

        if (!["in-progress", "done"].includes(status)) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid status"))
        }

        const task = await Task.findByIdAndUpdate(taskId, {status}, { new: true })
        if (!task) {
            return res.status(404).json(new ApiResponse(404, null, 'Task not found'))
        }       
        return res.status(200).json(new ApiResponse(200, task, 'Task updated'))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, 'Error updating task'))
    }
}

const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json(new ApiResponse(400, null, 'Invalid task Id'))
        }

        const task = await Task.findByIdAndDelete(taskId)
        if (!task) {
            return res.status(404).json(new ApiResponse(404, null, 'Task not found'))
        }
        return res.status(200).json(new ApiResponse(200, task, 'Task deleted'))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, 'Error deleting task'))
    }
}

export { createTask, getTasksForProject, updateTask, deleteTask }