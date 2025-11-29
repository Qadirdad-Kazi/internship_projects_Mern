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
            {/* Hero Section */}
            <section style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '5rem',
                padding: '2rem 0',
                gap: '2rem',
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        marginBottom: '1.5rem',
                        background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        lineHeight: '1.1'
                    }}>
                        Master New Skills <br /> with Premium Courses
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '500px' }}>
                        Unlock your potential with our expert-led courses. Learn from the best and advance your career today.
                    </p>
                    <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }} onClick={() => document.getElementById('courses').scrollIntoView({ behavior: 'smooth' })}>
                        Explore Courses
                    </button>
                </div>
                <div style={{ flex: '1', minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
                    <img
                        src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="Education"
                        style={{
                            width: '100%',
                            maxWidth: '500px',
                            borderRadius: '1rem',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            transform: 'perspective(1000px) rotateY(-5deg)',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) scale(1.02)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'perspective(1000px) rotateY(-5deg)'}
                    />
                </div>
            </section>

            <header id="courses" style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    Available Courses
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Choose the perfect course for your goals.</p>
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
