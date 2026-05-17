const userModel = require("../models/user.model")

async function uploadResumeController(req, res) {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Resume file required"
            })
        }

        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                resume: req.file.path.replace(/\\/g, "/"),
                resumeOriginalName: req.file.originalname
            },
            { returnDocument: "after" })

        console.log(user);

        res.status(200).json({
            message: "Resume uploaded successfully",
            resume: user.resume
        })

    } catch (err) {

        res.status(500).json({
            message: err.message
        })

    }
}

module.exports = {
    uploadResumeController
}