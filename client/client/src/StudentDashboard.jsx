import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

function StudentDashboard() {
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        // Fetch Courses
        axios.get('http://localhost:3001/getCourses')
            .then(result => setCourses(result.data))
            .catch(err => console.log(err));

        // Fetch User Enrollments
        if (userId) {
            axios.get('http://localhost:3001/user/' + userId)
                .then(result => {
                    setEnrolledCourses(result.data.enrolledCourses || []);
                })
                .catch(err => console.log(err));
        }
    }, [userId]);

    const handleEnroll = (courseId) => {
        if (!userId) {
            alert("Please Login First!");
            return;
        }

        axios.post('http://localhost:3001/enroll', { userId, courseId })
            .then(result => {
                alert("Course Enrolled Successfully! 🎉");
                setEnrolledCourses([...enrolledCourses, courseId]);
            })
            .catch(err => {
                console.log(err);
                alert("Error enrolling in course");
            });
    };

    const handleDownload = (e, fileUrl, fileName) => {
        e.preventDefault();
        const backendDownloadUrl = `http://localhost:3001/download-pdf?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(fileName)}`;
        window.open(backendDownloadUrl, '_self');
    };

    // Filter courses based on search term
    const filteredCourses = courses.filter((course) => {
        return course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="student-page">
            <div className="student-container">
                {/* Header */}
                <div className="student-header">
                    <div className="student-logo">
                        <span className="logo-text">LearnSphere</span>
                        <span className="student-badge">Student Dashboard</span>
                    </div>

                    <div className="header-right">
                        <button className="btn-mycourses" onClick={() => navigate('/my-courses')}>
                            <span className="mycourses-icon">📚</span>
                            My Courses
                        </button>
                        <button className="btn-logout" onClick={handleLogout}>
                            <span className="logout-icon">🚪</span>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="student-content">
                    {/* Dashboard Title */}
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Explore Courses</h1>
                        <p className="dashboard-subtitle">Find your next skill upgrade below</p>
                    </div>

                    {/* Search Bar */}
                    <div className="search-section">
                        <h2 className="section-title">Discover Learning Opportunities</h2>
                        <div className="search-container">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="🔍 Search for courses (e.g., React, Python, JavaScript)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Course List */}
                    <div className="courses-section">
                        <div className="section-header">
                            <h2 className="section-title">Available Courses ({filteredCourses.length})</h2>
                        </div>

                        {filteredCourses.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">🔍</div>
                                <h3>No courses found for "{searchTerm}"</h3>
                                <p>Try searching with different keywords or browse all available courses</p>
                            </div>
                        ) : (
                            <div className="courses-grid">
                                {filteredCourses.map((course) => (
                                    <div className="course-card" key={course._id}>
                                        <div className="course-image">
                                            <img
                                                src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop"}
                                                alt={course.title}
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w-400&h=200&fit=crop";
                                                }}
                                            />
                                            <div className="course-badge">
                                                {enrolledCourses.includes(course._id) ? 'Enrolled' : 'Available'}
                                            </div>
                                        </div>
                                        <div className="course-content">
                                            <h3 className="course-title">{course.title}</h3>
                                            <p className="course-description">{course.description}</p>

                                            <div className="course-meta">
                                                <span className="meta-item">⏱️ 8 Hours</span>
                                                <span className="meta-item">📊 Beginner</span>
                                            </div>

                                            <div className="course-actions">
                                                {enrolledCourses.includes(course._id) ? (
                                                    <button className="btn-course-action enrolled" disabled>
                                                        <span className="action-icon">✅</span>
                                                        Already Enrolled
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn-course-action enroll"
                                                        onClick={() => handleEnroll(course._id)}
                                                    >
                                                        <span className="action-icon">🎓</span>
                                                        Enroll Now
                                                    </button>
                                                )}

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
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="stats-section">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">📚</div>
                                <div className="stat-content">
                                    <h3>{courses.length}</h3>
                                    <p>Total Courses</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🎓</div>
                                <div className="stat-content">
                                    <h3>{enrolledCourses.length}</h3>
                                    <p>Your Enrollments</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⭐</div>
                                <div className="stat-content">
                                    <h3>4.8</h3>
                                    <p>Avg. Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="student-footer">
                    <p>© {new Date().getFullYear()} LearnSphere Student Dashboard. All rights reserved.</p>
                    <p className="footer-info">
                        <span className="status-dot"></span>
                        System Status: <span className="status-text">Operational</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;