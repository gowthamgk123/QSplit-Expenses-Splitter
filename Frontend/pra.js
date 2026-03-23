const express = require('express');
const path = require('path');
require('dotenv').config();

// const { Cashfree, CFEnvironment } = require('cashfree-pg'); // Removed Cashfree
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/expense-splitter';
mongoose.connect(mongoURI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

const expenseSchema = new mongoose.Schema({
    totalAmount: { type: Number, required: true },
    splitMode: { type: String, required: true },
    receiver: { type: String, required: true },
    participants: [{
        name: String,
        phone: String,
        amount: Number
    }],
    purpose: { type: String, default: 'General' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', expenseSchema);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Session Configuration
app.use(session({
    secret: 'secret-key-replace-in-prod',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoURI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

app.use(express.static(__dirname, { index: false }));

// Auth Middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/login');
};

// Serve HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/split', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'praa.html'));
});

app.get('/login', (req, res) => {
    if (req.session && req.session.userId) return res.redirect('/split');
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'sign.html'));
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog.html'));
});

app.get('/api/auth-status', (req, res) => {
    res.json({ isLoggedIn: !!(req.session && req.session.userId) });
});

// Serve React Info App for specific routes
const infoAppDist = path.join(__dirname, 'info-app', 'dist');
app.use(express.static(infoAppDist)); // Serve static files (js, css) from dist

app.get(['/about', '/terms', '/contact'], (req, res) => {
    res.sendFile(path.join(infoAppDist, 'index.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.redirect('/split');
        res.redirect('/login');
    });
});

// Auth Routes
app.post('/signup', async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, phone });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Set session
        req.session.userId = user._id;
        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
}, { collection: 'feedback' });

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Save Feedback API
app.post('/api/feedback', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newFeedback = new Feedback({ name, email, message });
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        console.error('Error saving feedback:', err);
        res.status(500).json({ error: 'Failed to save feedback' });
    }
});

// Save Expense API
app.post('/save-expense', requireAuth, async (req, res) => {
    try {
        const { totalAmount, splitMode, receiver, participants, purpose } = req.body;

        console.log('Received save-expense request. Participants:', JSON.stringify(participants, null, 2));


        const newExpense = new Expense({
            totalAmount,
            splitMode,
            receiver,
            participants,
            purpose: purpose || 'General',
            createdBy: req.session.userId
        });

        await newExpense.save();
        console.log('✅ Expense saved successfully');
        res.status(201).json({ message: 'Expense saved successfully', expenseId: newExpense._id });
    } catch (err) {
        console.error('❌ Error saving expense:', err.message);
        if (err.errors) console.error('Validation errors:', JSON.stringify(err.errors, null, 2));
        console.error('User ID from session:', req.session ? req.session.userId : 'No session');
        res.status(500).json({ error: 'Failed to save expense' });
    }
});

// History Page
app.get('/history', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'history.html'));
});

// History API
app.get('/api/history', requireAuth, async (req, res) => {
    try {
        const expenses = await Expense.find({ createdBy: req.session.userId }).sort({ date: -1 }).limit(50);
        res.json(expenses);
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Delete Expense API
app.delete('/api/history/:id', requireAuth, async (req, res) => {
    try {
        const result = await Expense.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.session.userId
        });

        if (!result) {
            return res.status(404).json({ error: 'Expense not found or unauthorized' });
        }

        res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error('Error deleting expense:', err);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

// Create order API removed

// Start server
app.listen(3000, () => {
    console.log("✅ Server running at http://localhost:3000");
});
