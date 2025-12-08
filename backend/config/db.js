const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // Kiểm tra lại user của bạn
    password: '',       // Kiểm tra lại pass của bạn
    database: 'mental_health_db' // <-- SỬA TÊN DATABASE CHO ĐÚNG
});

db.connect((err) => {
    if (err) {
        console.error('❌ Lỗi kết nối MySQL:', err.message);
    } else {
        console.log('✅ Kết nối MySQL thành công!');
    }
});

module.exports = db;