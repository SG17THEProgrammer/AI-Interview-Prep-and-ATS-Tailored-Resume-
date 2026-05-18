const fs = require("fs/promises")
const path = require("path")
const canvas = require("@napi-rs/canvas");

global.DOMMatrix = canvas.DOMMatrix;
global.ImageData = canvas.ImageData;
global.Path2D = canvas.Path2D;

const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

const axios = require("axios")

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */


async function generateInterViewReportController(req, res) {

    try {

        const { selfDescription, jobDescription } = req.body

        let resumeText = ""

        // CASE 1 → New uploaded file
        if (req.file) {

            const resumeContent =
                await (
                    new pdfParse.PDFParse(
                        Uint8Array.from(req.file.buffer)
                    )
                ).getText()

            resumeText = resumeContent.text
        }

        // CASE 2 → Existing stored resume
        else if (req.user.resume) {

            const response =
                await axios.get(
                    req.user.resume,
                    {
                        responseType:
                            "arraybuffer"
                    }
                )

            const resumeContent =
                await (
                    new pdfParse.PDFParse(
                        Uint8Array.from(
                            response.data
                        )
                    )
                ).getText()

            resumeText =
                resumeContent.text
        }

        // NO resume anywhere
        else if (!selfDescription) {

            return res.status(400).json({
                message:
                    "Resume or self description required"
            })
        }

        // AI call
        const aiResponse =
            await generateInterviewReport({
                resume: resumeText,
                selfDescription,
                jobDescription
            })

        const dbPayload = {

            user: req.user.id,

            resume: resumeText,

            selfDescription,

            jobDescription,

            title: aiResponse.title,

            matchScore: aiResponse.matchScore,

            decision: aiResponse.decision,

            fit: aiResponse.fit,

            resumeChanges:
                aiResponse.resumeChanges,

            criticalGaps:
                aiResponse.criticalGaps,

            technicalQuestions:
                aiResponse.technicalQuestions,

            behavioralQuestions:
                aiResponse.behavioralQuestions,

            skillGaps:
                aiResponse.skillGaps,

            preparationPlan:
                aiResponse.preparationPlan
        }

        const interviewReport =
            await interviewReportModel.create(
                dbPayload
            )

        return res.status(201).json({
            message:
                "Interview report generated successfully.",
            interviewReport
        })

    } catch (error) {

        console.error(
            "Interview report error:",
            error
        )

        return res.status(500).json({
            message:
                "Failed to generate interview report",
            error: error.message
        })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 })

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }