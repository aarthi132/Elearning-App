import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './Login.css';

function Login() {
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

        axios.post('http://localhost:3001/login', { email, password })
            .then(result => {
                console.log("Login Result:", result.data);

                if (result.data.status === "Success") {
                    localStorage.setItem("userId", result.data.id);
                    localStorage.setItem("role", result.data.role);
                    localStorage.setItem("email", email);

                    if (result.data.role === "admin") {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/student/dashboard');
                    }
                } else {
                    alert("Login Failed: " + result.data);
                }
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong. Please try again.");
            });
    }

    return (
        <div className="login-page">
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

                <h2>Welcome Back</h2>
                <p className="signup-subtitle">Login to continue your learning journey!</p>

                <form onSubmit={handleSubmit}>
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
                            placeholder="Enter your password"
                            className="form-input"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-signup">Login</button>
                </form>

                <div className="login-section">
                    <p className="login-text">Don't have an account?</p>
                    <Link to="/signup" className="btn-login">Create Account</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;

