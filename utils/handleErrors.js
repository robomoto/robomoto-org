const AppError = require('AppError');

const handleCastError = err => {
    console.dir(err);
    return new AppError(`Cast Failed...${err.message}`, 500);
}

const handleDivergentArrayError = err => {
    console.dir(err);
    return new AppError(`Divergent Array Error...${err.message}`, 500);
}
const handleDocumentNotFoundError = err => {
    console.dir(err);
    return new AppError(`Document could not be found...${err.message}`, 500);
}
const handleMissingSchemaError = err => {
    console.dir(err);
    return new AppError(`Schema cound not be found...${err.message}`, 500);
}
const handleOverwriteModelError = err => {
    console.dir(err);
    return new AppError(`Overwrite Model Failed...${err.message}`, 500);
}
const handleParallelSaveError = err => {
    console.dir(err);
    return new AppError(`Parallel Save Failed...${err.message}`, 500);
}
const handleStrictModeError = err => {
    console.dir(err);
    return new AppError(`Strict Mode related Failure...${err.message}`, 500);
}
const handleValidationError = err => {
    console.dir(err);
    return new AppError(`Validation Failed...${err.message}`, 500);
}
const handleValidatorError = err => {
    console.dir(err);
    return new AppError(`Validator Failed...${err.message}`, 500);
}
const handleVersionError = err => {
    console.dir(err);
    return new AppError(`There was a version issue...${err.message}`, 500);
}
const handleMessagesError = err => {
    console.dir(err);
    return new AppError(`Message Error...${err.message}`, 500);
}
const handlePrototypeNameError = err => {
    console.dir(err);
    return new AppError(`Prototype Name Error...${err.message}`, 500);
}

let errorHandlers = [];

errorHandlers.push(handleCastError);
errorHandlers.push(handleDivergentArrayError);
errorHandlers.push(handleDocumentNotFoundError);
errorHandlers.push(handleMessagesError);
errorHandlers.push(handleMissingSchemaError);
errorHandlers.push(handleOverwriteModelError);
errorHandlers.push(handleParallelSaveError);
errorHandlers.push(handlePrototypeNameError);
errorHandlers.push(handleStrictModeError);
errorHandlers.push(handleValidationError);
errorHandlers.push(handleValidatorError);
errorHandlers.push(handleVersionError);

module.exports = errorHandlers;