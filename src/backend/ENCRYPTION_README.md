# HỆ THỐNG MÃ HÓA TIN NHẮN

## 📋 Tổng quan

Hệ thống mã hóa tin nhắn đã được triển khai sử dụng thuật toán **AES-256-CBC** để bảo mật dữ liệu tin nhắn trong cơ sở dữ liệu.

## 🔐 Các loại tin nhắn được mã hóa

### 1. **Chat AI** (bảng: `chat_logs`)

- `user_message`: Tin nhắn từ người dùng
- `bot_reply`: Phản hồi từ bot AI

### 2. **Chat với chuyên gia** (bảng: `expert_chat_messages`)

- `message`: Tin nhắn giữa user và chuyên gia

### 3. **Conversations** (bảng: `messages`)

- `message_content`: Nội dung tin nhắn trong cuộc hội thoại

## 🔧 Cấu trúc hệ thống

### File: `src/backend/utils/encryption.js`

Module tiện ích cung cấp 2 hàm chính:

- `encrypt(text)`: Mã hóa văn bản
- `decrypt(encryptedText)`: Giải mã văn bản

**Đặc điểm:**

- Sử dụng AES-256-CBC với IV (Initialization Vector) ngẫu nhiên
- Format lưu trữ: `iv:encryptedData` (hex)
- Tự động xử lý lỗi, trả về văn bản gốc nếu mã hóa/giải mã thất bại

### Encryption Key

**File**: `.env`

```env
ENCRYPTION_KEY=1e412ec7f692993c9a1cb638374bf7ed
```

⚠️ **LƯU Ý**: Key này phải có đúng 32 ký tự (256 bit) và **TUYỆT ĐỐI BẢO MẬT**

## 📂 Files đã cập nhật

### 1. Controllers

- **chatController.js**
  - Mã hóa `user_message` và `bot_reply` khi lưu
  - Giải mã khi lấy lịch sử chat (`getChatHistory`)

### 2. Models

- **doctorChatModel.js**

  - Mã hóa `message` trong `sendMessage()`
  - Giải mã trong `getConversation()`

- **chatModel.js**
  - Mã hóa `message_content` trong `addMessage()`
  - Giải mã trong `getMessages()`

## 🚀 Sử dụng

### Import module:

```javascript
const { encrypt, decrypt } = require("../utils/encryption");
```

### Mã hóa khi lưu:

```javascript
const encryptedMessage = encrypt(message);
// Lưu encryptedMessage vào database
```

### Giải mã khi đọc:

```javascript
const decryptedMessage = decrypt(encryptedFromDB);
// Sử dụng decryptedMessage
```

## 🔒 Bảo mật

### Dữ liệu cũ (chưa mã hóa)

- Hệ thống tương thích ngược: dữ liệu cũ không có format `iv:data` sẽ được trả về nguyên văn
- Tin nhắn mới đều được mã hóa tự động

### Best Practices

1. ✅ **Không commit** file `.env` vào Git
2. ✅ **Backup encryption key** an toàn
3. ✅ **Thay đổi key định kỳ** trong môi trường production
4. ✅ **Sử dụng key khác nhau** cho dev/staging/production

## 📊 Kiểm tra hoạt động

### Test mã hóa:

```javascript
const { encrypt, decrypt } = require("./utils/encryption");

const message = "Xin chào, tôi cần tư vấn";
const encrypted = encrypt(message);
console.log("Encrypted:", encrypted);
// Output: "a1b2c3d4...:f5e6d7c8..."

const decrypted = decrypt(encrypted);
console.log("Decrypted:", decrypted);
// Output: "Xin chào, tôi cần tư vấn"
```

### Kiểm tra trong database:

```sql
-- Xem tin nhắn đã mã hóa
SELECT user_message FROM chat_logs LIMIT 1;
-- Kết quả: "a1b2c3d4e5f6...:f7e8d9c0a1b2..."
```

## ⚙️ Cấu hình

### Thay đổi thuật toán (nếu cần):

```javascript
// Trong encryption.js
const ALGORITHM = "aes-256-cbc"; // Có thể đổi sang aes-256-gcm
```

### Tạo key mới:

```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

## 🔄 Migration dữ liệu cũ

Nếu cần mã hóa dữ liệu cũ trong database:

```javascript
// Script migration (chạy một lần)
const db = require("./config/db");
const { encrypt } = require("./utils/encryption");

// Mã hóa chat_logs
db.query(
  'SELECT * FROM chat_logs WHERE user_message NOT LIKE "%:%"',
  (err, rows) => {
    rows.forEach((row) => {
      const encrypted = encrypt(row.user_message);
      db.query("UPDATE chat_logs SET user_message = ? WHERE log_id = ?", [
        encrypted,
        row.log_id,
      ]);
    });
  }
);
```

## 📝 Lưu ý quan trọng

1. **Performance**: Mã hóa/giải mã có overhead nhỏ (~1-2ms/message)
2. **Storage**: Dữ liệu mã hóa chiếm nhiều dung lượng hơn (~50% so với plaintext)
3. **Backup**: Luôn backup encryption key trước khi thay đổi
4. **Logs**: Không log tin nhắn đã giải mã để tránh rò rỉ
