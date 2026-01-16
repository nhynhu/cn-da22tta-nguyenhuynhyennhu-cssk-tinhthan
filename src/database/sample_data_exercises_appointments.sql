-- ===================================================
-- DỮ LIỆU MẪU: LỊCH HẸN VÀ BÀI TẬP
-- ===================================================

USE mental_health_db;

-- ===================================================
-- 1. THÊM DỮ LIỆU MẪU LỊCH HẸN VỚI CHUYÊN GIA NGUYỄN THỊ LAN
-- ===================================================

-- Lịch hẹn trong quá khứ (đã hoàn thành)
INSERT INTO consultation_appointments (expert_id, user_id, scheduled_at, meeting_type, status, meeting_link, created_at) VALUES
(1, 3, '2025-12-15 09:00:00', 'Online', 'Completed', 'https://meet.google.com/abc-defg-hij', '2025-12-10 10:30:00'),
(1, 3, '2025-12-18 14:30:00', 'Gặp trực tiếp', 'Completed', NULL, '2025-12-12 15:20:00'),
(1, 3, '2025-12-22 10:00:00', 'Online', 'Completed', 'https://zoom.us/j/123456789', '2025-12-20 08:45:00');

-- Lịch hẹn đã xác nhận (sắp tới)
INSERT INTO consultation_appointments (expert_id, user_id, scheduled_at, meeting_type, status, meeting_link, created_at) VALUES
(1, 3, '2025-12-30 09:00:00', 'Online', 'Confirmed', 'https://meet.google.com/xyz-uvwx-rst', '2025-12-25 11:00:00'),
(1, 3, '2026-01-05 15:00:00', 'Gặp trực tiếp', 'Confirmed', NULL, '2025-12-26 14:30:00'),
(1, 3, '2026-01-10 10:30:00', 'Online', 'Confirmed', 'https://zoom.us/j/987654321', '2025-12-27 09:15:00');

-- Lịch hẹn đang chờ xác nhận
INSERT INTO consultation_appointments (expert_id, user_id, scheduled_at, meeting_type, status, meeting_link, created_at) VALUES
(1, 3, '2026-01-12 14:00:00', 'Online', 'Pending', NULL, '2025-12-28 16:20:00'),
(1, 3, '2026-01-15 11:00:00', 'Gặp trực tiếp', 'Pending', NULL, '2025-12-29 10:00:00');

-- Lịch hẹn đã hủy
INSERT INTO consultation_appointments (expert_id, user_id, scheduled_at, meeting_type, status, meeting_link, created_at) VALUES
(1, 3, '2025-12-20 16:00:00', 'Online', 'Cancelled', NULL, '2025-12-18 13:30:00');

-- ===================================================
-- 2. THÊM DANH MỤC BÀI TẬP
-- ===================================================

