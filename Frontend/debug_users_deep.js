const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/expense-splitter';

mongoose.connect(mongoURI)
    .then(async () => {
        console.log('Connected to DB');

        const userSchema = new mongoose.Schema({
            username: String,
            phone: String,
            email: String
        });
        const User = mongoose.model('User', userSchema);

        // Search for the missing number with regex to be safe
        const user = await User.findOne({ phone: /6300519857/ });

        console.log('User search result:', JSON.stringify(user, null, 2));

        // Also list ALL users just in case
        const allUsers = await User.find({}, 'username phone email');
        console.log('All users:', JSON.stringify(allUsers, null, 2));

        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
