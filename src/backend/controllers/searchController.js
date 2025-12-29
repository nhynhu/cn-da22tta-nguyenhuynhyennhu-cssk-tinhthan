const searchModel = require('../models/searchModel');

// Tìm kiếm chuyên gia
const searchExperts = async (req, res) => {
    try {
        const { q, specialization } = req.query;

        if (!q && !specialization) {
            return res.status(400).json({ message: 'Vui lòng cung cấp từ khóa tìm kiếm (q) hoặc chuyên môn (specialization)' });
        }

        const experts = await searchModel.searchExperts(q, specialization);

        res.json({
            success: true,
            count: experts.length,
            experts
        });
    } catch (error) {
        console.error('Lỗi tìm kiếm chuyên gia:', error);
        res.status(500).json({ message: 'Lỗi server khi tìm kiếm' });
    }
};

// Tìm kiếm bài tập
const searchExercises = async (req, res) => {
    try {
        const { q, category_id, difficulty } = req.query;

        const exercises = await searchModel.searchExercises(q, category_id, difficulty);

        res.json({
            success: true,
            count: exercises.length,
            exercises
        });
    } catch (error) {
        console.error('Lỗi tìm kiếm bài tập:', error);
        res.status(500).json({ message: 'Lỗi server khi tìm kiếm' });
    }
};

// Lọc lịch hẹn
const filterAppointments = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const role = req.user.role;
        const { status, start_date, end_date } = req.query;

        const appointments = await searchModel.filterAppointments(
            userId,
            role,
            status,
            start_date,
            end_date
        );

        res.json({
            success: true,
            count: appointments.length,
            appointments
        });
    } catch (error) {
        console.error('Lỗi lọc lịch hẹn:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Lọc nhật ký cảm xúc
const filterEmotionLogs = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { emotion, start_date, end_date } = req.query;

        const logs = await searchModel.filterEmotionLogs(
            userId,
            emotion,
            start_date,
            end_date
        );

        res.json({
            success: true,
            count: logs.length,
            logs
        });
    } catch (error) {
        console.error('Lỗi lọc nhật ký cảm xúc:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Tìm kiếm toàn cục
const globalSearch = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({ message: 'Từ khóa tìm kiếm phải có ít nhất 2 ký tự' });
        }

        const results = await searchModel.globalSearch(q);

        const totalCount = results.experts.length + results.exercises.length + results.categories.length;

        res.json({
            success: true,
            totalCount,
            results
        });
    } catch (error) {
        console.error('Lỗi tìm kiếm toàn cục:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = {
    searchExperts,
    searchExercises,
    filterAppointments,
    filterEmotionLogs,
    globalSearch
};