INSERT INTO mind_categories (category_name, description, icon_url, intent, display_order, is_active) VALUES
('Thiền chánh niệm', 'Các bài tập thiền giúp bạn sống trong hiện tại và nhận thức sâu sắc về cảm xúc', 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400', 'meditation', 1, 1),
('Hô hấp thư giãn', 'Kỹ thuật hô hấp để giảm căng thẳng và lo âu', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', 'breathing', 2, 1),
('Yoga trị liệu', 'Bài tập yoga kết hợp với tâm lý trị liệu', 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400', 'yoga', 3, 1),
('Thư giãn cơ bắp', 'Progressive Muscle Relaxation - giảm căng thẳng cơ thể', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', 'relaxation', 4, 1),
('Quản lý căng thẳng', 'Kỹ năng đối phó với stress hàng ngày', 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400', 'stress', 5, 1),
('Cải thiện giấc ngủ', 'Bài tập giúp dễ ngủ và ngủ ngon hơn', 'https://images.unsplash.com/photo-1511295742362-92c96b1cf484?w=400', 'sleep', 6, 1),
('Tăng năng lượng', 'Bài tập giúp tăng cường năng lượng và sức sống', 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400', 'energy', 7, 1),
('Quản lý cảm xúc', 'Nhận diện và điều chỉnh cảm xúc tiêu cực', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400', 'emotion', 8, 1);

-- ===================================================
-- 3. THÊM BÀI TẬP MẪU (30+ bài tập đa dạng)
-- ===================================================

-- DANH MỤC 1: THIỀN CHÁNH NIỆM (7 bài)
INSERT INTO mind_exercises (category_id, title, description, duration_minutes, difficulty_level, media_type, media_url, instructions, view_count, is_active) VALUES
(1, 'Thiền quan sát hơi thở', 'Tập trung vào hơi thở tự nhiên của bạn để đưa tâm trí về hiện tại', 10, 'Easy', 'Audio', 'https://www.youtube.com/watch?v=inpok4MKVLM', 'Ngồi thẳng lưng, nhắm mắt, tập trung vào hơi thở vào ra tự nhiên. Khi tâm trí lang thang, nhẹ nhàng đưa nó về hơi thở.', 245, 1),
(1, 'Body Scan - Quét toàn thân', 'Đưa sự chú ý từng phần cơ thể để nhận diện căng thẳng', 15, 'Medium', 'Audio', 'https://www.youtube.com/watch?v=15q-N-_kkrU', 'Nằm ngửa thoải mái. Bắt đầu từ ngón chân, di chuyển sự chú ý lên từng phần cơ thể, nhận ra các cảm giác.', 189, 1),
(1, 'Thiền từ bi (Loving-Kindness)', 'Gửi lời chúc yêu thương đến bản thân và người khác', 20, 'Medium', 'Video', 'https://www.youtube.com/watch?v=sz7cpV7ERsM', 'Ngồi thiền, thầm nghĩ "Cầu mong tôi được hạnh phúc, khỏe mạnh, bình an". Sau đó gửi lời chúc đến người thân, bạn bè, và mọi người.', 156, 1),
(1, 'Thiền đi bộ chánh niệm', 'Đi bộ chậm rãi và chú ý từng bước chân', 15, 'Easy', 'Video', 'https://www.youtube.com/watch?v=kkDDsxEbkIs', 'Đi thật chậm, cảm nhận từng động tác: nhấc chân, di chuyển, chạm đất. Giữ tâm trí tập trung vào cảm giác ở bàn chân.', 201, 1),
(1, 'Thiền quan sát âm thanh', 'Lắng nghe các âm thanh xung quanh không phán xét', 10, 'Easy', 'Audio', 'https://www.youtube.com/watch?v=wzsSM_OOjPU', 'Ngồi yên, nhắm mắt. Mở rộng tai nghe tất cả âm thanh gần xa mà không phán xét, không gán nhãn.', 178, 1),
(1, 'Thiền núi bất động', 'Hình dung bản thân như ngọn núi vững chắc', 20, 'Hard', 'Audio', 'https://www.youtube.com/watch?v=cAjVdv4RL2s', 'Ngồi vững vàng. Hình dung bạn là ngọn núi, dù thời tiết thay đổi, núi vẫn bất động. Áp dụng vào cảm xúc dao động.', 134, 1),
(1, 'Thiền ăn chánh niệm', 'Ăn chậm rãi và chú ý đến từng giác quan', 25, 'Medium', 'Video', 'https://www.youtube.com/watch?v=6tw93IgfLo8', 'Cầm một miếng thức ăn (nho khô, chocolate), quan sát, ngửi, nếm từng động tác một cách chậm rãi và trọn vẹn.', 112, 1);

-- DANH MỤC 2: HÔ HẤP THƯ GIÃN (6 bài)
INSERT INTO mind_exercises (category_id, title, description, duration_minutes, difficulty_level, media_type, media_url, instructions, view_count, is_active) VALUES
(2, 'Hô hấp bụng (Diaphragmatic)', 'Kỹ thuật thở sâu bằng cơ hoành để giảm lo âu', 8, 'Easy', 'Video', 'https://www.youtube.com/watch?v=8r7sJfHDIBQ', 'Nằm ngửa, đặt tay lên bụng. Hít vào sâu qua mũi, bụng phồng lên. Thở ra chậm qua miệng, bụng xẹp xuống.', 312, 1),
(2, 'Hô hấp 4-7-8 (Thở giấc ngủ)', 'Kỹ thuật thở giúp dễ ngủ và giảm căng thẳng', 5, 'Easy', 'Audio', 'https://www.youtube.com/watch?v=YRPh_GaiL8s', 'Hít vào 4 giây qua mũi, giữ 7 giây, thở ra 8 giây qua miệng. Lặp lại 4 chu kỳ.', 289, 1),
(2, 'Hô hấp vuông (Box Breathing)', 'Kỹ thuật thở 4 bước giúp tập trung', 10, 'Medium', 'Audio', 'https://www.youtube.com/watch?v=tEmt1Znux58', 'Hít vào 4s, giữ 4s, thở ra 4s, giữ 4s. Tạo thành hình vuông. Lặp lại 5-10 phút.', 267, 1),
(2, 'Hô hấp xen kẽ mũi (Nadi Shodhana)', 'Cân bằng hai bán cầu não bằng hô hấp yoga', 12, 'Hard', 'Video', 'https://www.youtube.com/watch?v=8VwufJrUhic', 'Dùng ngón tay bịt xen kẽ lỗ mũi trái/phải. Thở vào mũi trái, ra mũi phải. Đổi lại. Lặp lại chu kỳ.', 198, 1),
(2, 'Hô hấp Sư Tử (Simhasana)', 'Giải phóng căng thẳng ở mặt và cổ họng', 5, 'Easy', 'Video', 'https://www.youtube.com/watch?v=8nWUAmOhOEs', 'Quỳ gối, hít vào sâu qua mũi. Thở ra mạnh qua miệng, lè lưỡi ra, kêu "HA" to. Lặp lại 3-5 lần.', 156, 1),
(2, 'Hô hấp lan tỏa (Extending Breath)', 'Kéo dài thở ra để kích hoạt thần kinh phó giao cảm', 15, 'Medium', 'Audio', 'https://www.youtube.com/watch?v=4Lb5L-VEm34', 'Hít vào 4 giây, thở ra 6-8 giây. Tập trung vào việc kéo dài thở ra nhiều hơn thở vào.', 223, 1);

-- DANH MỤC 3: YOGA TRỊ LIỆU (5 bài)
INSERT INTO mind_exercises (category_id, title, description, duration_minutes, difficulty_level, media_type, media_url, instructions, view_count, is_active) VALUES
(3, 'Yoga chào mặt trời buổi sáng', 'Chuỗi động tác yoga khởi động cơ thể', 20, 'Medium', 'Video', 'https://www.youtube.com/watch?v=73sjOu0g58A', 'Thực hiện 12 tư thế liên tiếp: núi, tay lên, cúi trước, lunge, plank, cobra, chó úp, lunge, cúi, tay lên, núi.', 234, 1),
(3, 'Yoga tư thế em bé (Child Pose)', 'Tư thế nghỉ ngơi giúp thư giãn lưng', 10, 'Easy', 'Video', 'https://www.youtube.com/watch?v=2MSDllWqMII', 'Quỳ gối, ngồi gót chân, cúi người về phía trước, trán chạm đất, tay duỗi thẳng. Thở sâu.', 298, 1),
(3, 'Yoga tư thế xoắn nằm', 'Giải phóng căng thẳng cột sống', 15, 'Easy', 'Video', 'https://www.youtube.com/watch?v=L_xrDAtykMI', 'Nằm ngửa, ôm đầu gối vào ngực, xoay chân sang một bên, tay dang rộng. Giữ 5 phút mỗi bên.', 187, 1),
(3, 'Yoga tư thế cây (Tree Pose)', 'Cải thiện thăng bằng và tập trung', 12, 'Medium', 'Video', 'https://www.youtube.com/watch?v=K46X6a9k4q8', 'Đứng một chân, chân kia đặt vào đùi chân đang đứng. Tay chắp trước ngực hoặc lên trên đầu. Giữ thăng bằng.', 176, 1),
(3, 'Yoga tư thế xác chết (Savasana)', 'Thư giãn toàn diện sau khi tập', 20, 'Easy', 'Audio', 'https://www.youtube.com/watch?v=1vx8iUvfyCY', 'Nằm ngửa, chân dang rộng, tay để hai bên, lòng bàn tay hướng lên. Thả lỏng hoàn toàn, tập trung vào hơi thở.', 312, 1);

-- DANH MỤC 4: THƯ GIÃN CƠ BẮP (4 bài)
INSERT INTO mind_exercises (category_id, title, description, duration_minutes, difficulty_level, media_type, media_url, instructions, view_count, is_active) VALUES
(4, 'PMR - Thư giãn cơ bắp tiến triển', 'Căng giãn từng nhóm cơ để giải phóng căng thẳng', 20, 'Medium', 'Audio', 'https://www.youtube.com/watch?v=ihO02wUzgkc', 'Bắt đầu từ ngón chân, căng cơ 5s rồi thả lỏng 10s. Di chuyển lên từng nhóm cơ: bắp chân, đùi, bụng, ngực, vai, tay, mặt.', 198, 1),
(4, 'Massage tự thân điểm áp lực', 'Kỹ thuật tự massage các điểm huyệt', 15, 'Easy', 'Video', 'https://www.youtube.com/watch?v=3kWQRKS0yEw', 'Dùng ngón tay ấn nhẹ vào các điểm: thái dương, trung tâm trán, vai, cổ. Xoa tròn 30s mỗi điểm.', 167, 1),
(4, 'Giãn cơ cổ vai văn phòng', 'Bài tập giảm đau mỏi cho dân văn phòng', 10, 'Easy', 'Video', 'https://www.youtube.com/watch?v=4g2Pxe1LZ1c', 'Ngồi ghế, xoay cổ từ từ, vai lên xuống, nghiêng đầu sang hai bên, xoay vai tròn.', 256, 1),
(4, 'Thư giãn cơ mặt', 'Giảm căng thẳng ở cơ mặt và hàm', 8, 'Easy', 'Video', 'https://www.youtube.com/watch?v=MX0h9EvzvUQ', 'Nhăn trán, nheo mắt, nhăn mũi, cười rộng, chu môi. Mỗi động tác giữ 5s rồi thả lỏng.', 145, 1);

-- DANH MỤC 5: QUẢN LÝ CĂNG THẲNG (5 bài)
INSERT INTO mind_exercises (category_id, title, description, duration_minutes, difficulty_level, media_type, media_url, instructions, view_count, is_active) VALUES
(5, 'Viết nhật ký cảm xúc', 'Ghi lại suy nghĩ và cảm xúc để giải tỏa', 15, 'Easy', 'Text', NULL, 'Mỗi tối, dành 15 phút viết ra: 3 điều tốt trong ngày, 1 cảm xúc khó khăn, 1 bài học rút ra.', 189, 1),
(5, 'Kỹ thuật 5-4-3-2-1 Grounding', 'Đưa tâm trí về hiện tại khi lo âu', 5, 'Easy', 'Text', NULL, 'Nhận diện: 5 thứ nhìn thấy, 4 thứ chạm được, 3 âm thanh, 2 mùi hương, 1 vị giác.', 234, 1),
(5, 'Lập kế hoạch quản lý thời gian', 'Tổ chức công việc để giảm stress', 20, 'Medium', 'Text', NULL, 'Liệt kê công việc, ưu tiên theo ma trận Eisenhower (khẩn/quan trọng), chia nhỏ nhiệm vụ, đặt deadline thực tế.', 167, 1),
(5, 'Nói "không" một cách khéo léo', 'Kỹ năng từ chối để bảo vệ năng lượng', 10, 'Medium', 'Text', NULL, 'Học cách nói: "Tôi đánh giá cao lời mời, nhưng hiện tại tôi không thể cam kết vì [lý do]."', 145, 1),
(5, 'Tắm rừng (Forest Bathing)', 'Đắm mình trong thiên nhiên để hồi phục', 60, 'Easy', 'Text', NULL, 'Đi dạo trong rừng hoặc công viên, không nghe điện thoại. Dùng 5 giác quan để trải nghiệm thiên nhiên.', 178, 1);

-- DANH MỤC 6: CẢI THIỆN GIẤC NGỦ (5 bài)
INSERT INTO mind_exercises (category_id, title, description, duration_minutes, difficulty_level, media_type, media_url, instructions, view_count, is_active) VALUES
(6, 'Thiền trước khi ngủ', 'Thư giãn tâm trí để dễ chìm vào giấc ngủ', 15, 'Easy', 'Audio', 'https://www.youtube.com/watch?v=aEqlQvczMJQ', 'Nằm trên giường, nhắm mắt, tập trung vào hơi thở. Từ từ thả lỏng từng phần cơ thể từ đầu xuống chân.', 267, 1),
(6, 'Yoga cho giấc ngủ ngon', 'Chuỗi động tác yoga nhẹ nhàng', 20, 'Easy', 'Video', 'https://www.youtube.com/watch?v=BiWDsfZ3zbo', 'Thực hiện: tư thế em bé, tư thế xoắn nằm, tư thế chân lên tường, tư thế xác chết.', 234, 1),
(6, 'Âm thanh trắng & Pink Noise', 'Âm thanh giúp che tiếng ồn và dễ ngủ', 60, 'Easy', 'Audio', 'https://www.youtube.com/watch?v=nMfPqeZjc2c', 'Phát âm thanh trắng hoặc pink noise với âm lượng vừa phải. Để chạy suốt đêm.', 298, 1),
(6, 'Massage bàn chân trước ngủ', 'Kích thích huyệt đạo giúp thư giãn', 10, 'Easy', 'Video', 'https://www.youtube.com/watch?v=9K7Hqk-V0Wc', 'Ngồi, dùng ngón tay cái ấn vào các điểm trên lòng bàn chân, xoa tròn nhẹ nhàng.', 189, 1),
(6, 'Lập thói quen trước giờ ngủ', 'Xây dựng nghi thức ngủ ổn định', 30, 'Medium', 'Text', NULL, 'Tắt màn hình 1h trước ngủ, tắm nước ấm, uống trà thảo mộc, đọc sách nhẹ, giường chỉ để ngủ.', 156, 1);

-- DANH MỤC 7: TĂNG NĂNG LƯỢNG (4 bài)
INSERT INTO mind_exercises (category_id, title, description, duration_minutes, difficulty_level, media_type, media_url, instructions, view_count, is_active) VALUES
(7, 'Hô hấp lửa Kapalabhati', 'Kỹ thuật thở yoga tăng năng lượng', 5, 'Hard', 'Video', 'https://www.youtube.com/watch?v=rVGyfiExelg', 'Thở ra mạnh và nhanh qua mũi, bụng co lại. Thở vào tự động. Lặp lại 30 lần/chu kỳ, 3 chu kỳ.', 178, 1),
(7, 'Nhảy tại chỗ & Vận động buổi sáng', 'Đánh thức cơ thể với vận động', 10, 'Easy', 'Video', 'https://www.youtube.com/watch?v=7kE9TpS0pWQ', 'Nhảy tại chỗ, đá chân, xoay eo, vỗ tay. Bật nhạc sôi động và cử động tự do 10 phút.', 212, 1),
(7, 'Power Pose - Tư thế quyền lực', 'Tư thế cơ thể ảnh hưởng năng lượng', 5, 'Easy', 'Text', NULL, 'Đứng chân rộng, tay chống ngang hông hoặc giơ cao. Giữ 2 phút, tưởng tượng bạn mạnh mẽ tự tin.', 167, 1),
(7, 'Tưởng tượng tích cực (Visualization)', 'Hình dung mục tiêu để tăng động lực', 15, 'Medium', 'Audio', 'https://www.youtube.com/watch?v=KcZfz8M_P6A', 'Ngồi thiền, hình dung rõ nét bạn đạt được mục tiêu: cảm giác, hình ảnh, âm thanh. Sống trong khoảnh khắc thành công đó.', 145, 1);

-- DANH MỤC 8: QUẢN LÝ CẢM XÚC (5 bài)
INSERT INTO mind_exercises (category_id, title, description, duration_minutes, difficulty_level, media_type, media_url, instructions, view_count, is_active) VALUES
(8, 'Nhận diện cảm xúc với Emotion Wheel', 'Học cách đặt tên chính xác cho cảm xúc', 10, 'Easy', 'Text', NULL, 'Khi cảm thấy khó chịu, dùng Emotion Wheel để tìm từ chính xác: không phải "tôi buồn" mà là "tôi thất vọng/cô đơn/bị từ chối".', 198, 1),
(8, 'Kỹ thuật RAIN cho cảm xúc khó', 'Recognize, Allow, Investigate, Nurture', 15, 'Medium', 'Audio', 'https://www.youtube.com/watch?v=GfRf43JTqY4', 'R: Nhận ra cảm xúc. A: Chấp nhận nó. I: Khám phá nguồn gốc. N: Chăm sóc bản thân với lòng từ bi.', 176, 1),
(8, 'Viết thư cho cảm xúc', 'Đối thoại với cảm xúc tiêu cực', 20, 'Medium', 'Text', NULL, 'Viết thư gửi "Lo âu", "Giận dữ", "Buồn bã". Hỏi: "Bạn muốn nói gì với tôi? Bạn đang bảo vệ tôi khỏi điều gì?"', 134, 1),
(8, 'Box of Worries - Hộp lo lắng', 'Tạm gác lo âu để tập trung hiện tại', 5, 'Easy', 'Text', NULL, 'Viết các lo lắng ra giấy, bỏ vào hộp. Hẹn thời gian cụ thể để "lo" (VD: 19h tối). Trong ngày không nghĩ đến.', 167, 1),
(8, 'Bài tập biết ơn 3 điều tốt', 'Chuyển hướng tâm trí sang tích cực', 10, 'Easy', 'Text', NULL, 'Mỗi tối viết 3 điều tốt trong ngày, dù nhỏ: "Tôi uống được tách cà phê ngon", "Tôi được khen".', 289, 1);

-- ===================================================
-- 4. THÊM THÔNG BÁO MẪU VỀ LỊCH HẸN
-- ===================================================

-- ===================================================
-- CẬP NHẬT HÌNH ẢNH CHO BÀI TẬP
-- ===================================================

-- DANH MỤC 1: THIỀN CHÁNH NIỆM
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80' WHERE title = 'Thiền quan sát hơi thở';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80' WHERE title = 'Body Scan - Quét toàn thân';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80' WHERE title = 'Thiền từ bi (Loving-Kindness)';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1502635385003-ee1e6d00a14a?auto=format&fit=crop&w=600&q=80' WHERE title = 'Thiền đi bộ chánh niệm';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=600&q=80' WHERE title = 'Thiền quan sát âm thanh';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80' WHERE title = 'Thiền núi bất động';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=600&q=80' WHERE title = 'Thiền ăn chánh niệm';

-- DANH MỤC 2: HÔ HẤP THƯ GIÃN
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80' WHERE title = 'Hô hấp bụng (Diaphragmatic)';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1511295742362-92c96b1cf484?auto=format&fit=crop&w=600&q=80' WHERE title = 'Hô hấp 4-7-8 (Thở giấc ngủ)';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80' WHERE title = 'Hô hấp vuông (Box Breathing)';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=600&q=80' WHERE title = 'Hô hấp xen kẽ mũi (Nadi Shodhana)';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=600&q=80' WHERE title = 'Hô hấp Sư Tử (Simhasana)';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80' WHERE title = 'Hô hấp lan tỏa (Extending Breath)';

-- DANH MỤC 3: YOGA TRỊ LIỆU
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&w=600&q=80' WHERE title = 'Yoga chào mặt trời buổi sáng';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=600&q=80' WHERE title = 'Yoga tư thế em bé (Child Pose)';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80' WHERE title = 'Yoga tư thế xoắn nằm';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80' WHERE title = 'Yoga tư thế cây (Tree Pose)';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80' WHERE title = 'Yoga tư thế xác chết (Savasana)';

-- DANH MỤC 4: THƯ GIÃN CƠ BẮP
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80' WHERE title = 'PMR - Thư giãn cơ bắp tiến triển';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=600&q=80' WHERE title = 'Massage tự thân điểm áp lực';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=600&q=80' WHERE title = 'Giãn cơ cổ vai văn phòng';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=80' WHERE title = 'Thư giãn cơ mặt';

-- DANH MỤC 5: QUẢN LÝ CĂNG THẲNG
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80' WHERE title = 'Viết nhật ký cảm xúc';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80' WHERE title = 'Kỹ thuật 5-4-3-2-1 Grounding';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&q=80' WHERE title = 'Lập kế hoạch quản lý thời gian';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80' WHERE title = 'Nói "không" một cách khéo léo';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80' WHERE title = 'Tắm rừng (Forest Bathing)';

-- DANH MỤC 6: CẢI THIỆN GIẤC NGỦ
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1515894203077-9cd36032142f?auto=format&fit=crop&w=600&q=80' WHERE title = 'Thiền trước khi ngủ';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80' WHERE title = 'Yoga cho giấc ngủ ngon';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1511295742362-92c96b1cf484?auto=format&fit=crop&w=600&q=80' WHERE title = 'Âm thanh trắng & Pink Noise';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=600&q=80' WHERE title = 'Massage bàn chân trước ngủ';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1513257805917-43bfe5d6d86a?auto=format&fit=crop&w=600&q=80' WHERE title = 'Lập thói quen trước giờ ngủ';

-- DANH MỤC 7: TĂNG NĂNG LƯỢNG
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80' WHERE title = 'Hô hấp lửa Kapalabhati';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80' WHERE title = 'Nhảy tại chỗ & Vận động buổi sáng';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80' WHERE title = 'Power Pose - Tư thế quyền lực';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80' WHERE title = 'Tưởng tượng tích cực (Visualization)';

-- DANH MỤC 8: QUẢN LÝ CẢM XÚC
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80' WHERE title = 'Nhận diện cảm xúc với Emotion Wheel';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80' WHERE title = 'Kỹ thuật RAIN cho cảm xúc khó';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80' WHERE title = 'Viết thư cho cảm xúc';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80' WHERE title = 'Box of Worries - Hộp lo lắng';
UPDATE mind_exercises SET image_url = 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80' WHERE title = 'Bài tập biết ơn 3 điều tốt';

-- ===================================================
-- 4. THÊM THÔNG BÁO MẪU VỀ LỊCH HẸN
-- ===================================================

INSERT INTO notifications (user_id, type, title, message, related_id, is_read, created_at) VALUES
(3, 'appointment', 'Lịch hẹn được xác nhận', 'BS. Nguyễn Thị Lan đã xác nhận lịch hẹn của bạn vào ngày 30/12/2025 lúc 09:00', 4, 0, '2025-12-25 11:30:00'),
(3, 'appointment', 'Nhắc nhở lịch hẹn', 'Bạn có lịch hẹn với BS. Nguyễn Thị Lan vào ngày mai lúc 09:00. Link: https://meet.google.com/xyz-uvwx-rst', 4, 0, '2025-12-29 09:00:00'),
(3, 'appointment', 'Lịch hẹn được xác nhận', 'BS. Nguyễn Thị Lan đã xác nhận lịch hẹn gặp trực tiếp vào ngày 05/01/2026 lúc 15:00', 5, 1, '2025-12-26 15:00:00'),
(3, 'appointment', 'Lịch hẹn mới chờ xác nhận', 'Lịch hẹn của bạn với BS. Nguyễn Thị Lan vào ngày 12/01/2026 đang chờ xác nhận', 7, 0, '2025-12-28 16:30:00');

-- ===================================================
-- 5. THÊM ĐÁNH GIÁ MẪU CHO CHUYÊN GIA
-- ===================================================

INSERT INTO reviews (user_id, target_type, target_id, rating, comment, created_at) VALUES
(3, 'expert', 1, 5, 'Bác sĩ Lan rất tận tâm và chu đáo. Tôi cảm thấy được lắng nghe và hiểu rõ vấn đề của mình hơn.', '2025-12-16 10:30:00'),
(3, 'expert', 1, 5, 'Buổi tư vấn rất hữu ích! Bác sĩ đưa ra nhiều góc nhìn mới giúp tôi nhìn nhận vấn đề tích cực hơn.', '2025-12-19 15:45:00'),
(3, 'expert', 1, 4, 'Chuyên nghiệp và thân thiện. Phương pháp tiếp cận rất khoa học.', '2025-12-23 11:20:00');

-- ===================================================
-- 6. THÊM LỊCH SỬ XEM BÀI TẬP
-- ===================================================

INSERT INTO exercise_views (user_id, exercise_id, viewed_at, completed) VALUES
(3, 1, '2025-12-25 08:30:00', 1),
(3, 2, '2025-12-25 20:15:00', 1),
(3, 8, '2025-12-26 07:45:00', 1),
(3, 9, '2025-12-26 21:30:00', 0),
(3, 15, '2025-12-27 09:00:00', 1),
(3, 20, '2025-12-27 22:00:00', 1),
(3, 25, '2025-12-28 08:00:00', 0),
(3, 1, '2025-12-28 20:30:00', 1);

-- ===================================================
-- HOÀN TẤT - Đã thêm:
-- - 9 lịch hẹn với BS. Nguyễn Thị Lan (đa dạng trạng thái)
-- - 8 danh mục bài tập
-- - 36 bài tập chi tiết (phong phú và thực tế)
-- - 4 thông báo về lịch hẹn
-- - 3 đánh giá cho chuyên gia
-- - 8 lịch sử xem bài tập
-- ===================================================
