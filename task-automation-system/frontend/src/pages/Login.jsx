import React, { useState } from 'react';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
            gap: '2rem'
        }}>
            <h1 style={{
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, var(--primary) 0%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                Task Automation
            </h1>

            <form onSubmit={handleSubmit} className="task-form" style={{
                gridTemplateColumns: '1fr',
                width: '100%',
                maxWidth: '400px',
                margin: 0
            }}>
                <div className="form-group">
                    <label style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                    Enter Dashboard
                </button>
            </form>
        </div>
    );
}
