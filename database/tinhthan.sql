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
    is_active TINYINT DEFAULT  1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- 2. Bảng Hồ sơ người dùng
CREATE TABLE user_profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    date_of_birth DATE,
    gender VARCHAR(10),
    phone VARCHAR(20),
    avatar_url TEXT,
    last_login DATETIME,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. Bảng Chuyên gia (Bác sĩ/Tư vấn viên)
CREATE TABLE experts (
    expert_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    specialization VARCHAR(100), -- Chuyên môn
    bio TEXT,
    credentials VARCHAR(255), -- Bằng cấp
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. Bảng Lịch rảnh của chuyên gia
CREATE TABLE expert_availabilities (
    availability_id INT AUTO_INCREMENT PRIMARY KEY,
    expert_id INT,
    available_date DATE,
    start_time TIME,
    end_time TIME,
    is_booked TINYINT DEFAULT 0,
    FOREIGN KEY (expert_id) REFERENCES experts(expert_id) ON DELETE CASCADE
);
-- Bảng Tin nhắn giữa người dùng và bác sĩ
CREATE TABLE IF NOT EXISTS expert_chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  expert_id INT NOT NULL,
  sender_type ENUM('user','doctor') NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (expert_id) REFERENCES experts(expert_id)
);
UPDATE users
SET role = 'doctor'
WHERE email = 'yennhu@gmail.com'; 

-- 5. Bảng Cuộc hội thoại
CREATE TABLE conversations (
    conversation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(200),
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_message_at DATETIME,
    status VARCHAR(50), -- Active, Closed, Archived
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
    dialogflow_response VARCHAR(100),
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE
);
CREATE TABLE chat_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    user_message TEXT,
    bot_reply TEXT,
    intent VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
ALTER TABLE chat_logs ADD COLUMN emotion VARCHAR(50);

-- 7. Bảng Phân tích cảm xúc (Từ tin nhắn)
CREATE TABLE sentiment_analyses (
    analysis_id INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT,
    primary_emotion VARCHAR(50), -- Vui, Buồn, Giận...
    confidence_score FLOAT, -- Độ tin cậy AI
    huggingface_model VARCHAR(100),
    emotion_scores TEXT, -- JSON lưu điểm số các cảm xúc khác
    analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(message_id) ON DELETE CASCADE
);

-- 8. Bảng Nhật ký cảm xúc (User tự nhập)
CREATE TABLE emotion_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    log_date DATE,
    source_type VARCHAR(50), -- 'manual' hoặc 'chat_analysis'
    source_id INT, -- ID tham chiếu nếu từ chat
    primary_emotion VARCHAR(50),
    user_note TEXT,
    analysis TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP, -- Đã sửa lỗi chính tả udateAt
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
    average_rating FLOAT DEFAULT 0,
    is_active TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES mind_categories(category_id)
);

-- 12. Bảng Lịch sử tập luyện
CREATE TABLE exercise_logs (
    ex_log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    exercise_id INT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    rating INT,
    feedback TEXT,
    is_completed TINYINT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (exercise_id) REFERENCES mind_exercises(exercise_id)
);

-- 13. Bảng Danh mục kiến thức
CREATE TABLE knowledge_categories (
    k_category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100),
    description TEXT,
    icon_url TEXT,
    display_order INT,
    is_active TINYINT DEFAULT 1
);

-- 14. Bảng Bài viết kiến thức
CREATE TABLE knowledge_articles (
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    k_category_id INT,
    title VARCHAR(200),
    summary TEXT,
    content TEXT, -- HTML content
    author VARCHAR(100),
    thumbnail_url TEXT,
    tags VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (k_category_id) REFERENCES knowledge_categories(k_category_id)
);

-- 15. Bảng Lượt xem bài viết
CREATE TABLE article_views (
    view_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    article_id INT,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reading_duration INT, -- giây
    is_completed TINYINT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (article_id) REFERENCES knowledge_articles(article_id)
);

-- 16. Bảng Cuộc hẹn tư vấn
CREATE TABLE consultation_appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    expert_id INT,
    user_id INT,
    scheduled_at DATETIME,
    duration_minutes INT,
    status VARCHAR(50), -- Pending, Confirmed, Completed, Cancelled
    meeting_type VARCHAR(50), -- Online, Offline
    meeting_link TEXT,
    consultation_fee DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expert_id) REFERENCES experts(expert_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 17. Bảng Ghi chú tư vấn
CREATE TABLE consultation_notes (
    note_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT,
    expert_notes TEXT,
    diagnosis TEXT, -- Chẩn đoán
    recommendations TEXT, -- Khuyến nghị
    followup_plan TEXT, -- Kế hoạch tái khám
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES consultation_appointments(appointment_id) ON DELETE CASCADE
);

-- 18. Bảng Lịch trình sức khỏe
CREATE TABLE health_schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(100),
    description TEXT,
    scheduled_time TIME,
    recurrence_type VARCHAR(50), -- Daily, Weekly
    activity_type VARCHAR(50), -- Medicine, Exercise, Sleep
    is_completed TINYINT DEFAULT 0,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 19. Bảng Thống kê
CREATE TABLE user_statistics (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    period_start DATE,
    period_end DATE,
    period_type VARCHAR(20), -- Weekly, Monthly
    distribution JSON, -- JSON phân bố cảm xúc
    mood_score FLOAT,
    total_log INT,
    trend_direction VARCHAR(20), -- Up, Down, Stable
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- 1. Tạo tài khoản Admin
INSERT INTO users (email, password, full_name, role) 
VALUES ('admin@gmail.com', '123456', 'Quản trị viên', 'admin');

-- 2. Tạo tài khoản Bác sĩ
INSERT INTO users (email, password, full_name, role) 
VALUES ('doctor_lan@gmail.com', '123456', 'BS. Nguyễn Thị Lan', 'expert');

-- Lấy user_id vừa tạo cho bác sĩ (ví dụ là 2) để thêm thông tin chuyên môn
INSERT INTO experts (user_id, specialization, bio, credentials) 
VALUES (2, 'Tâm lý học hành vi', '15 năm kinh nghiệm...', 'Thạc sĩ Tâm lý');

-- 3. Tạo tài khoản Người dùng thường
INSERT INTO users (email, password, full_name, role) 
VALUES ('nhu_sinhvien@gmail.com', '123456', 'Nguyễn Huỳnh Yến Như', 'user');