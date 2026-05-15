const PDFDocument = require('pdfkit');
const fs = require('fs');

function createCoursePdf(courseName, filename, description) {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50 });
        doc.pipe(fs.createWriteStream(filename));

        // Title
        doc.fontSize(30)
           .fillColor('#4f46e5')
           .text(courseName + ' Course Materials', { align: 'center' });
        doc.moveDown(2);

        // Description
        doc.fontSize(14)
           .fillColor('#333333')
           .text(description, { align: 'justify' });
        doc.moveDown(2);

        // Content placeholder
        doc.fontSize(20)
           .fillColor('#000000')
           .text('Table of Contents', { underline: true });
        doc.moveDown(1);
        
        const topics = courseName === 'React Basics' ? 
            ['1. Introduction to React', '2. JSX and Components', '3. State and Props', '4. Hooks (useState, useEffect)', '5. React Router'] :
            ['1. Introduction and Setup', '2. Basic Syntax and Data Types', '3. Control Flow (If, Loops)', '4. Functions and Modules', '5. Object-Oriented Programming'];

        topics.forEach(topic => {
            doc.fontSize(14).text(topic);
            doc.moveDown(0.5);
        });

        doc.moveDown(3);
        doc.fontSize(12).fillColor('#666666').text('These notes are provided as part of the LearnSphere E-Learning platform. Happy Learning!', { align: 'center' });

        doc.end();
        console.log(`Created PDF: ${filename}`);
        resolve();
    });
}

async function main() {
    await createCoursePdf(
        'React Basics', 
        'React_Course_Notes.pdf', 
        'Welcome to the React Basics course! This comprehensive guide covers all the fundamental concepts you need to build dynamic user interfaces with React, including modern functional components and hooks.'
    );

    await createCoursePdf(
        'Python', 
        'Python_Course_Notes.pdf', 
        'Welcome to the Python full course for beginners! Python is a versatile and readable programming language. This guide will take you from absolute beginner concepts to building actual Python scripts.'
    );
    
    console.log("PDF generation complete!");
}

main();
