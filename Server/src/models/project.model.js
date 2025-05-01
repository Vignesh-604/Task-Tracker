import { Schema, model } from "mongoose"

const projectSchema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    title: { 
        type: String, 
        unique: true 
    },
    description: { 
        type: String, 
        unique: true 
    },
    tasks: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Task" 
    }]
}, { timestamps: true }
)

const Project = model("Project", projectSchema)
export default Project