const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const UserModel = require('./models/Users');
const CourseModel = require('./models/Courses');

const app = express();
app.use(express.json());
app.use(cors());

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
        .then(user => res.json(user))
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

// 👇 7. PDF DOWNLOAD API (Backend Fix)
app.get('/download-pdf', async (req, res) => {
    try {
        const fileUrl = req.query.url;
        const fileName = req.query.filename || "notes";

        if (!fileUrl) {
            return res.status(400).send("File URL is missing");
        }

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


// --- SERVER START ---
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});

