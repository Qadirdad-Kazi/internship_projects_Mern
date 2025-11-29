const axios = require('axios');

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_URL } = process.env;

const generateAccessToken = async () => {
    try {
        const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_CLIENT_SECRET).toString('base64');
        const response = await axios.post(`${PAYPAL_API_URL}/v1/oauth2/token`, 'grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Failed to generate Access Token:', error.message);
        throw error;
    }
};

const createOrder = async (req, res) => {
    try {
        const { courseId, amount } = req.body; // Expecting course details
        // In a real app, validate price from DB using courseId

        const accessToken = await generateAccessToken();
        const url = `${PAYPAL_API_URL}/v2/checkout/orders`;

        const payload = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: amount || '10.00', // Default or dynamic
                    },
                    description: `Course ID: ${courseId}`,
                },
            ],
        };

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating order:', error.message);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

const captureOrder = async (req, res) => {
    try {
        const { orderID } = req.body;
        const accessToken = await generateAccessToken();
        const url = `${PAYPAL_API_URL}/v2/checkout/orders/${orderID}/capture`;

        const response = await axios.post(url, {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Here you would update the database to grant access to the user
        // const { payer } = response.data;
        // await grantAccess(userId, courseId);

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error capturing order:', error.message);
        res.status(500).json({ error: 'Failed to capture order' });
    }
};

module.exports = {
    createOrder,
    captureOrder,
};
