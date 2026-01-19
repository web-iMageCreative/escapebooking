import React, { useState } from 'react';
import { AuthService } from '../AuthService';
import { LoginCredentials } from '../../users/UserModel';
import './LoginForm.css';

const LoginForm: React.FC = () => {
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const response = await AuthService.login(credentials);
            
            if (response.success) {
                localStorage.setItem('auth_token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                window.location.href = '/dashboard';
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>🔐 EscapeBooking Login</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={credentials.email}
                        onChange={(e) => setCredentials({
                            ...credentials,
                            email: e.target.value
                        })}
                        placeholder="admin@escapebooking.com"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({
                            ...credentials,
                            password: e.target.value
                        })}
                        placeholder="password"
                        required
                    />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                
                <div className="test-credentials">
                    <h4>Test Accounts:</h4>
                    <p><strong>Admin:</strong> admin@escapebooking.com / password</p>
                    <p><strong>Owner:</strong> madrid@escaperooms.com / password</p>
                    <p><strong>Customer:</strong> juan.perez@gmail.com / password</p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;