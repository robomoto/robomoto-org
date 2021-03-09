const Degree = require('../models/degree');

module.exports.index = async (req, res) => {
    const sort = {gradYear: -1};
    const degrees = await Degree.find({}).sort(sort);
    res.render("degrees/index", {degrees});
}