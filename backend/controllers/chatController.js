const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const path = require('path');
const db = require('../config/db');
const axios = require('axios');
const MindCategory = require('../models/mindCategoryModel');

// Cấu hình Dialogflow
const KEY_FILE = path.join(__dirname, '../dialogflow-key.json');
const keyData = require(KEY_FILE);
const PROJECT_ID = keyData.project_id;
const sessionClient = new dialogflow.SessionsClient({ keyFilename: KEY_FILE });

exports.sendMessageToBot = async (req, res) => {
    try {
        const { message, userId } = req.body;

        // --- BƯỚC 1: GỌI PYTHON AI ---
        let detectedEmotion = 'neutral';
        try {
            const pythonResponse = await axios.post('http://localhost:8000/analyze-emotion', { text: message });
            detectedEmotion = pythonResponse.data.top_emotion;
            console.log(`  AI Phân tích: ${detectedEmotion}`);
        } catch (aiError) {
            console.log(`  Lỗi AI (vẫn chạy tiếp): ${aiError.message}`);
        }

        // --- BƯỚC 2: GỌI DIALOGFLOW ---
        const sessionId = userId || uuid.v4();
        const sessionPath = sessionClient.projectAgentSessionPath(PROJECT_ID, sessionId);
        const request = {
            session: sessionPath,
            queryInput: { text: { text: message, languageCode: 'vi-VN' } },
        };

        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        const botReply = result.fulfillmentText;
        const intentName = result.intent.displayName;

        // --- BƯỚC 3: LƯU DATABASE ---

        if (message && userId) {
            const sql = "INSERT INTO chat_logs (user_id, user_message, bot_reply, intent, emotion, created_at) VALUES (?, ?, ?, ?, ?, NOW())";

            db.query(sql, [userId, message, botReply, intentName, detectedEmotion], (err, results) => {
                if (err) {
                    console.error(" LỖI LƯU DB:", err.sqlMessage || err.message);
                } else {
                    console.log(" ĐÃ LƯU THÀNH CÔNG! ID:", results.insertId);
                }
            });
        } else {
            console.log(" Không lưu DB: tin nhắn rỗng hoặc không có userId");
        }

        // --- BƯỚC 4: GỢI Ý DANH MỤC BÀI TẬP THEO EMOTION/INTENT ---
        let suggestedCategories = [];
        try {
            if (detectedEmotion) {
                suggestedCategories = await MindCategory.getByIntent(detectedEmotion);
            }
        } catch (catErr) {
            console.warn('Không lấy được danh mục gợi ý:', catErr.message);
        }

        // --- TRẢ KẾT QUẢ ---
        res.json({
            reply: botReply,
            intent: intentName,
            emotion: detectedEmotion,
            suggestedCategories
        });

    } catch (error) {
        console.error(" LỖI TOÀN CỤC (CRASH):", error);
        res.status(500).send('Lỗi xử lý server');
    }
};