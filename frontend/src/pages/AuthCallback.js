import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');

        if (token && userId) {
            // Store token and userId in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);

            // Small delay to ensure state updates
            setTimeout(() => {
                navigate('/dashboard');
            }, 500);
        } else {
            // No token/userId in URL, redirect to login with error
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        }
    }, [searchParams, navigate]);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Processing LinkedIn Login...</h2>
            <p>Please wait while we set up your account.</p>
            <div style={{ marginTop: '20px' }}>
                <div style={{
                    display: 'inline-block',
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #0A66C2',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default AuthCallback;
