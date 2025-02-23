import React, {useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
    const [candidates, setCandidates] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false); // Centralized loader for actions
    const [editMode, setEditMode] = useState(false);
    const [editCandidate, setEditCandidate] = useState({ name: "", email: "", phone: "", position: "", id: "" });

    const BASE_URL = process.env.REACT_APP_BACKEND_URL || "https://helpful-insights-assignment-4.onrender.com";
    const candidatesPerPage = 4;

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/allCandidate`);
            setCandidates(response.data.structured);
        } catch (error) {
            toast.error("Failed to fetch candidates.");
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchCandidates();
    }, []);

    // Delete candidate
    const deleteCandidate = async (id) => {
        setActionLoading(true); // Show central loading spinner
        try {
            await axios.delete(`${BASE_URL}/api/deleteCandidate/${id}`);
            toast.success("Candidate deleted successfully!");
            setCandidates((prev) => prev.filter((candidate) => candidate.id !== id));
        } catch (error) {
            toast.error("Failed to delete candidate.");
        } finally {
            setActionLoading(false); // Hide loading after action
        }
    };

    // Open edit form
    const openEditForm = (candidate) => {
        setEditCandidate(candidate);
        setEditMode(true);
    };

    // Close edit form
    const closeEditForm = () => {
        setEditMode(false);
        setEditCandidate({ name: "", email: "", phone: "", position: "", id: "" });
    };

    // Update candidate details
    const updateCandidate = async () => {
        setActionLoading(true);
        try {
            const { id, name, email, phone, position } = editCandidate;
            await axios.patch(`${BASE_URL}/api/updateDetails`, { id, name, email, phone, position });

            toast.success("Candidate updated successfully!");
            setCandidates((prev) =>
                prev.map((candidate) => (candidate.id === id ? { ...candidate, name, email, phone, position } : candidate))
            );
            closeEditForm();
        } catch (error) {
            toast.error("Failed to update candidate.");
        } finally {
            setActionLoading(false);
        }
    };

    const startIndex = currentPage * candidatesPerPage;
    const endIndex = startIndex + candidatesPerPage;
    const paginatedCandidates = candidates.slice(startIndex, endIndex);

    return (
        <div className="container-fluid d-flex vh-100">
            {/* Central Loading Spinner (Only when an action is in progress) */}
            {actionLoading && (
                <div className="position-fixed top-50 start-50 translate-middle">
                    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Processing...</span>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <div className="col-md-3 bg-light p-4">
                <h2 className="mb-3">Candidates</h2>
                <Link to="/addNewCandidate">
                    <button className="btn btn-primary w-100 mb-3">Add New Candidate</button>
                </Link>

                {loading ? (
                    <div className="text-center mt-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <ul className="list-group">
                        {paginatedCandidates.map((item, index) => (
                            <li
                                key={item.id}
                                className={`list-group-item d-flex justify-content-between align-items-center ${selectedCandidate === item ? "active" : ""
                                    }`}
                                onClick={() => setSelectedCandidate(item)}
                                style={{ cursor: "pointer" }}
                            >
                                <span>{startIndex + index + 1}. {item.name}</span>
                                <div>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditForm(item);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteCandidate(item.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Pagination */}
                <div className="mt-3 d-flex justify-content-between">
                    <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} disabled={currentPage === 0} className="btn btn-secondary">
                        Previous
                    </button>
                    <button onClick={() => setCurrentPage((prev) => (endIndex < candidates.length ? prev + 1 : prev))} className="btn btn-secondary">
                        Next
                    </button>
                </div>
            </div>

            {/* Candidate Details */}
            <div className="col-md-9 p-4">
                {selectedCandidate ? (
                    <div className="card p-4">
                        <h2 className="text-primary">{selectedCandidate.name}</h2>
                        <p><strong>Email:</strong> {selectedCandidate.email}</p>
                        <p><strong>Phone:</strong> {selectedCandidate.phone}</p>
                        <p><strong>Position:</strong> {selectedCandidate.position}</p>
                    </div>
                ) : (
                    <p className="text-muted">Select a candidate to view details</p>
                )}
            </div>

            {/* Edit Candidate Form (Modal) */}
            {editMode && (
    <div className="modal d-block bg-dark bg-opacity-50">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Edit Candidate</h5>
                    <button className="btn-close" onClick={closeEditForm}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <input type="text" className="form-control mb-2" placeholder="Name" value={editCandidate.name} onChange={(e) => setEditCandidate({ ...editCandidate, name: e.target.value })} />
                        <input type="email" className="form-control mb-2" placeholder="Email" value={editCandidate.email} onChange={(e) => setEditCandidate({ ...editCandidate, email: e.target.value })} />
                        <input type="text" className="form-control mb-2" placeholder="Phone" value={editCandidate.phone} onChange={(e) => setEditCandidate({ ...editCandidate, phone: e.target.value })} />
                        <input type="text" className="form-control mb-2" placeholder="Position" value={editCandidate.position} onChange={(e) => setEditCandidate({ ...editCandidate, position: e.target.value })} />
                    </form>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={closeEditForm}>Cancel</button>
                    <button className="btn btn-primary" onClick={updateCandidate} disabled={actionLoading}>
                        {actionLoading ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>
        </div>
    </div>
)}

            <ToastContainer position="top-center" autoClose={2000} />
        </div>
    );
};

export default Home;
