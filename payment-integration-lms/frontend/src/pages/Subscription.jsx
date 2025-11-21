import React from 'react';
import { Crown } from 'lucide-react';

const Subscription = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600">Upgrade to premium for unlimited access</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Basic Plan</h3>
            <div className="text-3xl font-bold text-blue-600 mb-4">$9.99/month</div>
            <ul className="space-y-2 mb-6">
              <li>✓ Access to basic courses</li>
              <li>✓ Email support</li>
              <li>✓ Mobile access</li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Choose Basic</button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-2 border-yellow-400">
            <div className="bg-yellow-400 text-black px-3 py-1 rounded text-sm font-medium mb-4 inline-block">
              Most Popular
            </div>
            <h3 className="text-xl font-bold mb-4">Premium Plan</h3>
            <div className="text-3xl font-bold text-purple-600 mb-4">$19.99/month</div>
            <ul className="space-y-2 mb-6">
              <li>✓ Access to all courses</li>
              <li>✓ Priority support</li>
              <li>✓ Mobile access</li>
              <li>✓ Downloadable content</li>
              <li>✓ Certificates</li>
            </ul>
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg">Choose Premium</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;