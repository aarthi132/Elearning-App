import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import VideoModal from './VideoModal';
import PdfViewer from './PdfViewer';
import './MyCourses.css';

function MyCourses() {
    const [myCourses, setMyCourses] = useState([]);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [activeVideoUrl, setActiveVideoUrl] = useState("");
    const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
    const [activePdfUrl, setActivePdfUrl] = useState("");
    const [activePdfTitle, setActivePdfTitle] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            axios.get('http://localhost:3001/user/' + userId)
                .then(userResult => {
                    const enrolledIds = userResult.data?.enrolledCourses || [];

                    if (enrolledIds.length === 0) {
                        setMyCourses([]);
                        setIsLoading(false);
                        return;
                    }

                    axios.get('http://localhost:3001/getCourses')
                        .then(courseResult => {
                            const allCourses = courseResult.data;
                            const filteredCourses = allCourses.filter(course =>
                                enrolledIds.includes(course._id)
                            );
                            setMyCourses(filteredCourses);
                            setIsLoading(false);
                        })
                        .catch(err => {
                            console.log(err);
                            setIsLoading(false);
                        });
                })
                .catch(err => {
                    console.log(err);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [userId]);

    const handleViewPdf = (e, pdfUrl, courseTitle) => {
        e.preventDefault();
        setActivePdfUrl(pdfUrl);
        setActivePdfTitle(courseTitle);
        setIsPdfViewerOpen(true);
    };

    const handleDownload = (e, fileUrl, fileName) => {
        e.preventDefault();
        const backendDownloadUrl = `http://localhost:3001/download-pdf?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(fileName)}`;
        window.open(backendDownloadUrl, '_blank');
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = () => {
        localStorage.clear();
        navigate('/login', { replace: true });
    };

    return (
        <div className="mycourses-page">
            <div className="mycourses-container">
                {/* Header */}
                <div className="mycourses-header">
                    <div className="mycourses-logo">
                        <span className="logo-text">LearnSphere</span>
                        <span className="mycourses-badge">My Courses</span>
                    </div>

                    <div className="header-right">
                        <button className="btn-back" onClick={() => navigate('/student/dashboard')}>
                            <span className="back-icon">←</span>
                            Dashboard
                        </button>
                        <button className="btn-logout" onClick={handleLogoutClick}>
                            <span className="logout-icon">🚪</span>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mycourses-content">
                    {/* Dashboard Title */}
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">My Enrolled Courses</h1>
                        <p className="dashboard-subtitle">Continue your learning journey with these courses</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="stats-section">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">📚</div>
                                <div className="stat-content">
                                    <h3>{myCourses.length}</h3>
                                    <p>Enrolled Courses</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⏱️</div>
                                <div className="stat-content">
                                    <h3>{myCourses.length * 8}</h3>
                                    <p>Learning Hours</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🎯</div>
                                <div className="stat-content">
                                    <h3>25%</h3>
                                    <p>Completion Rate</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course List */}
                    <div className="courses-section">
                        <div className="section-header">
                            <h2 className="section-title">Your Learning Path ({myCourses.length})</h2>
                        </div>

                        {isLoading ? (
                            <div className="loading-state">
                                <h3>Loading your courses...</h3>
                            </div>
                        ) : myCourses.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📚</div>
                                <h3>No courses enrolled yet</h3>
                                <p>Start your learning journey by enrolling in courses from the dashboard</p>
                                <button
                                    className="btn-browse"
                                    onClick={() => navigate('/student/dashboard')}
                                >
                                    Browse Courses
                                </button>
                            </div>
                        ) : (
                            <div className="courses-grid">
                                {myCourses.map((course) => (
                                    <div className="course-card" key={course._id}>
                                        <div className="course-image">
                                            <img
                                                src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop"}
                                                alt={course.title}
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w-400&h=200&fit=crop";
                                                }}
                                            />
                                            <div className="course-badge">Enrolled</div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: '25%' }}></div>
                                            </div>
                                        </div>
                                        <div className="course-content">
                                            <h3 className="course-title">{course.title}</h3>
                                            <p className="course-description">{course.description}</p>

                                            <div className="course-meta">
                                                <span className="meta-item">⏱️ 8 Hours</span>
                                                <span className="meta-item">📊 25% Complete</span>
                                            </div>

                                            <div className="course-actions">
                                                {course.videoUrl && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setActiveVideoUrl(course.videoUrl);
                                                            setIsVideoModalOpen(true);
                                                        }}
                                                        className="btn-course-action watch"
                                                    >
                                                        <span className="action-icon">▶️</span>
                                                        Continue Learning
                                                    </button>
                                                )}
                                                {course.pdfUrl && (
                                                    <button
                                                        onClick={(e) => handleViewPdf(e, course.pdfUrl, course.title)}
                                                        className="btn-course-action download"
                                                    >
                                                        <span className="action-icon">📄</span>
                                                        View PDF
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mycourses-footer">
                    <p>© {new Date().getFullYear()} LearningApp My Courses. All rights reserved.</p>
                    <p className="footer-info">
                        <span className="status-dot"></span>
                        Learning Progress: <span className="status-text">Active</span>
                    </p>
                </div>
            </div>

            {/* PDF Viewer Modal */}
            {isPdfViewerOpen && (
                <PdfViewer
                    pdfUrl={activePdfUrl}
                    courseTitle={activePdfTitle}
                    onClose={() => setIsPdfViewerOpen(false)}
                />
            )}

            {/* Video Modal Overlay */}
            {isVideoModalOpen && (
                <VideoModal
                    videoUrl={activeVideoUrl}
                    onClose={() => setIsVideoModalOpen(false)}
                />
            )}

            {/* Custom Logout Modal */}
            {showLogoutModal && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal-content">
                        <div className="logout-modal-icon">⚠️</div>
                        <h2>Confirm Logout</h2>
                        <p>Are you sure you want to log out of Your Courses?</p>
                        <div className="logout-modal-actions">
                            <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                            <button className="btn-confirm-logout" onClick={handleLogoutConfirm}>Yes, Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyCourses;