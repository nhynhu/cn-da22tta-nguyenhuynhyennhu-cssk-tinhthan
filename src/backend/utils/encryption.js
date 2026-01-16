const crypto = require('crypto');

// Thuật toán mã hóa AES-256-CBC
const ALGORITHM = 'aes-256-cbc';

// Lấy key từ biến môi trường, nếu không có thì dùng key mặc định (không nên dùng trong production)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key!!';
const KEY = Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)); // Đảm bảo key có đúng 32 bytes

/**
 * Mã hóa văn bản
 * @param {string} text - Văn bản cần mã hóa
 * @returns {string} - Chuỗi đã mã hóa (format: iv:encryptedData)
 */
function encrypt(text) {
    if (!text) return text;
    
    try {
        // Tạo initialization vector ngẫu nhiên
        const iv = crypto.randomBytes(16);
        
        // Tạo cipher
        const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
        
        // Mã hóa
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        // Kết hợp IV và dữ liệu mã hóa, phân cách bằng dấu ':'
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        console.error('❌ Lỗi mã hóa:', error.message);
        return text; // Trả về văn bản gốc nếu lỗi
    }
}

/**
 * Giải mã văn bản
 * @param {string} encryptedText - Văn bản đã mã hóa (format: iv:encryptedData)
 * @returns {string} - Văn bản gốc
 */
function decrypt(encryptedText) {
    // Kiểm tra null/undefined/empty
    if (!encryptedText || typeof encryptedText !== 'string') {
        return encryptedText;
    }
    
    // Kiểm tra format: phải có dấu : và cả 2 phần đều là hex hợp lệ
    if (!encryptedText.includes(':')) {
        return encryptedText; // Dữ liệu plaintext cũ
    }
    
    try {
        // Tách IV và dữ liệu mã hóa
        const parts = encryptedText.split(':');
        
        // Phải có đúng 2 phần (iv:encrypted)
        if (parts.length !== 2) {
            return encryptedText;
        }
        
        const ivHex = parts[0];
        const encryptedHex = parts[1];
        
        // Kiểm tra IV phải là hex 32 ký tự (16 bytes)
        if (!ivHex || ivHex.length !== 32 || !/^[0-9a-fA-F]+$/.test(ivHex)) {
            return encryptedText;
        }
        
        // Kiểm tra encrypted data phải là hex hợp lệ
        if (!encryptedHex || !/^[0-9a-fA-F]+$/.test(encryptedHex)) {
            return encryptedText;
        }
        
        const iv = Buffer.from(ivHex, 'hex');
        
        // Tạo decipher
        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
        
        // Giải mã
        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        // Không log nữa để tránh spam console
        // Trả về văn bản gốc nếu không giải mã được (có thể là dữ liệu cũ)
        return encryptedText;
    }
}

module.exports = {
    encrypt,
    decrypt
};
