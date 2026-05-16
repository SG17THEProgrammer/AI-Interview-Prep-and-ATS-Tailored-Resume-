const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    intention: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, { _id: false });

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    intention: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, { _id: false });

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: true
    }
}, { _id: false });

const resumeChangeSchema = new mongoose.Schema({
    before: {
        type: String,
        required: true
    },
    after: {
        type: String,
        required: true
    }
}, { _id: false });

const fitSchema = new mongoose.Schema({
    matches: [String],
    gaps: [String]
}, { _id: false });

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: true
    },
    focus: {
        type: String,
        required: true
    },
    tasks: {
        type: [String],
        required: true
    }
}, { _id: false });

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: true
    },
    resume: String,
    selfDescription: String,

    title: {
        type: String,
        required: true
    },

    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },

    decision: {
        type: String,
        enum: ["APPLY", "SKIP" , "MAYBE"]
    },

    fit: fitSchema,

    resumeChanges: [resumeChangeSchema],

    criticalGaps: [String],

    technicalQuestions: [technicalQuestionSchema],

    behavioralQuestions: [behavioralQuestionSchema],

    skillGaps: [skillGapSchema],

    preparationPlan: [preparationPlanSchema],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
}, {
    timestamps: true
});

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;