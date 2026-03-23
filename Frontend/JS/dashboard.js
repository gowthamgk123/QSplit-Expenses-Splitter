import { initTheme, toggleTheme, updateToggleIcon, fmtCurrency } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    // Expose toggleTheme globally for the button onclick in HTML (if still used that way)
    // Preferably we attach event listeners, but to minimize HTML drift we can do this:
    window.toggleTheme = toggleTheme;

    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    const root = document.getElementById('root');
    if (!root) {
        console.error("Root element not found");
        return;
    }

    // App State
    let state = {
        step: 1,
        members: 4,
        amount: '',
        inputs: [],
        memberNames: [],
        customAmounts: [],
        splitMode: 'EQUAL',
        receiver: '9398772708@axl',
        purpose: '',
        perPerson: '0.00'
    };

    function render() {
        try {
            if (state.step === 1) renderStep1();
            else if (state.step === 2) renderStep2();
            else renderStep3();
        } catch (e) {
            console.error("Render error:", e);
            root.innerHTML = `<div class="container"><p style="color:red">Error rendering app: ${e.message}</p></div>`;
        }
    }

    function renderStep1() {
        root.innerHTML = `
        <div class="hero">
            <h1 class="hero-title">Split Expenses Easily <span class="emoji">💸</span></h1>
            <p class="hero-sub">No calculations, no confusion</p>
        </div>
        <div class="container">
            <h2 class="card-step"> <span class="bold">Enter number of members</span></h2>
            <form id="step1-form">
            <div class="form-group">
                <div class="input-with-icon">
                <span class="icon">👥</span>
                <input id="members-input" type="number" min="1" max="20" placeholder="Enter a number" value="${state.members}" />
                </div>
            </div>
            <div class="button-group">
                <button id="continue-btn" class="btn-primary" type="submit" style="width:100%;padding:16px 18px;font-size:1.15rem;border-radius:18px">Continue</button>
            </div>
            </form>
            <p class="footer-note">Made with ❤️ for easy expense splitting</p>
        </div>
        `;

        const form = document.getElementById('step1-form');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const m = parseInt(document.getElementById('members-input').value) || 0;
                if (m <= 0 || m > 20) return alert('Enter members between 1 and 20');
                state.members = m;
                state.inputs = new Array(m).fill('');
                state.memberNames = new Array(m).fill('');
                state.customAmounts = new Array(m).fill('');
                state.step = 2;
                render();
            });
        }
    }

    function renderStep2() {
        const totalAmt = Number(state.amount) || 0;
        const per = totalAmt / (state.members || 1);
        state.perPerson = fmtCurrency(per);

        let inputsHtml = '';
        for (let i = 0; i < state.members; i++) {
            let amountField = '';
            if (state.splitMode === 'CUSTOM') {
                amountField = `
                <div class="custom-amount-wrapper">
                    <span class="currency-symbol">₹</span>
                    <input class="member-amount" data-index="${i}" type="number" placeholder="0" value="${state.customAmounts[i] || ''}" />
                </div>
            `;
            }

            inputsHtml += `
            <div class="phone-input-group ${state.splitMode === 'CUSTOM' ? 'with-amount' : ''}">
            <div class="member-header">
                <label>Member ${i + 1}</label>
                ${state.splitMode === 'EQUAL' ? `<span class="share-badge">₹${state.perPerson}</span>` : ''}
            </div>
            
            <input class="member-name" data-index="${i}" type="text" placeholder="Member Name" value="${state.memberNames[i] || ''}" style="margin-bottom: 8px;" />
            
            ${amountField}
            <input class="member-upi" data-index="${i}" type="text" placeholder="Phone / UPI ID" value="${state.inputs[i] || ''}" />
            </div>`;
        }

        root.innerHTML = `
        <div class="container">
            <h1>Enter Details</h1>
            <form id="step2-form">
            <div class="form-group">
                <label>💵 Total Amount</label>
                <input id="amount-input" type="number" min="1" step="0.01" value="${state.amount}" />
            </div>
            
            <div class="split-toggle-container">
                <div class="toggle-option ${state.splitMode === 'EQUAL' ? 'active' : ''}" id="toggle-equal">Equal Split</div>
                <div class="toggle-option ${state.splitMode === 'CUSTOM' ? 'active' : ''}" id="toggle-custom">Custom Split</div>
            </div>

            ${state.splitMode === 'EQUAL'
                ? `<div class="amount-preview">Each person pays: ₹${state.perPerson}</div>`
                : `<div class="amount-preview" id="custom-total-preview">Total entered: ₹0 / ₹${state.amount || '0'}</div>`
            }
            
            <div class="phone-container">${inputsHtml}</div>
            <div class="form-group">
                <label>Purpose (e.g., Lunch, Trip etc.)</label>
                <input id="purpose-input" type="text" placeholder="What is this split for?" value="${state.purpose || ''}" />
            </div>
            <div class="form-group">
                <label>Receiver UPI / Phone</label>
                <input id="receiver-input" type="text" value="${state.receiver}" />
            </div>
            <div class="button-group">
                <button type="button" id="back-btn" class="btn-secondary">Back</button>
                <button type="submit" class="btn-primary">Generate Requests</button>
            </div>
            </form>
        </div>
        `;

        if (state.splitMode === 'CUSTOM') updateCustomTotal();

        document.getElementById('back-btn').addEventListener('click', function () { state.step = 1; render(); });

        document.getElementById('toggle-equal').addEventListener('click', function () {
            state.splitMode = 'EQUAL'; render();
        });
        document.getElementById('toggle-custom').addEventListener('click', function () {
            state.splitMode = 'CUSTOM'; render();
        });

        document.getElementById('amount-input').addEventListener('input', function (e) {
            state.amount = e.target.value;
            if (state.splitMode === 'EQUAL') {
                const per = (Number(state.amount) || 0) / (state.members || 1);
                state.perPerson = fmtCurrency(per);
                const previewEl = document.querySelector('.amount-preview');
                if (previewEl) previewEl.textContent = 'Each person pays: ₹' + state.perPerson;
                document.querySelectorAll('.share-badge').forEach(el => el.textContent = '₹' + state.perPerson);
            } else {
                updateCustomTotal();
            }
        });

        document.querySelectorAll('.member-upi').forEach(function (inp) { inp.addEventListener('input', function (e) { const idx = Number(e.target.dataset.index); state.inputs[idx] = e.target.value; }); });

        document.querySelectorAll('.member-name').forEach(function (inp) {
            inp.addEventListener('input', function (e) {
                const idx = Number(e.target.dataset.index);
                state.memberNames[idx] = e.target.value;
            });
        });

        document.querySelectorAll('.member-amount').forEach(function (inp) {
            inp.addEventListener('input', function (e) {
                const idx = Number(e.target.dataset.index);
                state.customAmounts[idx] = e.target.value;
                updateCustomTotal();
            });
        });

        document.getElementById('receiver-input').addEventListener('input', function (e) { state.receiver = e.target.value; });
        document.getElementById('purpose-input').addEventListener('input', function (e) { state.purpose = e.target.value; });

        document.getElementById('step2-form').addEventListener('submit', function (e) {
            e.preventDefault();
            for (let i = 0; i < state.members; i++) {
                const v = (state.inputs[i] || '').trim();
                const name = (state.memberNames[i] || '').trim();

                if (!name) return alert('Please enter Name for Member ' + (i + 1));
                if (!v) return alert('Please enter UPI/phone for Member ' + (i + 1));

                if (state.splitMode === 'CUSTOM') {
                    const amt = Number(state.customAmounts[i]);
                    if (!amt || amt < 0) return alert('Please enter valid amount for Member ' + (i + 1));
                }
            }
            if (!state.receiver || !state.receiver.trim()) return alert('Enter receiver UPI/phone');
            if (!(Number(state.amount) > 0)) return alert('Enter valid total amount');

            if (state.splitMode === 'CUSTOM') {
                const totalEntered = state.customAmounts.reduce((sum, val) => sum + (Number(val) || 0), 0);
                const expected = Number(state.amount);
                if (Math.abs(totalEntered - expected) > 1) {
                    return alert(`Total custom amounts (₹${totalEntered}) must match Total Amount (₹${expected})`);
                }
            }

            // Save Expense
            const participants = [];
            for (let i = 0; i < state.members; i++) {
                let pAmt = 0;
                if (state.splitMode === 'EQUAL') {
                    pAmt = Number(state.amount) / state.members;
                } else {
                    pAmt = Number(state.customAmounts[i]);
                }
                participants.push({
                    name: state.memberNames[i] || `Member ${i + 1}`,
                    phone: state.inputs[i],
                    amount: pAmt
                });
            }

            const payload = {
                totalAmount: Number(state.amount),
                splitMode: state.splitMode,
                receiver: state.receiver,
                purpose: state.purpose || 'General',
                participants: participants
            };

            fetch('/save-expense', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then(data => {
                    console.log('Expense saved:', data);
                    if (data.error) alert('Warning: Failed to save expense history');
                    state.step = 3; render();
                })
                .catch(err => {
                    console.error('Error saving:', err);
                    state.step = 3; render(); // Proceed anyway
                });
        });
    }

    function updateCustomTotal() {
        const totalEntered = state.customAmounts.reduce((sum, val) => sum + (Number(val) || 0), 0);
        const previewEl = document.getElementById('custom-total-preview');
        if (previewEl) {
            previewEl.textContent = `Total entered: ₹${totalEntered} / ₹${state.amount || '0'}`;
            if (Math.abs(totalEntered - Number(state.amount || 0)) <= 1) {
                previewEl.style.color = 'green';
            } else {
                previewEl.style.color = '#dc2626'; // red
            }
        }
    }

    function generateUPILink(pa, am, note) {
        const params = new URLSearchParams();
        params.append('pa', pa);
        params.append('pn', 'Split Bill');
        params.append('am', am);
        params.append('tn', note);
        return 'upi://pay?' + params.toString();
    }

    function renderStep3() {
        const equalPer = fmtCurrency((Number(state.amount) || 0) / (state.members || 1));

        let out = '';
        state.inputs.forEach(function (v, i) {
            let amt = equalPer;
            if (state.splitMode === 'CUSTOM') {
                amt = fmtCurrency(Number(state.customAmounts[i] || 0));
            }

            const cleanPhone = (v.match(/\d{10}$/) || [])[0] || '';
            const memberName = state.memberNames[i] || `Member ${i + 1}`;
            const wa = cleanPhone ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent('Hi ' + memberName + ', your share is ₹' + amt + '. Please pay to ' + state.receiver)}` : '#';
            const upi = generateUPILink(state.receiver, amt, `Bill split - ${memberName}`);
            out += `
            <div class="payment-item">
            <h4>${memberName}</h4>
            <p>Amount: ₹${amt}</p>
            <button class="btn-qr" onclick="toggleQR(${i}, '${upi}')">Show QR Code</button>
            <div id="qr-container-${i}" class="qr-code-container" style="display:none;"></div>
            <div class="action-buttons">
                <a ${cleanPhone ? `href="${wa}" target="_blank"` : ''} class="btn-whatsapp">WhatsApp</a>

                <button class="btn-copy" data-msg="Hi ${memberName}, your share is ₹${amt}. Please pay to ${state.receiver}">Copy</button>
            </div>
            </div>
        `;
        });

        // Global function for QR toggle
        window.toggleQR = function (index, url) {
            const container = document.getElementById(`qr-container-${index}`);
            const btn = container.previousElementSibling; // The button

            if (container.style.display === 'none') {
                container.style.display = 'flex';
                btn.textContent = 'Hide QR Code';
                if (container.innerHTML === '') {
                    // Use api.qrserver.com for QR generation
                    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
                    container.innerHTML = `<img src="${qrURL}" alt="UPI QR Code" style="max-width:100%; height:auto;">`;
                }
            } else {
                container.style.display = 'none';
                btn.textContent = 'Show QR Code';
            }
        };

        root.innerHTML = `
        <div class="container">
            <h1>Payment Requests</h1>
            <div class="success-header">
            <p><strong>Total:</strong> ₹${fmtCurrency(state.amount || 0)}</p>
            <p><strong>Purpose:</strong> ${state.purpose || 'General'}</p>
            <p><strong>Method:</strong> ${state.splitMode === 'EQUAL' ? 'Equal Split' : 'Custom Split'}</p>
            <p><strong>Receiver:</strong> ${state.receiver}</p>
            </div>
            <div class="payments-container">${out}</div>
            <div class="button-group" style="margin-top:18px">
            <button class="btn-secondary" id="startover">Start Over</button>
            </div>
        </div>
        `;

        document.querySelectorAll('.btn-copy').forEach(function (b) { b.addEventListener('click', function () { const msg = this.dataset.msg; navigator.clipboard.writeText(msg).then(() => alert('Copied')); }); });

        document.getElementById('startover').addEventListener('click', function () { state = { step: 1, members: 4, amount: '', inputs: [], customAmounts: [], splitMode: 'EQUAL', receiver: '9398772708@axl', purpose: '', perPerson: '0.00' }; render(); });
    }

    // Initial Render
    render();
    console.log("App rendered");

    // Logout logic
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = '/logout';
        });
    }
});
