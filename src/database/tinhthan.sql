DROP DATABASE IF EXISTS mental_health_db;

ALTER USER 'root'@'localhost' 
IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;

CREATE DATABASE mental_health_db;
USE mental_health_db;
-- 1.Bảng users
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('user', 'expert', 'admin') NOT NULL DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL,
ADD COLUMN reset_token_expires DATETIME DEFAULT NULL;
-- 2. Bảng Hồ sơ người dùng
CREATE TABLE user_profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    date_of_birth DATE,
    gender VARCHAR(10),
    phone VARCHAR(20),
    avatar_url TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. Bảng Chuyên gia (Bác sĩ/Tư vấn viên)
CREATE TABLE experts (
    expert_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    specialization VARCHAR(100), -- Chuyên môn
    avatar_url TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4 Bảng Tin nhắn giữa người dùng và bác sĩ
CREATE TABLE IF NOT EXISTS expert_chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  expert_id INT NOT NULL,
  sender_type ENUM('user','expert') NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (expert_id) REFERENCES experts(expert_id)
);

-- 5. Bảng Cuộc hội thoại
CREATE TABLE conversations (
    conversation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(200),
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_message_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 6. Bảng Tin nhắn
CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT,
    message_content TEXT,
    sender_type VARCHAR(20), 
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    dialogflow_intent VARCHAR(100),
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE
);
-- 7. Bảng Nhật ký trò chuyện (Lưu trữ tin nhắn và phản hồi từ bot)
CREATE TABLE chat_logs (
    chat_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    user_message TEXT,
    bot_reply TEXT,
    intent VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
ALTER TABLE chat_logs ADD COLUMN emotion VARCHAR(50);

-- 8. Bảng Nhật ký cảm xúc (User tự nhập)
CREATE TABLE emotion_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    log_date DATE,
    source_type VARCHAR(50), -- 'manual' hoặc 'chat_analysis'
    primary_emotion VARCHAR(50),
    user_note TEXT,
    analysis TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 9. Bảng Gợi ý (Dựa trên cảm xúc)
CREATE TABLE suggestions (
    suggestion_id INT AUTO_INCREMENT PRIMARY KEY,
    log_id INT,
    suggestion_type VARCHAR(50), -- 'exercise', 'article', 'consultation'
    title VARCHAR(100),
    content TEXT,
    priority VARCHAR(20), -- High, Medium, Low
    is_viewed TINYINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (log_id) REFERENCES emotion_logs(log_id) ON DELETE CASCADE
);

-- 10. Bảng Danh mục bài tập thiền/tâm lý
CREATE TABLE mind_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100),
    description TEXT,
    icon_url TEXT,
    intent VARCHAR(100),
    display_order INT,
    is_active TINYINT DEFAULT 1
);

-- 11. Bảng Bài tập (Thiền, Yoga, Hô hấp)
CREATE TABLE mind_exercises (
    exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    title VARCHAR(150),
    description TEXT,
    duration_minutes INT,
    difficulty_level VARCHAR(20), -- Easy, Medium, Hard
    media_type VARCHAR(20), -- Audio, Video
    media_url TEXT,
    instructions TEXT,
    view_count INT DEFAULT 0,
    is_active TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES mind_categories(category_id)
);
ALTER TABLE mind_exercises 
ADD COLUMN image_url TEXT AFTER media_url;

-- 12. Bảng Cuộc hẹn tư vấn
CREATE TABLE consultation_appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    expert_id INT,
    user_id INT,
    scheduled_at DATETIME,
    meeting_type VARCHAR(50) DEFAULT 'Online', -- Online, Gặp trực tiếp
    status VARCHAR(50), -- Pending, Confirmed, Completed, Cancelled
    meeting_link TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expert_id) REFERENCES experts(expert_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 13. Bảng Thông báo
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'appointment', 'message', 'suggestion', 'system'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    related_id INT, -- ID liên quan (appointment_id, message_id, etc.)
    is_read TINYINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 14. Bảng Đánh giá & Phản hồi
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    target_type VARCHAR(50) NOT NULL, -- 'expert', 'exercise'
    target_id INT NOT NULL, -- expert_id hoặc exercise_id
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 15. Bảng Lịch sử xem bài tập (để tracking)
CREATE TABLE exercise_views (
    view_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exercise_id INT NOT NULL,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed TINYINT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES mind_exercises(exercise_id) ON DELETE CASCADE
);




-- 1. Tạo tài khoản Admin
INSERT INTO users (email, password, full_name, role) 
VALUES ('admin@gmail.com', '123456', 'Quản trị viên', 'admin');

-- 2. Tạo tài khoản Bác sĩ
INSERT INTO users (email, password, full_name, role) 
VALUES ('doctor_lan@gmail.com', '123456', 'BS. Nguyễn Thị Lan', 'expert');

-- Lấy user_id vừa tạo cho bác sĩ (ví dụ là 2) để thêm thông tin chuyên môn
INSERT INTO experts (user_id, specialization) 
VALUES (2, 'Tâm lý học hành vi');

-- 3. Tạo tài khoản Người dùng thường
INSERT INTO users (email, password, full_name, role) 
VALUES ('nhu_sinhvien@gmail.com', '123456', 'Nguyễn Huỳnh Yến Như', 'user');

