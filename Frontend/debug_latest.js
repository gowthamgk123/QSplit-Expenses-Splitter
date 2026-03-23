const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/expense-splitter';

mongoose.connect(mongoURI)
    .then(async () => {
        console.log('Connected to DB');

        const expenseSchema = new mongoose.Schema({
            participants: [{
                name: String,
                phone: String,
                amount: Number
            }],
            date: { type: Date, default: Date.now },
            receiver: String
        });

        const Expense = mongoose.model('Expense', expenseSchema);

        // Fetch the VERY LATEST expense
        const expenses = await Expense.find().sort({ date: -1 }).limit(1).lean();

        console.log('Latest Expense:', JSON.stringify(expenses, null, 2));

        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
