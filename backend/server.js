const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const expenseRoute = require('./routes/expenses');

dotenv.config();

const app = express();

app.use(express.json());



mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

app.use('/api/auth', authRoute);
app.use('/api/expenses', expenseRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

