const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const aiService = {
    /**
     * Phân tích cảm xúc từ text tiếng Việt
     * @param {string} text - Text cần phân tích
     * @returns {Promise<Object>} - { top_emotion, score, original, translated, details }
     */
    analyzeEmotion: async (text) => {
        try {
            const response = await axios.post(`${AI_SERVICE_URL}/analyze-emotion`, {
                text: text
            }, {
                timeout: 10000 // 10 seconds timeout
            });

            return {
                success: true,
                emotion: response.data.top_emotion,
                score: response.data.score,
                original: response.data.original,
                translated: response.data.translated,
                details: response.data.details
            };
        } catch (error) {
            console.error('[AI Service] Error analyzing emotion:', error.message);
            return {
                success: false,
                emotion: 'neutral', // fallback
                score: 0,
                error: error.message
            };
        }
    },

    /**
     * Kiểm tra AI service có hoạt động không
     * @returns {Promise<boolean>}
     */
    healthCheck: async () => {
        try {
            await axios.get(`${AI_SERVICE_URL}/`, { timeout: 5000 });
            return true;
        } catch (error) {
            console.error('[AI Service] Health check failed:', error.message);
            return false;
        }
    }
};

module.exports = aiService;
