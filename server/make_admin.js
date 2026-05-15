const mongoose = require('mongoose');
const UserModel = require('./models/Users');

mongoose.connect('mongodb://127.0.0.1:27017/elearning')
    .then(async () => {
        console.log("Connected to MongoDB");
        // Update admin@admin.com to role: admin
        const result = await UserModel.findOneAndUpdate(
            { email: 'admin@admin.com' },
            { role: 'admin' },
            { new: true }
        );
        console.log("Updated user:", result);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
