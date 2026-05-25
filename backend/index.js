const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Chỉ đích danh link Frontend được phép gọi
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Cấp quyền tường minh cho các hành động
}));
app.use(express.json());

// Import Routes
const subjectRoutes = require('./src/routes/subjectRoutes');

// Định tuyến API
app.use('/api/subjects', subjectRoutes);

// Test server
app.get('/', (req, res) => {
    res.send('API hệ thống Quiz Practice đang chạy ngon lành!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên cổng http://localhost:${PORT}`);
});