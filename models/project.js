const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_220')
})

const ProjectSchema = new mongoose.Schema({
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
    imgs: [ImageSchema],
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

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;