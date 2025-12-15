import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import AdminDashboard from './AdminDashboard'
import StudentDashboard from './StudentDashboard'
import MyCourses from './myCourses';

function App() {
    return (
        <Routes>
            {/* 👇 MUKKIYAM: path="/" nu potta thaan, open pannathum Home varum */}
            <Route path="/" element={<Home />}></Route>

            {/* Auth Routes */}
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/register" element={<Signup />}></Route>
            <Route path="/login" element={<Login />}></Route>

            {/* Dashboard Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
            <Route path="/student/dashboard" element={<StudentDashboard />}></Route>

            {/* Course Route */}
            <Route path="/my-courses" element={<MyCourses />}></Route>

        </Routes>
    )
}

export default App


