import React, { useState, useEffect } from 'react';

const Navbar = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            setIsDark(true);
        } else {
            document.body.classList.remove('dark-mode');
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    };

    return (
        <nav className="navbar">
            <a href="/blog" className="nav-brand" style={{ textDecoration: 'none' }}>QSplit</a>
            <div className="nav-right">
                <div className="nav-links">
                    <a href="/split" className="nav-link">Split</a>
                    <a href="/history" className="nav-link">History</a>
                </div>
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle Dark Mode"
                    style={{ marginLeft: '10px' }}
                >
                    {isDark ? '☀️' : '🌙'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
