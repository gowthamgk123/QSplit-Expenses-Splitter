import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms = () => {
    return (
        <div className="app-container">
            <Navbar />
            <div className="center-wrap blog-wrap" style={{ marginTop: '80px', minHeight: 'calc(100vh - 300px)' }}>
                <div className="container blog-container" style={{ border: 'none', boxShadow: 'none' }}>
                    <div className="blog-hero">
                        <h1>Terms & Conditions</h1>
                        <div className="hero-decoration"></div>
                    </div>

                    <div className="content-section" style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-main)', paddingBottom: '4rem' }}>
                        <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                            Last updated: December 20, 2025
                        </p>

                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem', color: 'var(--primary)' }}>1. Acceptance of Terms</h2>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                            By accessing and using QSplit ("the Service"), you agree to comply with and be bound by these Terms and Conditions.
                            If you do not agree to these terms, please do not use our Service.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem', color: 'var(--primary)' }}>2. Expense Tracking & Settlement</h2>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                            QSplit provides a platform for tracking shared expenses. While we facilitate the calculation of debts,
                            we are not responsible for the actual transfer of funds between users. All payments made through third-party
                            UPI apps or payment gateways are subject to their respective terms.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem', color: 'var(--primary)' }}>3. User Responsibilities</h2>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                            You are responsible for the accuracy of expense data entered into the system. QSplit is not liable for
                            disputes arising from incorrect entries or misunderstandings between group members.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem', color: 'var(--primary)' }}>4. Privacy & Data</h2>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                            We collect minimal data necessary to provide our service (such as names and expense details).
                            We do not sell your personal data to third parties.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem', color: 'var(--primary)' }}>5. Limitation of Liability</h2>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                            QSplit is provided "as is". We make no warranties regarding the continuity or error-free operation of the service.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Terms;
