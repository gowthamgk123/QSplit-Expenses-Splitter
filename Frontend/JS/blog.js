import { initTheme, bindThemeToggle, toggleTheme } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    bindThemeToggle();

    // No duplicate listener needed


    const authContainer = document.getElementById('auth-buttons');
    if (authContainer) {
        fetch('/api/auth-status')
            .then(res => res.json())
            .then(data => {
                if (data.isLoggedIn) {
                    authContainer.innerHTML = `
                        <a href="/logout" class="btn-nav">Log Out</a>
                    `;
                } else {
                    // Update wrapper style for gap
                    authContainer.style.display = 'flex';
                    authContainer.style.gap = '12px';
                    authContainer.innerHTML = `
                        <a href="/login" class="btn-nav">Sign In</a>
                        <a href="/signup" class="btn-nav primary">Sign Up</a>
                    `;
                }
            })
            .catch(err => console.error('Auth check failed', err));
    }

    const goBtn = document.getElementById('go-to-app-btn');
    if (goBtn) {
        goBtn.addEventListener('click', () => {
            // Logic to redirect based on auth? For now just go to split, which redirects to login if needed
            window.location.href = '/split';
        });
    }
});
