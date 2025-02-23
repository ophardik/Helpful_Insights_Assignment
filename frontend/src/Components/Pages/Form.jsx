import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Form = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [position, setPosition] = useState("");
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_BACKEND_URL || "https://helpful-insights-assignment-1.onrender.com";

    const newCandidate = async (e) => {
        e.preventDefault();
        
        try {
            // Basic form validation
            if (!name.trim() || !email.trim() || !phone.trim() || !position.trim()) {
                toast.error("All fields are required!");
                return;
            }

            // API call
            const response = await axios.post(`${BASE_URL}/api/addCandidate`, {
                name,
                email,
                phone,
                position,
            });

            if (response.status === 201) {
                toast.success("Candidate Added Successfully!");
                setTimeout(() => navigate("/"), 2000); // Redirect after 2 sec
            } else {
                toast.error(response.data.message || "Failed to add candidate.");
            }
        } catch (error) {
            console.error("Error in adding new candidate:", error);
            toast.error(error.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card p-4 shadow-sm" style={{ width: "400px" }}>
                <h2 className="text-center text-primary mb-4">Add New Candidate</h2>
                <form onSubmit={newCandidate}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Phone</label>
                        <input
                            type="tel"
                            className="form-control"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Position</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter position"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Add Candidate
                    </button>
                </form>
            </div>
            <ToastContainer position="top-center" autoClose={2000} />
        </div>
    );
};

export default Form;
