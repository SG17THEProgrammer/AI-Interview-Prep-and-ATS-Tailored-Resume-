const express = require("express")
const router = express.Router()

const authMiddleware =
    require("../middlewares/auth.middleware")

const upload =
    require("../middlewares/file.middleware")

const userController =
    require("../controllers/user.controller")

router.post(
    "/upload-resume",
    authMiddleware.authUser,
    upload.single("resume"),
    userController.uploadResumeController
)

module.exports = router