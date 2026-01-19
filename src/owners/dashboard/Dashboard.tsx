import React, { useEffect, useState } from 'react';
import { AuthService } from '../../auth/AuthService';
import { User } from '../../users/UserModel';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!AuthService.isAuthenticated()) {
            window.location.href = '/login';
            return;
        }
        
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);
    
    const handleLogout = () => {
        AuthService.logout();
        window.location.href = '/login';
    };
    
    if (loading) {
        return <div className="loading">Loading user data...</div>;
    }
    
    if (!user) {
        return <div>No user data found. <a href="/login">Login again</a></div>;
    }
    
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>🎪 EscapeBooking Dashboard</h1>
                <div className="user-info">
                    <span>Welcome, <strong>{user.email}</strong></span>
                    <span className="role-badge">{user.role_name}</span>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </header>
            
            <main className="dashboard-content">
                <div className="dashboard-card">
                    <h3>👤 User Information</h3>
                    <div className="user-details">
                        <p><strong>ID:</strong> {user.id}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role_name}</p>
                        <p><strong>Active:</strong> {user.is_active ? '✅ Yes' : '❌ No'}</p>
                        <p><strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                
                <div className="dashboard-card">
                    <h3>🚀 Quick Actions</h3>
                    <div className="actions">
                        
                        {user.role_name === 'owner' && (
                            <>
                                <button className="action-btn">My Escape Rooms</button>
                                <button className="action-btn">Add New Room</button>
                                <button className="action-btn">View Bookings</button>
                            </>
                        )}
                    </div>
                </div>
                
                <div className="dashboard-card">
                    <h3>🔐 Auth Debug</h3>
                    <pre className="debug-info">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                    <p>Token exists: {AuthService.isAuthenticated() ? '✅ Yes' : '❌ No'}</p>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;