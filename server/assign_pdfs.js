const mongoose = require('mongoose');
const CourseModel = require('./models/Courses');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateGenericPdf(courseTitle, filename) {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50 });
        const filePath = path.join(__dirname, 'uploads', filename);
        doc.pipe(fs.createWriteStream(filePath));

        // Title Page
        doc.fontSize(36).fillColor('#4f46e5').text(courseTitle, { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).fillColor('#333333').text('LearnSphere Official Notes', { align: 'center' });
        doc.moveDown(4);

        // Course Content
        doc.addPage();
        doc.fontSize(24).fillColor('#222222').text(`Introduction to ${courseTitle}`);
        doc.moveDown(1);
        doc.fontSize(14).fillColor('#444444').text(
            `Welcome to the detailed notes for ${courseTitle}. This comprehensive guide provides all the fundamental concepts you need to master the subject.`
        );
        doc.moveDown(1);
        
        doc.fontSize(12).fillColor('#d946ef').text('Key Concepts Covered:');
        doc.moveDown(0.5);
        doc.font('Courier').fontSize(11).fillColor('#1e40af').text(
`1. Foundations of ${courseTitle}
2. Advanced Techniques and Best Practices
3. Real-world Applications
4. Final Project Guidelines`
        );
        doc.font('Helvetica');

        doc.moveDown(4);
        doc.fontSize(16).fillColor('#15803d').text(`Happy Learning ${courseTitle}!`, { align: 'center' });

        doc.end();
        resolve();
    });
}

mongoose.connect('mongodb://127.0.0.1:27017/elearning')
    .then(async () => {
        console.log("Connected to MongoDB for updating PDFs");
        const courses = await CourseModel.find({});
        
        for (const course of courses) {
            let filename = '';
            
            if (course.title.toLowerCase().includes('react')) {
                filename = 'React_Course_Notes.pdf';
            } else if (course.title.toLowerCase().includes('python')) {
                filename = 'Python_Course_Notes.pdf';
            } else {
                // Generate a custom one for this course
                filename = course.title.replace(/[^a-zA-Z0-9]/g, '_') + '_Notes.pdf';
                await generateGenericPdf(course.title, filename);
                console.log(`Generated custom PDF for ${course.title} -> ${filename}`);
            }

            const newUrl = `http://localhost:3001/uploads/${filename}`;
            
            await CourseModel.updateOne(
                { _id: course._id },
                { $set: { pdfUrl: newUrl } }
            );
            console.log(`Updated course "${course.title}" with PDF URL: ${newUrl}`);
        }
        
        console.log("All courses updated with actual PDFs successfully.");
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
