import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import { authService } from '../services/authService';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try{
            await authService.register(formData.email, formData.password, formData.firstName, formData.lastName);
            navigate('/login');
        } catch (error){
            setError(error.response?.data?.message || 'Registration failed 😞');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email 📨"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password 🔒"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
                />
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
                    {loading ? 'Checking info 🔍' : 'Register'}
                </button>
            </form>
            <p>Already have account? <Link to="/login">Login here 🔑</Link></p>
        </div>
    );

};

export default Register;