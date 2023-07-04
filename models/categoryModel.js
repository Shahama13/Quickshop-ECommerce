import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter name"],
        unique: true
    },
    slug:{
        type:String,
        lowercase:true,
    }
})
export const Category = mongoose.model("category", categorySchema)
