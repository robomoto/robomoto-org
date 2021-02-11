const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema({
    degree: {
        type: String,
        enum: ['Associate of Arts and Sciences', 'Bachelor of Arts', 'Bachelor of Science', 'Master of Business Administration']
    },
    school: {
        type: String,
        enum: ['Wenatchee Valley College', 'Western Washington University', 'Seattle University - Albers School of Business and Economics', 'Oregon State University']
    },
    classes: {
        type: [String]
    },
    gradYear: {
        type: Number
    }
});

const Degree = mongoose.model('Degree', degreeSchema);

module.exports = Degree;