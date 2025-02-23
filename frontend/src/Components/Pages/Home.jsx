import React, { useEffect, useState } from "react";
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
    const [editMode, setEditMode] = useState(false);
    const [editCandidate, setEditCandidate] = useState({ name: "", email: "", phone: "", position: "", id: "" });

    const candidatesPerPage = 4;
    useEffect(() => {
        fetchCandidates();
    }, []);
    // Fetch candidates
    const fetchCandidates = async () => {
        try {
            const response = await axios.get("/api/allCandidate");
            setCandidates(response.data.structured);
        } catch (error) {
            console.error("Error fetching candidates", error);
            toast.error("Failed to fetch candidates.");
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <div className="d-flex vh-100 justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
   

    // Delete candidate
    const deleteCandidate = async (id) => {
        try {
            await axios.delete(`/api/deleteCandidate/${id}`);
            toast.success("Candidate deleted successfully!");
            fetchCandidates(); // Refresh list
        } catch (error) {
            console.error("Error deleting candidate", error);
            toast.error("Failed to delete candidate.");
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
        try {
            const { id, name, email, phone, position } = editCandidate;
            await axios.patch("/api/updateDetails", { id, name, email, phone, position });

            toast.success("Candidate updated successfully!");
            fetchCandidates(); // Refresh list
            closeEditForm();
        } catch (error) {
            console.error("Error updating candidate", error);
            toast.error("Failed to update candidate.");
        }
    };

    const startIndex = currentPage * candidatesPerPage;
    const endIndex = startIndex + candidatesPerPage;
    const paginatedCandidates = candidates.slice(startIndex, endIndex);

    const nextPage = () => {
        if (endIndex < candidates.length) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="container-fluid d-flex vh-100">
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
                                key={item._id}
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
                    <button onClick={prevPage} disabled={currentPage === 0} className="btn btn-secondary">
                        Previous
                    </button>
                    <button onClick={nextPage} disabled={endIndex >= candidates.length} className="btn btn-secondary">
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
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" className="form-control"
                                            value={editCandidate.name}
                                            onChange={(e) => setEditCandidate({ ...editCandidate, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control"
                                            value={editCandidate.email}
                                            onChange={(e) => setEditCandidate({ ...editCandidate, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Phone</label>
                                        <input type="text" className="form-control"
                                            value={editCandidate.phone}
                                            onChange={(e) => setEditCandidate({ ...editCandidate, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Position</label>
                                        <input type="text" className="form-control"
                                            value={editCandidate.position}
                                            onChange={(e) => setEditCandidate({ ...editCandidate, position: e.target.value })}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeEditForm}>Cancel</button>
                                <button className="btn btn-primary" onClick={updateCandidate}>Save Changes</button>
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


