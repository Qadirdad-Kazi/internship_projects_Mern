import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--card-bg)',
            padding: '3rem 2rem',
            marginTop: '5rem',
            borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                <div>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>LMS Premium</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        Empowering learners worldwide with expert-led premium courses.
                    </p>
                </div>
                <div>
                    <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Home</li>
                        <li style={{ marginBottom: '0.5rem' }}>Courses</li>
                        <li style={{ marginBottom: '0.5rem' }}>Instructors</li>
                        <li style={{ marginBottom: '0.5rem' }}>Pricing</li>
                    </ul>
                </div>
                <div>
                    <h4 style={{ marginBottom: '1rem' }}>Support</h4>
                    <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)' }}>
                        <li style={{ marginBottom: '0.5rem' }}>FAQ</li>
                        <li style={{ marginBottom: '0.5rem' }}>Contact Us</li>
                        <li style={{ marginBottom: '0.5rem' }}>Terms of Service</li>
                        <li style={{ marginBottom: '0.5rem' }}>Privacy Policy</li>
                    </ul>
                </div>
                <div>
                    <h4 style={{ marginBottom: '1rem' }}>Connect</h4>
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)' }}>
                        <span>Twitter</span>
                        <span>LinkedIn</span>
                        <span>GitHub</span>
                    </div>
                </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                &copy; {new Date().getFullYear()} LMS Premium. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
