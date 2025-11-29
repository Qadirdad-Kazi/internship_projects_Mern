import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentMethods from '../components/PaymentMethods';

const Checkout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const course = state?.course;
    const [success, setSuccess] = useState(false);

    if (!course) {
        return <div className="container">Course not found. <button onClick={() => navigate('/')}>Go Back</button></div>;
    }

    const handleSuccess = (details) => {
        setSuccess(true);
        console.log("Payment Successful:", details);
    };

    if (success) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h1 style={{ color: '#10b981', marginBottom: '1rem' }}>Payment Successful!</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>You have successfully enrolled in <strong>{course.title}</strong>.</p>
                    <button className="btn-primary" onClick={() => navigate('/')}>Go to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <button
                onClick={() => navigate(-1)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                ← Back to Courses
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
                <div>
                    <h1 style={{ marginBottom: '2rem' }}>Checkout</h1>
                    <div className="card">
                        <h2 style={{ marginBottom: '1rem' }}>Order Summary</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                            <span>{course.title}</span>
                            <span>${course.price}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>Total</span>
                            <span>${course.price}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 style={{ marginBottom: '1.5rem' }}>Payment Details</h2>
                    <div className="card">
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Select your preferred mobile wallet.</p>
                        <PaymentMethods course={course} onSuccess={handleSuccess} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
