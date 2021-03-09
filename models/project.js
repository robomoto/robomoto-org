const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gitHubLink: {
        type: String
    },
    liveLink: {
        type: String
    },
    shortDescription: {
        type: String
    },
    description: {
        type: String
    },
    tags: {
        type: [String]
    },
    imgs: {
        type: [String]
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {strict: false})

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;