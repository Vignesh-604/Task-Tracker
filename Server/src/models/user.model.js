import { Schema, model } from "mongoose"
import bycrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    country: { type: String, required: true },
    refreshToken: String,
    projects: {
        type: [
            {
                title: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                    required: true
                }
            }
        ],
        validate: [arrayLimit, "{PATH} exceeds limit of 4"]
    }
})

function arrayLimit(value) {
    return value.length <= 4
}

userSchema.pre("save", async function (next){
    if (!this.isModified("password")) return next()

    this.password = await bycrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bycrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email, },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}


userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}

const User = model("User", userSchema)
export default User
