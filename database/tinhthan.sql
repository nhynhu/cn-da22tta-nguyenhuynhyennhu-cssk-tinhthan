ALTER USER 'root'@'localhost' 
IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;

FLUSH PRIVILEGES;
CREATE DATABASE mental_health_db;
USE mental_health_db;
-- 1.Bảng users
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    is_active TINYINT DEFAULT 1,
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
    full_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    specialization VARCHAR(100), -- Chuyên môn
    bio TEXT,
    credentials VARCHAR(255), -- Bằng cấp
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
    sender_type VARCHAR(20), -- 'user', 'bot', 'expert'
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    dialogflow_intent VARCHAR(100),
    dialogflow_response VARCHAR(100),
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE
);
CREATE TABLE chat_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255),
    user_message TEXT,
    bot_reply TEXT,
    intent VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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


-- Users
INSERT INTO users (email, password, full_name) VALUES 
('nguyenvanan@gmail.com', 'hashed_pass_123', 'Nguyen Van An'),
('tranthib@gmail.com', 'hashed_pass_456', 'Tran Thi B'),
('leloi@gmail.com', 'hashed_pass_789', 'Le Loi');

-- Experts
INSERT INTO experts (full_name, email, specialization, bio) VALUES 
('Dr. Pham Tam Ly', 'bs_tamly@hospital.com', 'Tâm lý học lâm sàng', '10 năm kinh nghiệm điều trị trầm cảm.'),
('Ths. Tran Tu Van', 'tvv_tran@clinic.com', 'Tư vấn hôn nhân gia đình', 'Chuyên gia tư vấn các vấn đề mối quan hệ.');

-- Conversations
INSERT INTO conversations (user_id, title, started_at, status) VALUES 
(1, 'Cảm thấy lo lắng về công việc', NOW(), 'Active'),
(2, 'Mất ngủ kéo dài', NOW(), 'Closed');

-- Messages
INSERT INTO messages (conversation_id, message_content, sender_type, sent_at) VALUES 
(1, 'Chào bạn, tôi cảm thấy rất áp lực dạo gần đây.', 'user', NOW()),
(1, 'Chào bạn, tôi rất tiếc khi nghe điều đó. Bạn có thể chia sẻ cụ thể hơn không?', 'bot', NOW());

-- Emotion Logs
INSERT INTO emotion_logs (user_id, log_date, primary_emotion, user_note, created_at) VALUES 
(1, '2023-10-25', 'Lo lắng', 'Sắp đến deadline dự án lớn.', NOW()),
(1, '2023-10-26', 'Bình thường', 'Đã hoàn thành một phần công việc.', NOW()),
(2, '2023-10-25', 'Buồn', 'Gặp chuyện không vui với bạn bè.', NOW());

-- Mind Categories
INSERT INTO mind_categories (category_name, description, display_order) VALUES 
('Thiền định', 'Các bài tập thiền giúp tĩnh tâm.', 1),
('Giấc ngủ', 'Âm thanh và bài tập giúp ngủ ngon.', 2),
('Hô hấp', 'Kỹ thuật thở để giảm căng thẳng.', 3);

-- Mind Exercises
INSERT INTO mind_exercises (category_id, title, duration_minutes, difficulty_level, media_type, media_url) VALUES 
(1, 'Thiền chánh niệm 5 phút', 5, 'Easy', 'Audio', 'http://media.app/thien5p.mp3'),
(2, 'Tiếng mưa rơi', 30, 'Easy', 'Audio', 'http://media.app/rain.mp3'),
(3, 'Thở 4-7-8', 10, 'Medium', 'Video', 'http://media.app/breathing.mp4');

-- Knowledge Categories
INSERT INTO knowledge_categories (category_name, description) VALUES 
('Sức khỏe tâm thần', 'Kiến thức cơ bản về các rối loạn tâm lý.'),
('Kỹ năng sống', 'Cách quản lý cảm xúc và stress.');

-- Knowledge Articles
INSERT INTO knowledge_articles (k_category_id, title, summary, author) VALUES 
(1, 'Trầm cảm là gì?', 'Dấu hiệu nhận biết trầm cảm sớm.', 'Dr. Pham Tam Ly'),
(2, '5 cách giảm stress tại chỗ', 'Các mẹo nhỏ giúp bạn thư giãn ngay tại bàn làm việc.', 'Ths. Tran Tu Van');

-- Consultation Appointments
INSERT INTO consultation_appointments (expert_id, user_id, scheduled_at, duration_minutes, status, consultation_fee) VALUES 
(1, 1, '2023-11-01 09:00:00', 60, 'Confirmed', 500000),
(2, 2, '2023-11-02 14:00:00', 45, 'Pending', 300000);

-- Health Schedules
INSERT INTO health_schedules (user_id, title, scheduled_time, activity_type) VALUES 
(1, 'Uống thuốc vitamin', '08:00:00', 'Medicine'),
(1, 'Thiền buổi tối', '22:00:00', 'Exercise');