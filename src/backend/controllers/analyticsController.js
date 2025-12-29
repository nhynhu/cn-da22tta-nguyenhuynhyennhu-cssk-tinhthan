const Analytics = require('../models/analyticsModel');

// Thống kê tổng quan cảm xúc (pie chart) cho user đang đăng nhập
exports.getEmotionSummary = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Không xác định được người dùng.' });
        }

        const userId = req.user.id;
        const summary = await Analytics.getEmotionSummary(userId, days);

        res.status(200).json({
            period: `${days} ngày qua`,
            data: summary
        });

    } catch (error) {
        console.error('Lỗi lấy thống kê tổng quan:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// Xu hướng cảm xúc theo thời gian (line chart) cho user đang đăng nhập
exports.getEmotionTrend = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Không xác định được người dùng.' });
        }

        const userId = req.user.id;
        const trend = await Analytics.getEmotionTrend(userId, days);

        // Format lại data cho chart
        const dateMap = {};
        trend.forEach(row => {
            const dateStr = row.date;
            if (!dateMap[dateStr]) {
                dateMap[dateStr] = { date: dateStr };
            }
            dateMap[dateStr][row.emotion_name] = row.total_count;
        });

        const chartData = Object.values(dateMap).reverse(); // Sắp xếp từ cũ đến mới

        res.status(200).json({
            period: `${days} ngày qua`,
            data: chartData
        });

    } catch (error) {
        console.error('Lỗi lấy xu hướng cảm xúc:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// Thống kê chi tiết (combined emotion_logs + chat_logs) cho user đang đăng nhập
exports.getCombinedStats = async (req, res) => {
    try {
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Không xác định được người dùng.' });
        }

        const userId = req.user.id;
        const stats = await Analytics.getCombinedEmotionStats(userId, startDate, endDate);

        res.status(200).json({
            user_id: userId,
            start_date: startDate,
            end_date: endDate,
            data: stats
        });

    } catch (error) {
        console.error('Lỗi lấy thống kê chi tiết:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// Thống kê riêng từ emotion_logs cho user đang đăng nhập
exports.getEmotionLogsStats = async (req, res) => {
    try {
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Không xác định được người dùng.' });
        }

        const userId = req.user.id;
        const stats = await Analytics.getEmotionStats(userId, startDate, endDate);

        res.status(200).json({
            source: 'emotion_logs',
            data: stats
        });

    } catch (error) {
        console.error('Lỗi lấy thống kê emotion logs:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// Thống kê riêng từ chat_logs cho user đang đăng nhập
exports.getChatLogsStats = async (req, res) => {
    try {
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Không xác định được người dùng.' });
        }

        const userId = req.user.id;
        const stats = await Analytics.getChatEmotionStats(userId, startDate, endDate);

        res.status(200).json({
            source: 'chat_logs',
            data: stats
        });

    } catch (error) {
        console.error('Lỗi lấy thống kê chat logs:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};
