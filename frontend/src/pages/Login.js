import React, {useContext, useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';

const Login = () => {
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try{
            await login(email, password);
            navigate('/dashboard');
        } catch (error){
            setError(error.response?.data?.message || 'Login failed');
        }
        setLoading(false);
    };

    const handleLinkedInLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/linkedin/login';
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Login</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email 📨"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
                />
                <input
                    type="password"
                    placeholder="Password 🔒"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
                />
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
                    {loading ? 'Checking your identity 🔍' : 'Login'}
                </button>
            </form>

            <div style={{ margin: '20px 0', textAlign: 'center' }}>
                <p style={{ color: '#666', fontSize: '14px' }}>Or login with:</p>
            </div>

            <button
                onClick={handleLinkedInLogin}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#0A66C2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '15px'
                }}
            >
                🔗 Login with LinkedIn
            </button>

            <p style={{ textAlign: 'center', fontSize: '14px' }}>
                Don't have an account? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Join our members here 📝</Link>
            </p>
        </div>
    );
};

export default Login;