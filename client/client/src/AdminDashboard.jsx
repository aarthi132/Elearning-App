import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './AdminDashboard.css';

function AdminDashboard() {
    const [courses, setCourses] = useState([]);
    const [analytics, setAnalytics] = useState({
        totalCourses: 0,
        totalUsers: 0,
        totalEnrollments: 0
    });
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [pdfUrl, setPdfUrl] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        // Check if User is Admin
        const role = localStorage.getItem('role');
        if (role !== 'admin') {
            navigate('/login');
            return;
        }

        // Fetch Courses
        axios.get('http://localhost:3001/getCourses')
            .then(result => setCourses(result.data))
            .catch(err => console.log(err));

        // Fetch Analytics
        axios.get('http://localhost:3001/analytics')
            .then(result => setAnalytics(result.data))
            .catch(err => console.log(err));

    }, [navigate]);

    const Submit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/addCourse', { title, description, image, videoUrl, pdfUrl })
            .then(result => {
                alert("Course Added Successfully!");
                // Instead of reload, update state
                setCourses([...courses, result.data]);
                setTitle("");
                setDescription("");
                setImage("");
                setVideoUrl("");
                setPdfUrl("");
                setAnalytics({
                    ...analytics,
                    totalCourses: analytics.totalCourses + 1
                });
            })
            .catch(err => console.log(err))
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            axios.delete('http://localhost:3001/deleteCourse/' + id)
                .then(result => {
                    alert("Course Deleted!");
                    setCourses(courses.filter(course => course._id !== id));
                    setAnalytics({
                        ...analytics,
                        totalCourses: analytics.totalCourses - 1
                    });
                })
                .catch(err => console.log(err))
        }
    }

    const handleDownload = (e, fileUrl, fileName) => {
        e.preventDefault();
        const backendDownloadUrl = `http://localhost:3001/download-pdf?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(fileName)}`;
        window.open(backendDownloadUrl, '_self');
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="admin-page">
            <div className="admin-container">
                {/* Header */}
                <div className="admin-header">
                    <div className="admin-logo">
                        <span className="logo-text">LearnSphere</span>
                        <span className="admin-badge">Admin Dashboard</span>
                    </div>

                    <div className="header-right">
                        <button className="btn-logout" onClick={handleLogout}>
                            <span className="logout-icon">🚪</span>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="admin-content">
                    {/* Dashboard Title */}
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Admin Dashboard</h1>
                        <p className="dashboard-subtitle">Manage your courses and view analytics</p>
                    </div>

                    {/* Analytics Cards */}
                    <div className="analytics-section">
                        <h2 className="section-title">Overview</h2>
                        <div className="analytics-grid">
                            <div className="analytics-card">
                                <div className="card-icon students">👨‍🎓</div>
                                <div className="card-content">
                                    <h3 className="card-value">{analytics.totalUsers}</h3>
                                    <p className="card-label">Total Students</p>
                                </div>
                                <div className="card-trend">+12% this month</div>
                            </div>

                            <div className="analytics-card">
                                <div className="card-icon courses">📚</div>
                                <div className="card-content">
                                    <h3 className="card-value">{analytics.totalCourses}</h3>
                                    <p className="card-label">Total Courses</p>
                                </div>
                                <div className="card-trend">+5% this month</div>
                            </div>

                            <div className="analytics-card">
                                <div className="card-icon enrollments">✨</div>
                                <div className="card-content">
                                    <h3 className="card-value">{analytics.totalEnrollments}</h3>
                                    <p className="card-label">Total Enrollments</p>
                                </div>
                                <div className="card-trend">+18% this month</div>
                            </div>
                        </div>
                    </div>

                    {/* Two Column Layout for Form and Recent Activity */}
                    <div className="content-grid">
                        {/* Add Course Form */}
                        <div className="form-section">
                            <div className="form-card">
                                <div className="card-header">
                                    <h2 className="form-title">Add New Course</h2>
                                    <span className="form-subtitle">Fill in course details</span>
                                </div>
                                <form onSubmit={Submit}>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Course Title *</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="Ex: React JS Full Course"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Image URL</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="Ex: https://image.com/react.png"
                                                value={image}
                                                onChange={(e) => setImage(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Description *</label>
                                        <textarea
                                            className="form-textarea"
                                            placeholder="Detailed description about the course..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows="3"
                                            required
                                        />
                                    </div>

                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Video Link (YouTube)</label>
                                            <input
                                                type="url"
                                                className="form-input"
                                                placeholder="https://youtube.com/..."
                                                value={videoUrl}
                                                onChange={(e) => setVideoUrl(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Notes Link (PDF)</label>
                                            <input
                                                type="url"
                                                className="form-input"
                                                placeholder="https://drive.google.com/..."
                                                value={pdfUrl}
                                                onChange={(e) => setPdfUrl(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-add-course">
                                        <span className="btn-icon">+</span>
                                        Add Course
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="stats-section">
                            <div className="stats-card">
                                <div className="card-header">
                                    <h2 className="stats-title">Quick Stats</h2>
                                </div>
                                <div className="stats-content">
                                    <div className="stat-item">
                                        <span className="stat-label">Courses Added Today</span>
                                        <span className="stat-value">3</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Active Students</span>
                                        <span className="stat-value">{Math.floor(analytics.totalUsers * 0.7)}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Completion Rate</span>
                                        <span className="stat-value">78%</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Avg. Rating</span>
                                        <span className="stat-value">4.5⭐</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course List */}
                    <div className="courses-section">
                        <div className="section-header">
                            <h2 className="section-title">Managed Courses ({courses.length})</h2>
                            <div className="section-actions">

                            </div>
                        </div>

                        {courses.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📚</div>
                                <h3>No courses added yet</h3>
                                <p>Start by adding your first course using the form above!</p>
                            </div>
                        ) : (
                            <div className="courses-grid">
                                {courses.map((course) => (
                                    <div className="course-card" key={course._id}>
                                        <div className="course-image">
                                            <img
                                                src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop"}
                                                alt={course.title}
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w-400&h=200&fit=crop";
                                                }}
                                            />
                                            <div className="course-badge">Active</div>
                                        </div>
                                        <div className="course-content">
                                            <h3 className="course-title">{course.title}</h3>
                                            <p className="course-description">{course.description}</p>

                                            <div className="course-meta">
                                                <span className="meta-item">📊 125 Enrolled</span>
                                                <span className="meta-item">⭐ 4.5</span>
                                            </div>

                                            <div className="course-actions">
                                                {course.videoUrl && (
                                                    <a
                                                        href={course.videoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-course-action watch"
                                                    >
                                                        <span className="action-icon">▶️</span>
                                                        Watch Video
                                                    </a>
                                                )}
                                                {course.pdfUrl && (
                                                    <button
                                                        onClick={(e) => handleDownload(e, course.pdfUrl, course.title)}
                                                        className="btn-course-action download"
                                                    >
                                                        <span className="action-icon">📥</span>
                                                        Download Notes
                                                    </button>
                                                )}
                                                <button
                                                    className="btn-course-action delete"
                                                    onClick={() => handleDelete(course._id)}
                                                >
                                                    <span className="action-icon">🗑️</span>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="admin-footer">
                    <p>© {new Date().getFullYear()} LearnSphere Admin Dashboard. All rights reserved.</p>
                    <p className="footer-info">
                        <span className="status-dot"></span>
                        System Status: <span className="status-text">Operational</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import './AdminDashboard.css';

// function AdminDashboard() {
//     const [courses, setCourses] = useState([]);
//     const [analytics, setAnalytics] = useState({
//         totalCourses: 0,
//         totalUsers: 0,
//         totalEnrollments: 0
//     });
//     const [darkMode, setDarkMode] = useState(false);
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [image, setImage] = useState("");
//     const [videoUrl, setVideoUrl] = useState("");
//     const [pdfUrl, setPdfUrl] = useState("");

//     const navigate = useNavigate();

//     useEffect(() => {
//         const savedTheme = localStorage.getItem('theme');
//         if (savedTheme === 'dark') {
//             setDarkMode(true);
//             document.documentElement.setAttribute('data-theme', 'dark');
//         } else {
//             document.documentElement.setAttribute('data-theme', 'light');
//         }

//         // Check if User is Admin
//         const role = localStorage.getItem('role');
//         if (role !== 'admin') {
//             navigate('/login');
//             return;
//         }

//         // Fetch Courses
//         axios.get('http://localhost:3001/getCourses')
//             .then(result => setCourses(result.data))
//             .catch(err => console.log(err));

//         // Fetch Analytics
//         axios.get('http://localhost:3001/analytics')
//             .then(result => setAnalytics(result.data))
//             .catch(err => console.log(err));

//     }, [navigate]);

//     const toggleTheme = () => {
//         const newDarkMode = !darkMode;
//         setDarkMode(newDarkMode);

//         if (newDarkMode) {
//             document.documentElement.setAttribute('data-theme', 'dark');
//             localStorage.setItem('theme', 'dark');
//         } else {
//             document.documentElement.setAttribute('data-theme', 'light');
//             localStorage.setItem('theme', 'light');
//         }
//     };

//     const Submit = (e) => {
//         e.preventDefault();
//         axios.post('http://localhost:3001/addCourse', { title, description, image, videoUrl, pdfUrl })
//             .then(result => {
//                 alert("Course Added Successfully!");
//                 // Instead of reload, update state
//                 setCourses([...courses, result.data]);
//                 setTitle("");
//                 setDescription("");
//                 setImage("");
//                 setVideoUrl("");
//                 setPdfUrl("");
//                 setAnalytics({
//                     ...analytics,
//                     totalCourses: analytics.totalCourses + 1
//                 });
//             })
//             .catch(err => console.log(err))
//     }

//     const handleDelete = (id) => {
//         if (window.confirm("Are you sure you want to delete this course?")) {
//             axios.delete('http://localhost:3001/deleteCourse/' + id)
//                 .then(result => {
//                     alert("Course Deleted!");
//                     setCourses(courses.filter(course => course._id !== id));
//                     setAnalytics({
//                         ...analytics,
//                         totalCourses: analytics.totalCourses - 1
//                     });
//                 })
//                 .catch(err => console.log(err))
//         }
//     }

//     const handleDownload = (e, fileUrl, fileName) => {
//         e.preventDefault();
//         const backendDownloadUrl = `http://localhost:3001/download-pdf?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(fileName)}`;
//         window.open(backendDownloadUrl, '_self');
//     };

//     const handleLogout = () => {
//         localStorage.clear();
//         navigate('/');
//     };

//     return (
//         <div className="admin-page">
//             {/* Theme Toggle Button */}
//             <button
//                 className="theme-toggle-admin-btn"
//                 onClick={toggleTheme}
//                 aria-label="Toggle dark/light mode"
//             >
//                 <span className="theme-icon">
//                     {darkMode ? '🌙' : '☀'}
//                 </span>
//             </button>

//             {/* Back to Home Button */}
//             <Link to="/" className="back-to-home">
//                 ← Back to Home
//             </Link>

//             <div className="admin-container">
//                 {/* Header */}
//                 <div className="admin-header">
//                     <div className="admin-logo">
//                         <span className="logo-text">GEEKSTACK</span>
//                         <span className="admin-badge">Admin Dashboard</span>
//                     </div>

//                     <div className="header-right">
//                         <button className="btn-logout" onClick={handleLogout}>
//                             <span className="logout-icon">🚪</span>
//                             Logout
//                         </button>
//                     </div>
//                 </div>

//                 {/* Dashboard Content */}
//                 <div className="admin-content">
//                     {/* Dashboard Title */}
//                     <div className="dashboard-header">
//                         <h1 className="dashboard-title">Admin Dashboard</h1>
//                         <p className="dashboard-subtitle">Manage your courses and view analytics</p>
//                     </div>

//                     {/* Analytics Cards */}
//                     <div className="analytics-section">
//                         <h2 className="section-title">Overview</h2>
//                         <div className="analytics-grid">
//                             <div className="analytics-card">
//                                 <div className="card-icon students">👨‍🎓</div>
//                                 <div className="card-content">
//                                     <h3 className="card-value">{analytics.totalUsers}</h3>
//                                     <p className="card-label">Total Students</p>
//                                 </div>
//                                 <div className="card-trend">+12% this month</div>
//                             </div>

//                             <div className="analytics-card">
//                                 <div className="card-icon courses">📚</div>
//                                 <div className="card-content">
//                                     <h3 className="card-value">{analytics.totalCourses}</h3>
//                                     <p className="card-label">Total Courses</p>
//                                 </div>
//                                 <div className="card-trend">+5% this month</div>
//                             </div>

//                             <div className="analytics-card">
//                                 <div className="card-icon enrollments">✨</div>
//                                 <div className="card-content">
//                                     <h3 className="card-value">{analytics.totalEnrollments}</h3>
//                                     <p className="card-label">Total Enrollments</p>
//                                 </div>
//                                 <div className="card-trend">+18% this month</div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Two Column Layout for Form and Recent Activity */}
//                     <div className="content-grid">
//                         {/* Add Course Form */}
//                         <div className="form-section">
//                             <div className="form-card">
//                                 <div className="card-header">
//                                     <h2 className="form-title">Add New Course</h2>
//                                     <span className="form-subtitle">Fill in course details</span>
//                                 </div>
//                                 <form onSubmit={Submit}>
//                                     <div className="form-grid">
//                                         <div className="form-group">
//                                             <label>Course Title *</label>
//                                             <input
//                                                 type="text"
//                                                 className="form-input"
//                                                 placeholder="Ex: React JS Full Course"
//                                                 value={title}
//                                                 onChange={(e) => setTitle(e.target.value)}
//                                                 required
//                                             />
//                                         </div>
//                                         <div className="form-group">
//                                             <label>Image URL</label>
//                                             <input
//                                                 type="text"
//                                                 className="form-input"
//                                                 placeholder="Ex: https://image.com/react.png"
//                                                 value={image}
//                                                 onChange={(e) => setImage(e.target.value)}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="form-group">
//                                         <label>Description *</label>
//                                         <textarea
//                                             className="form-textarea"
//                                             placeholder="Detailed description about the course..."
//                                             value={description}
//                                             onChange={(e) => setDescription(e.target.value)}
//                                             rows="3"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="form-grid">
//                                         <div className="form-group">
//                                             <label>Video Link (YouTube)</label>
//                                             <input
//                                                 type="url"
//                                                 className="form-input"
//                                                 placeholder="https://youtube.com/..."
//                                                 value={videoUrl}
//                                                 onChange={(e) => setVideoUrl(e.target.value)}
//                                             />
//                                         </div>
//                                         <div className="form-group">
//                                             <label>Notes Link (PDF)</label>
//                                             <input
//                                                 type="url"
//                                                 className="form-input"
//                                                 placeholder="https://drive.google.com/..."
//                                                 value={pdfUrl}
//                                                 onChange={(e) => setPdfUrl(e.target.value)}
//                                             />
//                                         </div>
//                                     </div>

//                                     <button type="submit" className="btn-add-course">
//                                         <span className="btn-icon">+</span>
//                                         Add Course
//                                     </button>
//                                 </form>
//                             </div>
//                         </div>

//                         {/* Quick Stats */}
//                         <div className="stats-section">
//                             <div className="stats-card">
//                                 <div className="card-header">
//                                     <h2 className="stats-title">Quick Stats</h2>
//                                 </div>
//                                 <div className="stats-content">
//                                     <div className="stat-item">
//                                         <span className="stat-label">Courses Added Today</span>
//                                         <span className="stat-value">3</span>
//                                     </div>
//                                     <div className="stat-item">
//                                         <span className="stat-label">Active Students</span>
//                                         <span className="stat-value">{Math.floor(analytics.totalUsers * 0.7)}</span>
//                                     </div>
//                                     <div className="stat-item">
//                                         <span className="stat-label">Completion Rate</span>
//                                         <span className="stat-value">78%</span>
//                                     </div>
//                                     <div className="stat-item">
//                                         <span className="stat-label">Avg. Rating</span>
//                                         <span className="stat-value">4.5⭐</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Course List */}
//                     <div className="courses-section">
//                         <div className="section-header">
//                             <h2 className="section-title">Managed Courses ({courses.length})</h2>
//                         </div>

//                         {courses.length === 0 ? (
//                             <div className="empty-state">
//                                 <div className="empty-icon">📚</div>
//                                 <h3>No courses added yet</h3>
//                                 <p>Start by adding your first course using the form above!</p>
//                             </div>
//                         ) : (
//                             <div className="courses-grid">
//                                 {courses.map((course) => (
//                                     <div className="course-card" key={course._id}>
//                                         <div className="course-image">
//                                             <img
//                                                 src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop"}
//                                                 alt={course.title}
//                                                 onError={(e) => {
//                                                     e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w-400&h=200&fit=crop";
//                                                 }}
//                                             />
//                                             <div className="course-badge">Active</div>
//                                         </div>
//                                         <div className="course-content">
//                                             <h3 className="course-title">{course.title}</h3>
//                                             <p className="course-description">{course.description}</p>

//                                             <div className="course-meta">
//                                                 <span className="meta-item">📊 125 Enrolled</span>
//                                                 <span className="meta-item">⭐ 4.5</span>
//                                             </div>

//                                             <div className="course-actions">
//                                                 {course.videoUrl && (
//                                                     <a
//                                                         href={course.videoUrl}
//                                                         target="_blank"
//                                                         rel="noopener noreferrer"
//                                                         className="btn-course-action watch"
//                                                     >
//                                                         <span className="action-icon">▶️</span>
//                                                         Watch Video
//                                                     </a>
//                                                 )}
//                                                 {course.pdfUrl && (
//                                                     <button
//                                                         onClick={(e) => handleDownload(e, course.pdfUrl, course.title)}
//                                                         className="btn-course-action download"
//                                                     >
//                                                         <span className="action-icon">📥</span>
//                                                         Download Notes
//                                                     </button>
//                                                 )}
//                                                 <button
//                                                     className="btn-course-action delete"
//                                                     onClick={() => handleDelete(course._id)}
//                                                 >
//                                                     <span className="action-icon">🗑️</span>
//                                                     Delete
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="admin-footer">
//                     <p>© {new Date().getFullYear()} GEEKSTACK Admin Dashboard. All rights reserved.</p>
//                     <p className="footer-info">
//                         <span className="status-dot"></span>
//                         System Status: <span className="status-text">Operational</span>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default AdminDashboard;