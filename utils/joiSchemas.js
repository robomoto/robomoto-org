const Joi = require('joi');

module.exports.degreeSchema = Joi.object({
    degree: Joi.object({
        degree: Joi.string().required(),
        program: Joi.string().required(),
        school: Joi.string().required(),
        gradYear: Joi.number().required(),
        classes: Joi.string().empty(''),
    }).required()
})

module.exports.projectSchema = Joi.object({
    project: Joi.object({
        name: Joi.string().required(),
        shortDescription: Joi.string().required(),
        description: Joi.string().required(),
        gitHubLink: Joi.string().empty(''),
        liveLink: Joi.string().empty(''),
        tags: Joi.string().empty(''),
        image: Joi.string().empty(''),
    }).required(),
    deleteImages: Joi.array()
}) 

module.exports.userSchema = Joi.object({
    user: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email({minDomainSegments: 2}).required(),
        password: Joi.string().required()
    }).required()
})