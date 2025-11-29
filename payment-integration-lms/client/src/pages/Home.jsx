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
        <div>
            {/* Hero Section - Full Width */}
            <section style={{
                position: 'relative',
                height: '80vh',
                minHeight: '500px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: '4rem'
            }}>
                {/* Background Image with Blur */}
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '-20px',
                    right: '-20px',
                    bottom: '-20px',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(8px) brightness(0.4)',
                    zIndex: -1
                }}></div>

                {/* Centered Content */}
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    maxWidth: '800px',
                    zIndex: 1
                }}>
                    <h1 style={{
                        fontSize: '4rem',
                        marginBottom: '1.5rem',
                        fontWeight: '800',
                        textShadow: '0 4px 6px rgba(0,0,0,0.3)',
                        background: 'linear-gradient(to bottom right, #ffffff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Master New Skills <br /> with Premium Courses
                    </h1>
                    <p style={{
                        color: '#e2e8f0',
                        fontSize: '1.5rem',
                        marginBottom: '2.5rem',
                        lineHeight: '1.6',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        Unlock your potential with our expert-led courses. Learn from the best and advance your career today.
                    </p>
                    <button
                        className="btn-primary"
                        style={{
                            fontSize: '1.25rem',
                            padding: '1rem 3rem',
                            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                        }}
                        onClick={() => document.getElementById('courses').scrollIntoView({ behavior: 'smooth' })}
                    >
                        Explore Courses
                    </button>
                </div>
            </section>

            <div className="container">
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
        </div>
    );
};

export default Home;
