const DoctorChat = require('../models/doctorChatModel');
const Expert = require('../models/expertModel');

// Gửi tin nhắn giữa user và bác sĩ
// URL gợi ý: POST /api/doctor-chat/messages/:peerId
exports.sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const peerId = parseInt(req.params.peerId, 10);

        if (!message || !message.trim()) {
            return res.status(400).json({ message: 'Tin nhắn không được để trống.' });
        }
        if (!peerId) {
            return res.status(400).json({ message: 'Thiếu đối tượng trò chuyện.' });
        }

        const currentUser = req.user; // gắn từ middleware
        // Hệ thống hiện đang dùng role 'doctor' cho bác sĩ/chuyên gia, nhưng cũng hỗ trợ 'expert' nếu có
        const isDoctor = currentUser.role === 'doctor' || currentUser.role === 'expert';
        let userId, expertId, senderType;

        if (isDoctor) {
            // Map từ user_id của bác sĩ sang expert_id trong bảng experts
            const expert = await Expert.getByUserId(currentUser.id);
            if (!expert) {
                return res.status(400).json({ message: 'Tài khoản bác sĩ/chuyên gia chưa được cấu hình trong bảng experts.' });
            }

            expertId = expert.expert_id;
            userId = peerId;
            // Giá trị ENUM trong bảng là 'user' | 'doctor'
            senderType = 'doctor';
        } else {
            userId = currentUser.id;
            expertId = peerId;
            senderType = 'user';
        }

        await DoctorChat.sendMessage(userId, expertId, senderType, message.trim());

        res.status(201).json({ message: 'Đã gửi tin nhắn.' });
    } catch (error) {
        console.error('[DoctorChat] sendMessage error:', error);
        res.status(500).json({ message: 'Lỗi server khi gửi tin nhắn.' });
    }
};

// Lấy toàn bộ hội thoại giữa user hiện tại và peer (doctor/user)
// URL: GET /api/doctor-chat/messages/:peerId
exports.getConversation = async (req, res) => {
    try {
        const peerId = parseInt(req.params.peerId, 10);
        if (!peerId) {
            return res.status(400).json({ message: 'Thiếu đối tượng trò chuyện.' });
        }

        const currentUser = req.user;
        const isDoctor = currentUser.role === 'doctor' || currentUser.role === 'expert';
        let userId, expertId;

        if (isDoctor) {
            // Map từ user_id của bác sĩ sang expert_id trong bảng experts
            const expert = await Expert.getByUserId(currentUser.id);
            if (!expert) {
                return res.status(400).json({ message: 'Tài khoản bác sĩ/chuyên gia chưa được cấu hình trong bảng experts.' });
            }

            expertId = expert.expert_id;
            userId = peerId;
        } else {
            userId = currentUser.id;
            expertId = peerId;
        }

        const messages = await DoctorChat.getConversation(userId, expertId);
        res.json({ data: messages });
    } catch (error) {
        console.error('[DoctorChat] getConversation error:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy hội thoại.' });
    }
};

// Danh sách đối tác trò chuyện (đối với bác sĩ: danh sách bệnh nhân, đối với user: danh sách bác sĩ đã chat)
// URL: GET /api/doctor-chat/partners
exports.getPartners = async (req, res) => {
    try {
        const currentUser = req.user;
        const isDoctor = currentUser.role === 'doctor' || currentUser.role === 'expert';

        if (isDoctor) {
            const partners = await DoctorChat.getDoctorPartners(currentUser.id);
            return res.json({ data: partners });
        } else {
            const partners = await DoctorChat.getUserDoctors(currentUser.id);
            return res.json({ data: partners });
        }
    } catch (error) {
        console.error('[DoctorChat] getPartners error:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách hội thoại.' });
    }
};
