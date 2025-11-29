import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: 'var(--card-bg)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>LMS Premium</Link>
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '500' }}>Home</Link>
                <a href="#courses" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '500' }}>Courses</a>
                <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>About</span>
                <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>Contact</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{
                    background: 'transparent',
                    border: '1px solid var(--primary)',
                    color: 'var(--primary)',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem'
                }}>Login</button>
                <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Sign Up</button>
            </div>
        </nav>
    );
};

export default Navbar;
