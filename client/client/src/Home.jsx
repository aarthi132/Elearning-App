import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }, []);

    const toggleTheme = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);

        if (newDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light shadow-sm fixed-top">
                <div className="container">
                    <Link className="navbar-brand fw-bold" to="/">
                        <span className="logo-text">LearnSphere🎓</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item">
                                <Link className="nav-link fw-semibold" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-semibold" to="/Signup">Register</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-semibold" to="/Login">Login</Link>
                            </li>
                        </ul>
                        <div className="theme-toggle-nav">
                            <button
                                className="theme-toggle-btn"
                                onClick={toggleTheme}
                                aria-label="Toggle dark/light mode"
                            >
                                <span className="theme-icon">
                                    {darkMode ? '🌙' : '☀'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <header className="hero-section d-flex align-items-center">
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h1 className="hero-title">Unlock Your Potential with Online Learning</h1>
                            <p className="hero-subtitle">
                                Discover a world of knowledge with our expert-led courses.
                                Learn anytime, anywhere, and boost your career skills today!
                            </p>
                            <div className="d-flex justify-content-center gap-3">
                                <Link to="/signup" className="btn-grad-primary">Get Started</Link>
                                <Link to="/login" className="btn btn-outline-light rounded-pill px-4 py-3 fw-bold">Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <section className="container my-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold">Why Choose Us?</h2>
                    <p className="text-secondary">We provide the best learning experience for students.</p>
                </div>

                <div className="row">
                    <div className="col-md-4 mb-4">
                        <div className="feature-card h-100">
                            <div className="feature-icon">💻</div>
                            <h4>Expert Instructors</h4>
                            <p className="text-secondary">Learn from industry experts who are passionate about teaching.</p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="feature-card h-100">
                            <div className="feature-icon">⏰</div>
                            <h4>Lifetime Access</h4>
                            <p className="text-secondary">Get unlimited access to your courses and learn at your own pace.</p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="feature-card h-100">
                            <div className="feature-icon">📜</div>
                            <h4>Certified Courses</h4>
                            <p className="text-secondary">Earn certificates upon completion to showcase your skills.</p>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="footer">
                <div className="container">
                    <p className="mb-0">© 2026 E-LearnSphere . All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;




