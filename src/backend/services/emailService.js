const nodemailer = require('nodemailer');
const notificationModel = require('../models/notificationModel');

// Cấu hình email transporter
// Bạn cần cập nhật với thông tin email thực tế
const createTransporter = () => {
    // Sử dụng Gmail hoặc SMTP khác
    return nodemailer.createTransporter({
        service: 'gmail', // Hoặc 'smtp' cho custom SMTP
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com',
            pass: process.env.EMAIL_PASSWORD || 'your-app-password'
        }
    });
};

// Gửi email reset password
const sendPasswordResetEmail = async (email, resetToken, userName) => {
    try {
        const transporter = createTransporter();

        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@mentalhealth.com',
            to: email,
            subject: 'Đặt lại mật khẩu - Mental Health Care',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
                    <h2 style="color: #4A90E2;">Yêu cầu đặt lại mật khẩu</h2>
                    <p>Xin chào ${userName || 'bạn'},</p>
                    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                    <p>Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" 
                           style="background-color: #4A90E2; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Đặt lại mật khẩu
                        </a>
                    </div>
                    <p>Hoặc copy link sau vào trình duyệt:</p>
                    <p style="color: #666; word-break: break-all;">${resetLink}</p>
                    <p style="color: #999; font-size: 12px; margin-top: 30px;">
                        Link này sẽ hết hạn sau 1 giờ.<br>
                        Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Lỗi gửi email reset password:', error);
        return { success: false, error: error.message };
    }
};

// Gửi email nhắc lịch hẹn
const sendAppointmentReminderEmail = async (email, appointmentDetails) => {
    try {
        const transporter = createTransporter();

        const { expert_name, scheduled_at, meeting_link } = appointmentDetails;
        const appointmentDate = new Date(scheduled_at).toLocaleString('vi-VN');

        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@mentalhealth.com',
            to: email,
            subject: 'Nhắc nhở: Lịch hẹn tư vấn sắp diễn ra',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
                    <h2 style="color: #4A90E2;">Nhắc nhở lịch hẹn</h2>
                    <p>Xin chào,</p>
                    <p>Bạn có một lịch hẹn tư vấn sắp diễn ra:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Chuyên gia:</strong> ${expert_name}</p>
                        <p><strong>Thời gian:</strong> ${appointmentDate}</p>
                        ${meeting_link ? `<p><strong>Link họp:</strong> <a href="${meeting_link}">${meeting_link}</a></p>` : ''}
                    </div>
                    <p>Vui lòng chuẩn bị và tham gia đúng giờ.</p>
                    <p style="color: #999; font-size: 12px; margin-top: 30px;">
                        Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Lỗi gửi email nhắc lịch:', error);
        return { success: false, error: error.message };
    }
};

// Gửi email xác nhận đăng ký
const sendWelcomeEmail = async (email, userName) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@mentalhealth.com',
            to: email,
            subject: 'Chào mừng đến với Mental Health Care',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
                    <h2 style="color: #4A90E2;">Chào mừng bạn đến với Mental Health Care!</h2>
                    <p>Xin chào ${userName},</p>
                    <p>Cảm ơn bạn đã đăng ký tài khoản tại Mental Health Care.</p>
                    <p>Chúng tôi rất vui được đồng hành cùng bạn trên hành trình chăm sóc sức khỏe tinh thần.</p>
                    <div style="margin: 30px 0;">
                        <h3>Các tính năng bạn có thể sử dụng:</h3>
                        <ul style="line-height: 2;">
                            <li>Chat với AI Bot thông minh</li>
                            <li>Ghi nhật ký cảm xúc hàng ngày</li>
                            <li>Thống kê và phân tích cảm xúc</li>
                            <li>Đặt lịch tư vấn với chuyên gia</li>
                            <li>Bài tập thiền và thư giãn</li>
                        </ul>
                    </div>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                           style="background-color: #4A90E2; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Bắt đầu ngay
                        </a>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Lỗi gửi email chào mừng:', error);
        return { success: false, error: error.message };
    }
};

// Gửi email thông báo tin nhắn mới từ chuyên gia
const sendNewMessageNotification = async (email, senderName, message) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@mentalhealth.com',
            to: email,
            subject: 'Tin nhắn mới từ chuyên gia',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
                    <h2 style="color: #4A90E2;">Bạn có tin nhắn mới</h2>
                    <p>Chuyên gia <strong>${senderName}</strong> đã gửi tin nhắn cho bạn:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="font-style: italic;">"${message.substring(0, 200)}${message.length > 200 ? '...' : ''}"</p>
                    </div>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/doctor-chat" 
                           style="background-color: #4A90E2; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Xem tin nhắn
                        </a>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Lỗi gửi email thông báo tin nhắn:', error);
        return { success: false, error: error.message };
    }
};

// Tạo thông báo trong hệ thống (không gửi email)
const createNotification = async (userId, type, title, message, relatedId = null) => {
    try {
        await notificationModel.createNotification(userId, type, title, message, relatedId);
        return { success: true };
    } catch (error) {
        console.error('Lỗi tạo thông báo:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendPasswordResetEmail,
    sendAppointmentReminderEmail,
    sendWelcomeEmail,
    sendNewMessageNotification,
    createNotification
};
