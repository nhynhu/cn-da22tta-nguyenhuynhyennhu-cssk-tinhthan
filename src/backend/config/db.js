const mysql = require('mysql');

// Dùng connection pool để tránh lỗi "Cannot enqueue Query after fatal error"
// và giúp tự tạo lại kết nối khi có lỗi tạm thời.
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mental_health_db',
    connectionLimit: 10
});

// Kiểm tra kết nối ngay khi khởi động server
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Lỗi kết nối MySQL:', err.message);
    } else {
        console.log('✅ Kết nối MySQL thành công!');
        connection.release();
    }
});

module.exports = pool;