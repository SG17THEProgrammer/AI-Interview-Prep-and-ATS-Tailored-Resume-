const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
// const connectToDB = require("./config/database")

const app = express()

// connectToDB()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use("/uploads", express.static("uploads"))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")
const userRouter = require("./routes/user.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/user", userRouter)

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the AI Resume Builder API"
    })
})




module.exports = app