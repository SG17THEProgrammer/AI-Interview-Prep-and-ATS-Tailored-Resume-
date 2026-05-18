const userModel = require("../models/user.model")
const cloudinary = require("../config/cloudinary")
const  streamifier = require( "streamifier")

async function uploadResumeController(req, res) {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Resume file required"
            })
        }

         const uploadResult = await new Promise(
            (resolve, reject) => {

                const stream =
                    cloudinary.uploader.upload_stream(
                        {
                            resource_type: "raw",
                            folder: "resumes"
                        },
                        (error, result) => {

                            if (error) reject(error)
                            else resolve(result)
                        }
                    )

                streamifier
                    .createReadStream(req.file.buffer)
                    .pipe(stream)
            }
        )

        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                resume: uploadResult.secure_url,
                resumeOriginalName: req.file.originalname
            },
            { returnDocument: "after" })


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