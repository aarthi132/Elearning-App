const PDFDocument = require('pdfkit');
const fs = require('fs');

function generateReactPdf() {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50 });
        doc.pipe(fs.createWriteStream('React_Course_Notes.pdf'));

        // Title Page
        doc.fontSize(36).fillColor('#61DAFB').text('React.js Complete Course', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).fillColor('#333333').text('LearnSphere Official Notes', { align: 'center' });
        doc.moveDown(4);

        // Chapter 1: Introduction
        doc.addPage();
        doc.fontSize(24).fillColor('#222222').text('Chapter 1: Introduction to React');
        doc.moveDown(1);
        doc.fontSize(14).fillColor('#444444').text(
            'React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components".'
        );
        doc.moveDown(1);
        doc.fontSize(14).text('Why use React?');
        doc.moveDown(0.5);
        doc.fontSize(12).list([
            'Component-based architecture',
            'Virtual DOM for performance',
            'Declarative syntax',
            'Strong community and ecosystem'
        ]);

        // Chapter 2: Components and Props
        doc.addPage();
        doc.fontSize(24).fillColor('#222222').text('Chapter 2: Components & Props');
        doc.moveDown(1);
        doc.fontSize(14).fillColor('#444444').text(
            'Components are independent and reusable bits of code. They serve the same purpose as JavaScript functions, but work in isolation and return HTML.'
        );
        doc.moveDown(1);
        
        // Code snippet
        doc.fontSize(12).fillColor('#d946ef').text('Example of a Functional Component:');
        doc.moveDown(0.5);
        doc.font('Courier').fontSize(11).fillColor('#1e40af').text(
`function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}`
        );
        doc.font('Helvetica'); // Reset font

        // Chapter 3: State and Hooks
        doc.addPage();
        doc.fontSize(24).fillColor('#222222').text('Chapter 3: State & Hooks');
        doc.moveDown(1);
        doc.fontSize(14).fillColor('#444444').text(
            'Hooks represent a fundamental shift in how we write React components. They let you use state and other React features without writing a class.'
        );
        doc.moveDown(1);
        
        doc.fontSize(12).fillColor('#d946ef').text('The useState Hook:');
        doc.moveDown(0.5);
        doc.font('Courier').fontSize(11).fillColor('#1e40af').text(
`import React, { useState } from 'react';

function Counter() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`
        );
        doc.font('Helvetica');

        doc.moveDown(4);
        doc.fontSize(16).fillColor('#15803d').text('Happy Coding with React!', { align: 'center' });

        doc.end();
        console.log('React PDF Generated: React_Course_Notes.pdf');
        resolve();
    });
}

function generatePythonPdf() {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50 });
        doc.pipe(fs.createWriteStream('Python_Course_Notes.pdf'));

        // Title Page
        doc.fontSize(36).fillColor('#3776AB').text('Python Programming Masterclass', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).fillColor('#333333').text('LearnSphere Official Notes', { align: 'center' });
        doc.moveDown(4);

        // Chapter 1: Introduction
        doc.addPage();
        doc.fontSize(24).fillColor('#222222').text('Chapter 1: Basics of Python');
        doc.moveDown(1);
        doc.fontSize(14).fillColor('#444444').text(
            'Python is an interpreted, high-level and general-purpose programming language. Python\'s design philosophy emphasizes code readability with its notable use of significant indentation.'
        );
        doc.moveDown(1);
        
        doc.fontSize(12).fillColor('#d946ef').text('Your First Program:');
        doc.moveDown(0.5);
        doc.font('Courier').fontSize(11).fillColor('#1e40af').text(
`# This program prints Hello, world!
print('Hello, world!')`
        );
        doc.font('Helvetica');

        // Chapter 2: Data Structures
        doc.addPage();
        doc.fontSize(24).fillColor('#222222').text('Chapter 2: Data Structures');
        doc.moveDown(1);
        doc.fontSize(14).fillColor('#444444').text(
            'Python has several built-in data structures such as Lists, Dictionaries, Tuples, and Sets. Understanding these is crucial for effective programming.'
        );
        doc.moveDown(1);
        
        doc.fontSize(12).fillColor('#d946ef').text('Lists & Dictionaries Example:');
        doc.moveDown(0.5);
        doc.font('Courier').fontSize(11).fillColor('#1e40af').text(
`# A list of fruits
fruits = ["apple", "banana", "cherry"]
fruits.append("orange")
print(fruits[1])  # Output: banana

# A dictionary tracking student grades
student_grades = {
    "Alice": 85,
    "Bob": 92,
    "Charlie": 78
}
print(student_grades["Bob"])  # Output: 92`
        );
        doc.font('Helvetica');

        // Chapter 3: Functions and Loops
        doc.addPage();
        doc.fontSize(24).fillColor('#222222').text('Chapter 3: Control Flow & Functions');
        doc.moveDown(1);
        doc.fontSize(14).fillColor('#444444').text(
            'Control flow allows you to dictate the order in which statements are executed in a script based on conditions.'
        );
        doc.moveDown(1);
        
        doc.fontSize(12).fillColor('#d946ef').text('Functions and Loops Example:');
        doc.moveDown(0.5);
        doc.font('Courier').fontSize(11).fillColor('#1e40af').text(
`def greet_user(name):
    """A simple function to greet the user."""
    return f"Hello, {name}!"

# Using a for loop with the function
names = ["Alice", "Bob", "Charlie"]
for name in names:
    print(greet_user(name))
    
# Output:
# Hello, Alice!
# Hello, Bob!
# Hello, Charlie!`
        );
        doc.font('Helvetica');

        doc.moveDown(4);
        doc.fontSize(16).fillColor('#15803d').text('Happy Coding with Python!', { align: 'center' });

        doc.end();
        console.log('Python PDF Generated: Python_Course_Notes.pdf');
        resolve();
    });
}

async function main() {
    await generateReactPdf();
    await generatePythonPdf();
    console.log("Detailed PDF generation complete!");
}

main();
