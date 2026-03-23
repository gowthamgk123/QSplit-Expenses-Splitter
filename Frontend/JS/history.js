import { initTheme, bindThemeToggle } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    bindThemeToggle();

    // Helper for UPI Link
    function generateUPILink(pa, am, note) {
        const params = new URLSearchParams();
        params.append('pa', pa);
        params.append('pn', 'Split Bill');
        params.append('am', am);
        params.append('tn', note);
        return 'upi://pay?' + params.toString();
    }

    // Toggle QR Code Display
    function toggleHistoryQR(btn, id, url) {
        const container = document.getElementById(`qr-container-${id}`);

        // Check if currently visible (flex)
        const isVisible = container.style.display === 'flex';

        if (!isVisible) {
            container.style.display = 'flex';
            // Only generate if empty
            if (container.innerHTML === '') {
                const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
                container.innerHTML = `<img src="${qrURL}" alt="UPI QR Code" style="max-width:100%; height:auto; border-radius: 8px;">`;
            }
            btn.classList.add('active');
            btn.querySelector('span').textContent = 'Hide QR';
        } else {
            container.style.display = 'none';
            btn.classList.remove('active');
            btn.querySelector('span').textContent = 'QR Code';
        }
    }

    // Event Delegation
    document.getElementById('history-list').addEventListener('click', function (e) {
        // Handle Copy Button
        const copyBtn = e.target.closest('.btn-copy');
        if (copyBtn) {
            e.preventDefault();
            const msg = copyBtn.dataset.msg;
            navigator.clipboard.writeText(msg).then(() => {
                const originalHtml = copyBtn.innerHTML;
                copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> <span>Copied!</span>`;
                copyBtn.classList.add('copied');

                setTimeout(() => {
                    copyBtn.innerHTML = originalHtml;
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
            return;
        }

        // Handle QR Button
        const qrBtn = e.target.closest('.btn-qr');
        if (qrBtn) {
            e.preventDefault();
            const id = qrBtn.dataset.id;
            const url = qrBtn.dataset.url;
            toggleHistoryQR(qrBtn, id, url);
        }

        // Handle Delete Button
        const deleteBtn = e.target.closest('.btn-delete');
        if (deleteBtn) {
            e.preventDefault();
            const id = deleteBtn.dataset.id;
            if (confirm('Are you sure you want to delete this transaction?')) {
                deleteExpense(id);
            }
        }
    });

    async function deleteExpense(id) {
        try {
            const res = await fetch(`/api/history/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (res.ok) {
                // Refresh history
                loadHistory();
            } else {
                alert(data.error || 'Failed to delete expense');
            }
        } catch (e) {
            console.error('Delete error:', e);
            alert('Error deleting transaction');
        }
    }

    async function loadHistory() {
        try {
            // Prevent API caching
            const res = await fetch('/api/history?t=' + Date.now());
            const expenses = await res.json();
            console.log('History data:', expenses);

            const list = document.getElementById('history-list');
            const summary = document.getElementById('history-summary');

            if (!expenses || expenses.length === 0) {
                if (summary) summary.innerHTML = '';
                list.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 15px;"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                        <p style="color: #666;">No transaction history found.</p>
                        <a href="/split" style="display: inline-block; margin-top: 10px; color: var(--primary-color); text-decoration: none; font-weight: 500;">Start a new split &rarr;</a>
                    </div>
                `;
                return;
            }

            let html = '';
            expenses.forEach(exp => {
                const date = new Date(exp.date).toLocaleString('en-IN', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });

                let participantsHtml = '';
                if (exp.participants) {
                    participantsHtml = '<ul class="participant-list">';
                    exp.participants.forEach(p => {
                        // Explicitly check for name
                        const hasName = (p.name && p.name !== 'undefined' && p.name.trim() !== '');

                        // Generate Action Links
                        const cleanPhone = (p.phone.match(/\d{10}$/) || [])[0] || '';
                        const memberName = hasName ? p.name : 'Friend';
                        const amt = p.amount.toFixed(2);
                        const receiverName = exp.receiver || 'Receiver';

                        const waLink = cleanPhone ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hi ${memberName}, your share is ₹${amt} for the bill paid by ${receiverName}. Please pay appropriately.`)}` : '#';

                        const upiLink = generateUPILink(exp.receiver, amt, `Split: ${memberName}`);
                        const uniqueId = `${exp._id}-${(p.phone || '').replace(/\D/g, '')}-${Math.random().toString(36).substr(2, 5)}`;

                        participantsHtml += `
                            <li class="participant-item">
                                <div class="participant-content">
                                    <div class="participant-info">
                                        ${hasName ? `<span class="participant-name">${p.name}</span>` : ''}
                                        <span class="participant-phone">${p.phone}</span>
                                    </div>
                                    <div class="participant-amount-wrapper">
                                        <span class="participant-amount">₹${amt}</span>
                                    </div>
                                </div>
                                <div class="action-buttons-wrapper">
                                    <div class="action-buttons-row">
                                        <a href="${cleanPhone ? waLink : '#'}" target="_blank" class="action-btn btn-whatsapp ${!cleanPhone ? 'disabled' : ''}" title="Send WhatsApp Reminder">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0 .5-.5a.5.5 0 0 0-.5-.5H9a.5.5 0 0 0-.5.5v2.25a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V8a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v.75"/></svg>
                                            <span>WhatsApp</span>
                                        </a>
                                        <button type="button" class="action-btn btn-qr" data-id="${uniqueId}" data-url="${upiLink}" title="Show Payment QR">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><path d="M3 14h1v1h-1z"/><path d="M5 14h1v1h-1z"/><path d="M3 16h1v1h-1z"/><path d="M5 16h1v1h-1z"/><path d="M7 14h1v1h-1z"/><path d="M9 14h1v1h-1z"/><path d="M7 16h1v1h-1z"/><path d="M9 16h1v1h-1z"/><path d="M3 18h1v1h-1z"/><path d="M5 18h1v1h-1z"/><path d="M7 18h1v1h-1z"/><path d="M9 18h1v1h-1z"/><path d="M3 20h1v1h-1z"/><path d="M5 20h1v1h-1z"/><path d="M7 20h1v1h-1z"/><path d="M9 20h1v1h-1z"/></svg>
                                            <span>QR Code</span>
                                        </button>
                                        <button type="button" class="action-btn btn-copy" data-msg="Hi ${memberName}, your share is ₹${amt}. Please pay to ${exp.receiver}" title="Copy Payment Message">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                            <span>Copy</span>
                                        </button>
                                    </div>
                                    <div id="qr-container-${uniqueId}" class="qr-code-container" style="display:none;"></div>
                                </div>
                            </li>`;
                    });
                    participantsHtml += '</ul>';
                }

                html += `
                    <div class="history-card">
                        <div class="expense-top">
                            <span class="expense-date">${date}</span>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <span class="expense-amount">₹${exp.totalAmount.toFixed(2)}</span>
                                <button type="button" class="action-btn btn-delete" data-id="${exp._id}" title="Delete Transaction" style="padding: 6px; flex: none; border-radius: 50%; width: 32px; height: 32px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                </button>
                            </div>
                        </div>
                        <div class="expense-purpose">
                            ${exp.purpose || 'General Splitting'}
                        </div>
                        <div class="expense-details">
                            <div style="margin-bottom: 10px;">
                                <p style="margin: 4px 0;"><strong>Paid By:</strong> ${exp.receiver}</p>
                            </div>
                            ${participantsHtml}
                        </div>
                    </div>
                `;
            });
            list.innerHTML = html;

            // Calculate Total
            const total = expenses.reduce((sum, exp) => sum + (exp.totalAmount || 0), 0);
            if (summary) {
                summary.innerHTML = `
                    <div class="history-summary">
                        <div class="summary-info">
                            <h3>Total Expenses</h3>
                            <div class="summary-amount">₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                        <div class="summary-count">
                            ${expenses.length} Transaction${expenses.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                `;
            }
        } catch (e) {
            console.error("History load error:", e);
            document.getElementById('history-list').innerHTML = '<p style="text-align:center;color:red">Failed to load history.</p>';
        }
    }

    loadHistory();
});
