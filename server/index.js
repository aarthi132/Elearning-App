const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const UserModel = require('./models/Users');
const CourseModel = require('./models/Courses');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// --- STATIC FILE SERVING FOR UPLOADED PDFs ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// --- MULTER SETUP FOR PDF UPLOAD ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Unique filename: timestamp + original name
        const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files allowed!'), false);
        }
    },
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB max
});

// --- DATABASE CONNECTION ---
mongoose.connect('mongodb://127.0.0.1:27017/elearning')
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log("DB Connection Error:", err));


// --- ROUTES (API Endpoints) ---

// 1. SIGNUP API
app.post('/signup', (req, res) => {
    UserModel.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.json(err))
});

// 2. LOGIN API
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json({ status: "Success", role: user.role, id: user._id });
                } else {
                    res.json("Wrong password");
                }
            } else {
                res.json("No user found");
            }
        })
        .catch(err => res.json(err))
});

// 3. ADD COURSE
app.post('/addCourse', (req, res) => {
    CourseModel.create(req.body)
        .then(courses => res.json(courses))
        .catch(err => res.json(err))
});

// ENROLL API
app.post('/enroll', (req, res) => {
    const { userId, courseId } = req.body;
    UserModel.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: courseId } })
        .then(user => res.json("Enrolled Successfully"))
        .catch(err => res.json(err));
});

// GET USER (For Enrolled Courses)
app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findById(id)
        .then(user => {
            if (user) {
                // Ensure enrolledCourses exists even if missing in DB
                user.enrolledCourses = user.enrolledCourses || [];
                res.json(user);
            } else {
                res.json({ error: "User not found" });
            }
        })
        .catch(err => res.json(err));
});

// 4. GET COURSES
app.get('/getCourses', (req, res) => {
    CourseModel.find({})
        .then(courses => res.json(courses))
        .catch(err => res.json(err))
});

// 5. UPDATE COURSE
app.put('/updateCourse/:id', (req, res) => {
    const id = req.params.id;
    CourseModel.findByIdAndUpdate({ _id: id }, {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        videoUrl: req.body.videoUrl,
        pdfUrl: req.body.pdfUrl
    })
        .then(courses => res.json(courses))
        .catch(err => res.json(err))
});

// 6. DELETE COURSE
app.delete('/deleteCourse/:id', (req, res) => {
    const id = req.params.id;
    CourseModel.findByIdAndDelete({ _id: id })
        .then(res => res.json(res))
        .catch(err => res.json(err))
});

// 👇 7. PDF UPLOAD API
app.post('/uploadPdf', upload.single('pdf'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }
        // Return the URL path for the uploaded file
        const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;
        res.json({ url: fileUrl, filename: req.file.filename });
    } catch (error) {
        console.error('PDF Upload Error:', error);
        res.status(500).json({ error: 'Failed to upload PDF' });
    }
});

// 👇 8. PDF DOWNLOAD API (supports both local and external URLs)
app.get('/download-pdf', async (req, res) => {
    try {
        const fileUrl = req.query.url;
        const fileName = req.query.filename || "notes";

        if (!fileUrl) {
            return res.status(400).send("File URL is missing");
        }

        // Check if it's a local file (served from our uploads folder)
        if (fileUrl.includes('localhost:3001/uploads/')) {
            const filename = fileUrl.split('/uploads/')[1];
            const localPath = path.join(uploadsDir, filename);
            if (fs.existsSync(localPath)) {
                res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
                res.setHeader('Content-Type', 'application/pdf');
                return fs.createReadStream(localPath).pipe(res);
            }
        }

        // Fallback: proxy external URL
        const response = await axios({
            method: 'GET',
            url: fileUrl,
            responseType: 'stream'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');

        response.data.pipe(res);
    } catch (error) {
        console.error("Download Error:", error);
        res.status(500).send("Error downloading file");
    }
});

// 👇 8. ANALYTICS API (Total Counts)
app.get('/analytics', async (req, res) => {
    try {
        const totalCourses = await CourseModel.countDocuments();
        const totalRegisteredUsers = await UserModel.countDocuments();

        // Assuming 'admin' is the role for administrators
        const totalAdminUsers = await UserModel.countDocuments({ role: 'admin' });

        const totalUsers = totalRegisteredUsers - totalAdminUsers;

        const enrollmentData = await UserModel.aggregate([
            { $unwind: '$enrolledCourses' },
            { $group: { _id: null, totalEnrollments: { $sum: 1 } } }
        ]);

        const totalEnrollments = enrollmentData.length > 0 ? enrollmentData[0].totalEnrollments : 0;

        res.json({ totalCourses, totalUsers, totalEnrollments });

    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ error: "Failed to fetch analytics data" });
    }
});


