import express from "express";
import dotenv from "dotenv"
import connectDB from "./config/database.js";
import authRoutes from "./routes/authRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url";

dotenv.config();
connectDB();
export const app = express();


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, './frontend/build')))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/product', productRoutes)

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './frontend/build/index.html'))
});

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`server is working on http://localhost:${PORT} in ${process.env.DEV_MODE} mode`)
})


app.use(errorHandler)