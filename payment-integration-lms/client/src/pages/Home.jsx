import React from 'react';
import { useNavigate } from 'react-router-dom';

const courses = [
    { id: 1, title: 'Advanced React Patterns', price: '49.99', description: 'Master React with advanced patterns and techniques.', level: 'Advanced' },
    { id: 2, title: 'Node.js Microservices', price: '59.99', description: 'Build scalable microservices with Node.js and Docker.', level: 'Expert' },
    { id: 3, title: 'Full Stack MERN Bootcamp', price: '99.99', description: 'Become a full stack developer from scratch.', level: 'Beginner' },
];

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Premium Courses
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Unlock your potential with our expert-led courses.</p>
            </header>

            <div className="grid">
                {courses.map(course => (
                    <div key={course.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <span className="badge">{course.level}</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>${course.price}</span>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{course.title}</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{course.description}</p>
                        <button
                            className="btn-primary"
                            style={{ width: '100%' }}
                            onClick={() => navigate(`/checkout/${course.id}`, { state: { course } })}
                        >
                            Enroll Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