// 9. CHATBOT API (Rule-Based - No API Key Needed)
app.post('/chat', (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.json({ reply: "Please type a message!" });
    }

    const lowerMsg = message.toLowerCase();
    let reply = "I am the LearnSphere E-Learning Assistant! Sorry, I didn't quite catch that. Try asking me about 'courses', 'login', or 'enroll'.";

    // Matching basic Tamil + English rules
    if (lowerMsg.match(/(hello|hi|hey|hai|vanakkam)/)) {
        reply = "Hello there! Welcome to LearnSphere! How can I help you today?";
    } else if (lowerMsg.match(/(course|class|learn|study|subject)/)) {
        reply = "We offer a variety of amazing courses! You can explore them on our Home page. What kind of subject are you interested in?";
    } else if (lowerMsg.match(/(login|signin|sign in|account|my account)/)) {
        reply = "You can log into your account by clicking the 'Login' link at the top right of our website. Let me know if you forgot your password!";
    } else if (lowerMsg.match(/(signup|register|create account|new account)/)) {
        reply = "New here? That's great! Head over to the 'Signup' page to create your student account in 1 minute.";
    } else if (lowerMsg.match(/(enroll|join|buy|get course)/)) {
        reply = "To enroll in a course, simply log in, select the course you like, and click 'Enroll'! You will find your courses in the Dashboard.";
    } else if (lowerMsg.match(/(admin|dashboard)/)) {
        reply = "If you are an Admin, please login through the standard login page with your Admin credentials to access the Admin Dashboard.";
    } else if (lowerMsg.match(/(thank|thanks|nandri)/)) {
        reply = "You're very welcome! Have a great time learning. Feel free to ask if you need more help!";
    } else if (lowerMsg.match(/(bye|goodbye|see you)/)) {
        reply = "Goodbye! Happy studying! 😊";
    }

    // Small simulated delay to feel like a real bot typing
    setTimeout(() => {
        res.json({ reply });
    }, 800);
});

const { exec } = require('child_process');

// 10. CODE EXECUTION API (Local Execution)
app.post('/execute', (req, res) => {
    const { language, code } = req.body;

    // Create a temporary directory for code execution if it doesn't exist
    const tempDir = path.join(__dirname, 'temp_code');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    // Generate a unique file name
    const timestamp = Date.now();
    let fileName = '';
    let executeCommand = '';

    if (language === 'python') {
        fileName = `script_${timestamp}.py`;
        executeCommand = `python ${path.join(tempDir, fileName)}`;
    } else if (language === 'javascript') {
        fileName = `script_${timestamp}.js`;
        executeCommand = `node ${path.join(tempDir, fileName)}`;
    } else if (language === 'java') {
        fileName = `Main.java`;
        // Ensure class name matches file name for Java
        const javaCode = code.includes('class Main') ? code : `public class Main {\n    public static void main(String[] args) {\n        ${code}\n    }\n}`;
        executeCommand = `javac ${path.join(tempDir, fileName)} && java -cp ${tempDir} Main`;
        fs.writeFileSync(path.join(tempDir, fileName), javaCode);
    } else if (language === 'sql') {
        fileName = `script_${timestamp}.js`;
        // Create an isolated JS script that uses alasql and populates dummy tables for the student to practice on
        const sqlCode = `
const alasql = require('alasql');
const db = new alasql.Database();
// Add practice tables
db.exec("CREATE TABLE students (id INT, name STRING, course STRING)");
db.exec("INSERT INTO students VALUES (1, 'Alice', 'React'), (2, 'Bob', 'Python'), (3, 'Charlie', 'SQL')");
db.exec("CREATE TABLE courses (id INT, title STRING, price INT)");
db.exec("INSERT INTO courses VALUES (1, 'React', 1000), (2, 'Python', 800), (3, 'SQL', 500)");

try {
    const result = db.exec(\`${code.replace(/`/g, '\\`')}\`);
    if (result !== undefined && result.length > 0) {
        console.table(result);
        console.log("\\nJSON Output:\\n" + JSON.stringify(result, null, 2));
    } else {
        console.log("Query executed successfully. (No output or empty result)");
    }
} catch (err) {
    console.error(err.message);
}
`;
        executeCommand = `node ${path.join(tempDir, fileName)}`;
        fs.writeFileSync(path.join(tempDir, fileName), sqlCode);
    } else {
        return res.json({ error: "Unsupported language for local execution." });
    }

    const filePath = path.join(tempDir, fileName);

    // Save the code to the file (if not Java or SQL, which are handled above)
    if (language !== 'java' && language !== 'sql') {
        fs.writeFileSync(filePath, code);
    }

    // Execute the code using the host OS
    exec(executeCommand, { timeout: 5000 }, (error, stdout, stderr) => {
        // Cleanup: delete the temporary file after execution
        try {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            if (language === 'java' && fs.existsSync(path.join(tempDir, 'Main.class'))) {
                fs.unlinkSync(path.join(tempDir, 'Main.class'));
            }
        } catch (cleanupErr) {
            console.error("Cleanup error:", cleanupErr);
        }

        if (error) {
            // Include stderr in error response or standard exec error 
            return res.json({ error: stderr || error.message });
        }

        if (stderr) {
            return res.json({ error: stderr });
        }

        return res.json({ output: stdout });
    });
});

// --- SERVER START ---
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});

module.exports = app;

