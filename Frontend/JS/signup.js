import { initTheme, bindThemeToggle } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    bindThemeToggle();

    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, phone, password })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Signup successful! Please login.');
                window.location.href = '/login';
            } else {
                alert(data.error || 'Signup failed');
            }
        } catch (err) {
            alert('An error occurred. Please try again.');
        }
    });
});
