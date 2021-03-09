const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema({
    degree: {
        type: String,
        enum: ['Associate of Arts and Sciences', 'Bachelor of Arts', 'Bachelor of Science', 'Master of Business Administration']
    },
    program: {
        type: String
    },
    school: {
        type: String,
        enum: ['Wenatchee Valley College', 'Western Washington University', 'Seattle University', 'Oregon State University']
    },
    classes: {
        type: [String]
    },
    gradYear: {
        type: Number
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { strict: false});

const Degree = mongoose.model('Degree', degreeSchema);

module.exports = Degree;