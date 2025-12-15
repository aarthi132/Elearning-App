// import React from 'react';
// import { Link } from 'react-router-dom';
// import './Home.css'; // Import CSS

// function Home() {
//     return (
//         <div>
//             {/* 1. NAVBAR SECTION */}
//             <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
//                 <div className="container">
//                     <Link className="navbar-brand fw-bold text-primary" to="/">
//                         🎓 E-Learning App
//                     </Link>
//                     <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
//                         <span className="navbar-toggler-icon"></span>
//                     </button>
//                     <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
//                         <ul className="navbar-nav">
//                             <li className="nav-item">
//                                 <Link className="nav-link fw-semibold" to="/">Home</Link>
//                             </li>
//                             <li className="nav-item">
//                                 <Link className="nav-link fw-semibold" to="/login">Login</Link>
//                             </li>
//                             <li className="nav-item">
//                                 <Link className="btn btn-primary ms-2 rounded-pill px-4" to="/signup">Register</Link>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//             </nav>

//             {/* 2. HERO SECTION (Main Intro) */}
//             <header className="hero-section d-flex align-items-center">
//                 <div className="container mt-5">
//                     <div className="row justify-content-center">
//                         <div className="col-lg-8">
//                             <h1 className="hero-title">Unlock Your Potential with Online Learning</h1>
//                             <p className="hero-subtitle">
//                                 Discover a world of knowledge with our expert-led courses.
//                                 Learn anytime, anywhere, and boost your career skills today!
//                             </p>
//                             <div className="d-flex justify-content-center gap-3">
//                                 <Link to="/signup" className="btn-grad-primary">Get Started</Link>
//                                 <Link to="/login" className="btn btn-outline-light rounded-pill px-4 py-3 fw-bold">Login</Link>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             {/* 3. FEATURES SECTION (Why choose us?) */}
//             <section className="container my-5">
//                 <div className="text-center mb-5">
//                     <h2 className="fw-bold">Why Choose Us?</h2>
//                     <p className="text-secondary">We provide the best learning experience for students.</p>
//                 </div>

//                 <div className="row">
//                     {/* Feature 1 */}
//                     <div className="col-md-4 mb-4">
//                         <div className="feature-card h-100">
//                             <div className="feature-icon">💻</div>
//                             <h4>Expert Instructors</h4>
//                             <p className="text-secondary">Learn from industry experts who are passionate about teaching.</p>
//                         </div>
//                     </div>

//                     {/* Feature 2 */}
//                     <div className="col-md-4 mb-4">
//                         <div className="feature-card h-100">
//                             <div className="feature-icon">⏰</div>
//                             <h4>Lifetime Access</h4>
//                             <p className="text-secondary">Get unlimited access to your courses and learn at your own pace.</p>
//                         </div>
//                     </div>

//                     {/* Feature 3 */}
//                     <div className="col-md-4 mb-4">
//                         <div className="feature-card h-100">
//                             <div className="feature-icon">📜</div>
//                             <h4>Certified Courses</h4>
//                             <p className="text-secondary">Earn certificates upon completion to showcase your skills.</p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* 4. FOOTER SECTION */}
//             <footer className="footer">
//                 <div className="container">
//                     <p className="mb-0">© 2025 E-Learning App. All Rights Reserved.</p>
//                 </div>
//             </footer>
//         </div>
//     );
// }

// export default Home;


// /* --- Home.css --- */

// /* 1. Hero Section (Gradient Background) */
// .hero-section {
//     background: linear-gradient(135deg, #240b36 0%, #c31432 100%);
//     color: white;
//     padding: 100px 0;
//     text-align: center;
//     clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
//     /* Bottom Slant Style */
// }

// .hero-title {
//     font-size: 3.5rem;
//     font-weight: 800;
//     margin-bottom: 20px;
//     text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
// }

// .hero-subtitle {
//     font-size: 1.2rem;
//     margin-bottom: 40px;
//     opacity: 0.9;
// }

// /* 2. Feature Cards */
// .feature-card {
//     border: none;
//     border-radius: 15px;
//     padding: 30px;
//     box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
//     transition: transform 0.3s ease;
//     background: white;
//     text-align: center;
// }

// .feature-card:hover {
//     transform: translateY(-10px);
// }

// .feature-icon {
//     font-size: 3rem;
//     margin-bottom: 20px;
//     color: #c31432;
// }

// /* 3. Buttons */
// .btn-grad-primary {
//     background-image: linear-gradient(to right, #FF512F 0%, #DD2476 51%, #FF512F 100%);
//     margin: 10px;
//     padding: 15px 45px;
//     text-align: center;
//     text-transform: uppercase;
//     transition: 0.5s;
//     background-size: 200% auto;
//     color: white;
//     box-shadow: 0 0 20px #eee;
//     border-radius: 50px;
//     border: none;
//     font-weight: bold;
//     text-decoration: none;
// }

// .btn-grad-primary:hover {
//     background-position: right center;
//     /* change the direction of the change here */
//     color: #fff;
//     text-decoration: none;
// }

// /* 4. Footer */
// .footer {
//     background: #1a1a1a;
//     color: #aaa;
//     padding: 30px 0;
//     text-align: center;
//     margin-top: 50px;
// }

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
            {/* 1. NAVBAR SECTION - Matching image */}
            <nav className="navbar navbar-expand-lg navbar-light shadow-sm fixed-top">
                <div className="container">
                    {/* Logo on left */}
                    <Link className="navbar-brand fw-bold" to="/">
                        <span className="logo-text">LearnSphere🎓</span>
                    </Link>

                    {/* Toggle button for mobile */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        {/* Menu items in center */}
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

                        {/* Theme toggle button on right */}
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

            {/* 2. HERO SECTION (Main Intro) */}
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

            {/* 3. FEATURES SECTION (Why choose us?) */}
            <section className="container my-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold">Why Choose Us?</h2>
                    <p className="text-secondary">We provide the best learning experience for students.</p>
                </div>

                <div className="row">
                    {/* Feature 1 */}
                    <div className="col-md-4 mb-4">
                        <div className="feature-card h-100">
                            <div className="feature-icon">💻</div>
                            <h4>Expert Instructors</h4>
                            <p className="text-secondary">Learn from industry experts who are passionate about teaching.</p>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="col-md-4 mb-4">
                        <div className="feature-card h-100">
                            <div className="feature-icon">⏰</div>
                            <h4>Lifetime Access</h4>
                            <p className="text-secondary">Get unlimited access to your courses and learn at your own pace.</p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="col-md-4 mb-4">
                        <div className="feature-card h-100">
                            <div className="feature-icon">📜</div>
                            <h4>Certified Courses</h4>
                            <p className="text-secondary">Earn certificates upon completion to showcase your skills.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. FOOTER SECTION */}
            <footer className="footer">
                <div className="container">
                    <p className="mb-0">© 2025 E-LearnSphere . All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;




