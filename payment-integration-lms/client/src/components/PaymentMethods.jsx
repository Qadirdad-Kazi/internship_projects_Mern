import React, { useState } from 'react';
import axios from 'axios';

const PaymentMethods = ({ course, onSuccess }) => {
    const [method, setMethod] = useState('jazzcash');
    const [mobileNumber, setMobileNumber] = useState('');
    const [cnic, setCnic] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const endpoint = method === 'jazzcash'
                ? 'http://localhost:5000/api/payment/jazzcash'
                : 'http://localhost:5000/api/payment/easypaisa';

            const payload = {
                amount: course.price,
                mobileNumber,
                cnic: method === 'jazzcash' ? cnic : undefined,
                email: 'user@example.com' // Should come from user context
            };

            const response = await axios.post(endpoint, payload);

            if (response.data.success) {
                setMessage(`Payment Initiated! Check your phone (${mobileNumber}) for a prompt.`);
                // Simulate success after a delay for demo purposes
                setTimeout(() => {
                    onSuccess({ status: 'COMPLETED', method });
                }, 3000);
            } else {
                setMessage('Payment failed to initiate.');
            }
        } catch (error) {
            console.error(error);
            setMessage('Error processing request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setMethod('jazzcash')}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        border: method === 'jazzcash' ? '2px solid #ef4444' : '1px solid #334155',
                        background: method === 'jazzcash' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    JazzCash
                </button>
                <button
                    onClick={() => setMethod('easypaisa')}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        border: method === 'easypaisa' ? '2px solid #22c55e' : '1px solid #334155',
                        background: method === 'easypaisa' ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    EasyPaisa
                </button>
            </div>

            <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Mobile Number</label>
                    <input
                        type="text"
                        placeholder="03XXXXXXXXX"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #334155',
                            background: '#0f172a',
                            color: 'white'
                        }}
                    />
                </div>

                {method === 'jazzcash' && (
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>CNIC (Last 6 Digits)</label>
                        <input
                            type="text"
                            placeholder="123456"
                            value={cnic}
                            onChange={(e) => setCnic(e.target.value)}
                            required
                            maxLength={6}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #334155',
                                background: '#0f172a',
                                color: 'white'
                            }}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ marginTop: '1rem', background: method === 'jazzcash' ? '#ef4444' : '#22c55e' }}
                >
                    {loading ? 'Processing...' : `Pay with ${method === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'}`}
                </button>
            </form>

            {message && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default PaymentMethods;
