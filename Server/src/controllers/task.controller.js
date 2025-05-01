import mongoose from "mongoose"
import Task from "../models/task.model.js"
import ApiResponse from "../utils/ApiResponse.js"

const createTask = async (req, res) => {
    try {
        const { projectId } = req.params
        if (!mongoose.Types.ObjectId(projectId)) {
            return res.status(400).json(new ApiResponse(400, null, 'Invalid project Id'))
        }
        const { title, description, status } = req.body

        const newTask = await Task.create({
            title,
            description,
            status,
            project: projectId
        })

        return res.status(201).json(new ApiResponse(201, newTask, 'Task created'))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, 'Error creating task'))
    }
}


const getTasksForProject = async (req, res) => {
    try {
        const { projectId } = req.params
        if (!mongoose.Types.ObjectId(projectId)) {
            return res.status(400).json(new ApiResponse(400, null, 'Invalid project Id'))
        }
        const tasks = await Task.find({ project: projectId })

        return res.status(200).json(new ApiResponse(200, tasks, 'Tasks fetched'))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, 'Error fetching tasks'))
    }
}

const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params
        const { status } = req.body
        if (!mongoose.Types.ObjectId(taskId)) {
            return res.status(400).json(new ApiResponse(400, null, 'Invalid task Id'))
        }

        if (!["in-progress", "done"].includes(status)) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid status"))
        }

        const task = await Task.findByIdAndUpdate(taskId, status, { new: true })
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
        if (!mongoose.Types.ObjectId(taskId)) {
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

export {createTask, getTasksForProject, updateTask, deleteTask}