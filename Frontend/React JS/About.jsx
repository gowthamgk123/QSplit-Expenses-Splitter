import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
    return (
        <div className="app-container">
            <Navbar />
            <div className="center-wrap blog-wrap" style={{ marginTop: '80px', minHeight: 'calc(100vh - 300px)' }}>
                <div className="container blog-container" style={{ border: 'none', boxShadow: 'none' }}>
                    <div className="blog-hero">
                        <h1>About QSplit</h1>
                        <p className="hero-sub" style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
                            We are on a mission to simplify shared finances for everyone.
                        </p>
                        <div className="hero-decoration"></div>
                    </div>

                    <div className="content-section" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                        <p style={{ marginBottom: '1.5rem' }}>
                            QSplit was born out of a simple frustration: the awkwardness of asking friends for money.
                            Whether it's a dinner bill, a shared apartment, or a weekend getaway, splitting costs shouldn't
                            be complicated.
                        </p>
                        <p style={{ marginBottom: '1.5rem' }}>
                            Our platform allows you to track expenses, see balances in real-time, and settle debts integrated
                            payment solutions. We believe that transparency is the key to healthy relationships.
                        </p>
                        <p>
                            Join thousands of users who have streamlined their financial lives with QSplit.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;
