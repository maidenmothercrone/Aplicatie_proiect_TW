import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { candidatesService } from '../services/candidatesService';
import { authService } from '../services/authService';

const Dashboard = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        summary: 'active'
    });

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            const data = await candidatesService.getAll();
            setCandidates(data);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleOpenModal = (candidate = null) => {
        if (candidate) {
            setFormData(candidate);
            setEditingId(candidate.id);
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                summary: 'active'
            });
            setEditingId(null);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        try {
            if (editingId) {
                // Update
                await candidatesService.update(editingId, formData);
            } else {
                // Create
                const userId = parseInt(authService.getUserId());
                await candidatesService.create({
                    userId,
                    ...formData
                });
            }
            fetchCandidates();
            handleCloseModal();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this candidate?')) {
            try {
                await candidatesService.delete(id);
                fetchCandidates();
            } catch (err) {
                alert('Error: ' + err.message);
            }
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <h1>Dashboard - Candidates</h1>
                <div>
                    <button
                        onClick={() => handleOpenModal()}
                        style={{
                            padding: '10px 20px',
                            marginRight: '10px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        ➕ Add Candidate
                    </button>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <p>Valar Morghulis, {user?.firstName}! 👋</p>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            <h2>Candidates ({candidates.length})</h2>
            {candidates.length === 0 ? (
                <p>No candidates yet. Click "Add Candidate" to get started!</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f0f0f0' }}>
                            <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Name</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Email</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Phone</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Status</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map(candidate => (
                            <tr key={candidate.id}>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                    {candidate.firstName} {candidate.lastName}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{candidate.email}</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                    {candidate.phoneNumber || '-'}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                    <span
                                        style={{
                                            padding: '5px 10px',
                                            borderRadius: '3px',
                                            backgroundColor:
                                                candidate.summary === 'active'
                                                    ? '#d4edda'
                                                    : candidate.summary === 'hired'
                                                        ? '#cce5ff'
                                                        : '#f8d7da',
                                            fontSize: '12px'
                                        }}
                                    >
                                        {candidate.summary}
                                    </span>
                                </td>
                                <td
                                    style={{
                                        border: '1px solid #ddd',
                                        padding: '10px',
                                        textAlign: 'center',
                                        display: 'flex',
                                        gap: '5px',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <button
                                        onClick={() => handleOpenModal(candidate)}
                                        style={{
                                            padding: '5px 10px',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '3px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(candidate.id)}
                                        style={{
                                            padding: '5px 10px',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '3px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        🗑️ Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal */}
            {showModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '30px',
                            borderRadius: '10px',
                            width: '90%',
                            maxWidth: '500px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        <h2>{editingId ? 'Edit Candidate' : 'Add New Candidate'}</h2>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Phone Number
                            </label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Status
                            </label>
                            <select
                                name="summary"
                                value={formData.summary}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="hired">Hired</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleCloseModal}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                {editingId ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;