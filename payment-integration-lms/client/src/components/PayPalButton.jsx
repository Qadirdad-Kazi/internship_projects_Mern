import React, { useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import axios from 'axios';

const PayPalButton = ({ course, onSuccess }) => {
    const [{ isPending }] = usePayPalScriptReducer();
    const [error, setError] = useState(null);

    const createOrder = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/payment/create-order', {
                courseId: course.id,
                amount: course.price,
            });
            return response.data.id;
        } catch (err) {
            setError("Could not initiate payment.");
            console.error(err);
            throw err;
        }
    };

    const onApprove = async (data) => {
        try {
            const response = await axios.post('http://localhost:5000/api/payment/capture-order', {
                orderID: data.orderID,
            });
            onSuccess(response.data);
        } catch (err) {
            setError("Payment failed during capture.");
            console.error(err);
        }
    };

    return (
        <div style={{ marginTop: '1rem', position: 'relative', zIndex: 0 }}>
            {isPending && <div style={{ color: 'white' }}>Loading PayPal...</div>}
            {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
            <PayPalButtons
                style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </div>
    );
};

export default PayPalButton;
