import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import './Signup.css';

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

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

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/signup', { name, email, password })
            .then(result => {
                console.log(result);
                alert("Registration Successful! Please Login.");
                navigate('/login');
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="signup-page">
            {/* Theme Toggle Button */}
            <button
                className="theme-toggle-signup-btn"
                onClick={toggleTheme}
                aria-label="Toggle dark/light mode"
            >
                <span className="theme-icon">
                    {darkMode ? '🌙' : '☀'}
                </span>
            </button>

            {/* Back to Home Button */}
            <Link to="/" className="back-to-home">
                ← Back to Home
            </Link>

            <div className="signup-card">
                {/* Logo */}
                <div className="signup-logo">
                    <span className="logo-text">LearnSphere</span>
                </div>

                <h2>Create Account</h2>
                <p className="signup-subtitle">Join our learning community and start your journey!</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            className="form-input"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="form-input"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Create a strong password"
                            className="form-input"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-signup">Create Account</button>
                </form>

                <div className="login-section">
                    <p className="login-text">Already have an account?</p>
                    <Link to="/login" className="btn-login">Login</Link>
                </div>
            </div>
            {/* Footer */}
            <footer className="signup-footer">
                <div className="container">
                    <p className="mb-0">© 2025 E-Learning App. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Signup;


