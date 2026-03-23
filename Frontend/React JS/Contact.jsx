import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = e.target[0].value;
        const email = e.target[1].value;
        const message = e.target[2].value;

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                alert('Failed to submit feedback. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback.');
        }
    };

    return (
        <div className="app-container">
            <Navbar />
            <style>
                {`
                    .creator-card {
                        background: var(--card-bg);
                        padding: 2rem;
                        border-radius: 16px;
                        border: 1px solid var(--border-color);
                        text-align: center;
                        box-shadow: var(--shadow-sm);
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                    .creator-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                        border-color: var(--primary);
                    }
                    .creator-initial {
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(135deg, var(--primary), var(--primary-light));
                        color: white;
                        border-radius: 50%;
                        font-size: 2rem;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 1.5rem;
                    }
                    .creators-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 2rem;
                        justify-content: center;
                    }
                    @media (max-width: 768px) {
                        .creators-grid {
                            grid-template-columns: 1fr; /* Stack on mobile */
                        }
                    }
                `}
            </style>
            <div className="center-wrap blog-wrap" style={{ marginTop: '80px', minHeight: 'calc(100vh - 300px)' }}>
                <div className="container blog-container" style={{ border: 'none', boxShadow: 'none' }}>
                    {/* Creators Section */}
                    <div style={{ maxWidth: '1000px', margin: '0 auto 4rem', padding: '0 20px' }}>
                        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '3rem', fontSize: '2rem', fontWeight: '700' }}>Creators & Developers</h2>
                        <div className="creators-grid">
                            {/* Person 1 */}
                            <div className="creator-card">
                                <div className="creator-initial">R</div>
                                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>R. Surya Sishwik</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.95rem' }}>surya.rachaputi@gmail.com</p>
                                <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.95rem' }}>+91 63044 28040</p>
                            </div>

                            {/* Person 2 */}
                            <div className="creator-card">
                                <div className="creator-initial">M</div>
                                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>M. Yashodhar Sai</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.95rem' }}>yashodharsai9706@gmail.com</p>
                                <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.95rem' }}>+91 93987 72708</p>
                            </div>

                            {/* Person 3 */}
                            <div className="creator-card">
                                <div className="creator-initial">A</div>
                                <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>A. Gowtham Kumar</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.95rem' }}>akigowthamkumar@gmail.com</p>
                                <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.95rem' }}>+91 63005 19857</p>
                            </div>
                        </div>
                    </div>

                    <div className="blog-hero" style={{
                        marginBottom: '2rem',
                        maxWidth: '700px',
                        margin: '0 auto 2rem',
                        background: 'var(--card-bg)',
                        padding: '3rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(26, 35, 126, 0.1)'
                    }}>
                        <h1 style={{ color: 'var(--primary)' }}>Contact Us</h1>
                        <p className="hero-sub" style={{ maxWidth: '600px', margin: '0 auto 2rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                            Have questions or feedback? We'd love to hear from you.
                        </p>
                        <div className="hero-decoration" style={{ background: 'linear-gradient(90deg, #1a237e, #283593)' }}></div>
                    </div>

                    <div className="content-section" style={{
                        maxWidth: '700px',
                        margin: '0 auto',
                        background: 'var(--card-bg)',
                        padding: '3rem',
                        borderRadius: '24px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        border: '1px solid var(--border-color)',
                        position: 'relative',
                        zIndex: 10
                    }}>
                        {!submitted ? (
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Name</label>
                                    <input required type="text" placeholder="Your Name" style={{
                                        background: 'var(--input-bg)',
                                        color: 'var(--text-main)'
                                    }} />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Email</label>
                                    <input required type="email" placeholder="your@email.com" style={{
                                        background: 'var(--input-bg)',
                                        color: 'var(--text-main)'
                                    }} />
                                </div>
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Message</label>
                                    <textarea required rows="5" placeholder="How can we help?" style={{
                                        background: 'var(--input-bg)',
                                        color: 'var(--text-main)',
                                        minHeight: '150px'
                                    }}></textarea>
                                </div>
                                <button type="submit" className="btn-primary" style={{
                                    width: '100%',
                                    padding: '16px',
                                    fontSize: '1.1rem',
                                    borderRadius: '12px',
                                    background: '#1a237e', // Explicit dark blue
                                    boxShadow: '0 4px 6px rgba(26, 35, 126, 0.2)'
                                }}>Send Message</button>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.8rem' }}>Message Sent!</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Thank you for reaching out. We'll get back to you shortly.</p>
                                <button onClick={() => setSubmitted(false)} className="btn-secondary" style={{ marginTop: '2rem', padding: '12px 24px', fontSize: '1rem', borderRadius: '12px' }}>Send Another</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
