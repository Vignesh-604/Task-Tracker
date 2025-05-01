import { Schema, model } from "mongoose"

const taskSchema = new Schema({
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    title: String,
    description: String,
    status: {
        type: String,
        enum: ["todo", "in-progress", "done"],
        default: "todo"
    },
}, { timestamps: true }
)

const Task = model("Task", taskSchema)
export default Task