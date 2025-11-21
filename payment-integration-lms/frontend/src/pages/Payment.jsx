import React from 'react';
import { useParams } from 'react-router-dom';

const Payment = () => {
  const { type, id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Payment integration for {type} - ID: {id}</p>
          <p>PayPal and Stripe payment components will be implemented here...</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;