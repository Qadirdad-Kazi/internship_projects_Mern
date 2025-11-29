# Payment Integration LMS

This project demonstrates a Premium Course Payment Integration using the MERN stack and PayPal.

## Prerequisites

- Node.js installed
- PayPal Developer Account (for Client ID and Secret)

## Setup Instructions

### 1. Backend Setup (Server)

Navigate to the `server` directory:
```bash
cd server
npm install
```

Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Update `.env` with your PayPal credentials:
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`

Start the server:
```bash
npm run dev
```
The server will run on `http://localhost:5000`.

### 2. Frontend Setup (Client)

Navigate to the `client` directory:
```bash
cd client
npm install
```

Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Update `.env` with your PayPal Client ID:
- `VITE_PAYPAL_CLIENT_ID`

Start the client:
```bash
npm run dev
```
The application will run on `http://localhost:5173`.

## Features

- **Premium Course Listing**: Browse available premium courses.
- **Secure Checkout**: Integrated PayPal checkout flow.
- **Backend Validation**: Orders are created and captured securely on the server.
- **Responsive Design**: Modern, dark-themed UI.
