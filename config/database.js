import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((e) => {
        console.log(`Database Connected ${e.connection.host}`)
    }).catch((e) => {
        console.log(e.message)
    })
}

export default connectDB;