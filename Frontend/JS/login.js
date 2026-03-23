import { initTheme, bindThemeToggle } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // We don't have a toggle button on login page, but we should respect the saved preference
    initTheme();
    bindThemeToggle();

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                // Redirect to Blog first instead of dashboard
                window.location.href = '/blog';
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (err) {
            alert('An error occurred. Please try again.');
        }
    });
});
