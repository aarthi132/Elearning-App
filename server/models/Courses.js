const mongoose = require('mongoose'); // Ingayum kandippa venum

const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    videoUrl: String,
    pdfUrl: String
});

const CourseModel = mongoose.model("courses", CourseSchema);
module.exports = CourseModel;


