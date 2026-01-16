const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const path = require('path');
const db = require('../config/db');
const MindCategory = require('../models/mindCategoryModel');
const aiService = require('../services/aiService');
const { encrypt, decrypt } = require('../utils/encryption');

// Cấu hình Dialogflow
const KEY_FILE = path.join(__dirname, '../dialogflow-key.json');
const keyData = require(KEY_FILE);
const PROJECT_ID = keyData.project_id;
const sessionClient = new dialogflow.SessionsClient({ keyFilename: KEY_FILE });

exports.sendMessageToBot = async (req, res) => {
    try {
        const { message, userId } = req.body;
        console.log(`\n📨 Nhận tin nhắn: "${message}" từ user ${userId}`);

        // --- GỌI SONG SONG AI SERVICE VÀ DIALOGFLOW ---
        const sessionId = userId || uuid.v4();
        const sessionPath = sessionClient.projectAgentSessionPath(PROJECT_ID, sessionId);
        
        const [aiResult, dialogflowResult] = await Promise.allSettled([
            // Gọi AI Service để phân tích cảm xúc
            aiService.analyzeEmotion(message),
            
            // Gọi Dialogflow để xử lý intent
            sessionClient.detectIntent({
                session: sessionPath,
                queryInput: { text: { text: message, languageCode: 'vi-VN' } },
            })
        ]);

        // --- XỬ LÝ KẾT QUẢ AI SERVICE ---
        let detectedEmotion = 'neutral';
        let aiScore = 0;
        let aiDetails = null;
        
        if (aiResult.status === 'fulfilled' && aiResult.value.success) {
            detectedEmotion = aiResult.value.emotion;
            aiScore = aiResult.value.score;
            aiDetails = aiResult.value.details;
            console.log(`  ✅ AI Service: ${detectedEmotion} (${(aiScore * 100).toFixed(1)}%)`);
        } else {
            console.log(`  ⚠️  AI Service thất bại, dùng fallback từ khóa`);
            
            // Fallback: Phát hiện cảm xúc từ từ khóa
            const messageLower = message.toLowerCase();
            if (messageLower.includes('buồn') || messageLower.includes('tủi thân') || messageLower.includes('chán')) {
                detectedEmotion = 'sad';
            } else if (messageLower.includes('tức') || messageLower.includes('giận') || messageLower.includes('bực')) {
                detectedEmotion = 'angry';
            } else if (messageLower.includes('lo lắng') || messageLower.includes('sợ') || messageLower.includes('lo âu')) {
                detectedEmotion = 'fear';
            } else if (messageLower.includes('vui') || messageLower.includes('hạnh phúc') || messageLower.includes('vui vẻ')) {
                detectedEmotion = 'happy';
            }
            console.log(`  🔍 Phát hiện từ từ khóa: ${detectedEmotion}`);
        }

        // --- XỬ LÝ KẾT QUẢ DIALOGFLOW ---
        let botReply = 'Xin lỗi, tôi đang gặp sự cố. Hãy thử lại sau.';
        let intentName = 'Default Fallback Intent';
        let confidence = 0;
        
        if (dialogflowResult.status === 'fulfilled') {
            const result = dialogflowResult.value[0].queryResult;
            botReply = result.fulfillmentText;
            intentName = result.intent.displayName;
            confidence = result.intentDetectionConfidence || 0;
            console.log(`  ✅ Dialogflow: ${intentName} (${(confidence * 100).toFixed(1)}%)`);
        } else {
            console.log(`  ⚠️  Dialogflow thất bại, dùng reply mặc định`);
            
            // Nếu Dialogflow lỗi, dùng reply mặc định dựa vào emotion
            const defaultReplies = {
                'sad': 'Tôi hiểu bạn đang buồn. Hãy thử làm bài tập thiền để cải thiện tâm trạng nhé.',
                'angry': 'Tôi thấy bạn đang tức giận. Hãy thử kỹ thuật hô hấp để bình tĩnh lại.',
                'fear': 'Đừng lo lắng. Hãy thử bài tập thư giãn để giảm căng thẳng.',
                'happy': 'Thật tuyệt! Hãy duy trì năng lượng tích cực này nhé.',
                'neutral': 'Chào bạn! Tôi ở đây để hỗ trợ bạn.'
            };
            botReply = defaultReplies[detectedEmotion] || botReply;
        }

        // --- BƯỚC 3: LƯU DATABASE (MÃ HÓA) ---

        if (message && userId) {
            // Mã hóa tin nhắn trước khi lưu
            const encryptedUserMessage = encrypt(message);
            const encryptedBotReply = encrypt(botReply);
            
            const sql = "INSERT INTO chat_logs (user_id, user_message, bot_reply, intent, emotion, created_at) VALUES (?, ?, ?, ?, ?, NOW())";

            db.query(sql, [userId, encryptedUserMessage, encryptedBotReply, intentName, detectedEmotion], (err, results) => {
                if (err) {
                    console.error(" LỖI LƯU DB:", err.sqlMessage || err.message);
                } else {
                    console.log(" ĐÃ LƯU THÀNH CÔNG! ID:", results.insertId);
                }
            });
        } else {
            console.log(" Không lưu DB: tin nhắn rỗng hoặc không có userId");
        }

        // --- BƯỚC 4: GỢI Ý DANH MỤC BÀI TẬP THEO CẢM XÚC TỪ AI SERVICE ---
        let suggestedCategories = [];
        try {
            // Lấy trực tiếp danh mục có intent = emotion từ AI service
            suggestedCategories = await MindCategory.getByIntent(detectedEmotion);
            console.log(`  💡 Gợi ý cho cảm xúc "${detectedEmotion}": ${suggestedCategories.length} danh mục`);
        } catch (catErr) {
            console.warn('  ⚠️  Lỗi lấy danh mục gợi ý:', catErr.message);
        }

        // --- TRẢ KẾT QUẢ ---
        res.json({
            reply: botReply,
            intent: intentName,
            intentConfidence: confidence,
            emotion: detectedEmotion,
            emotionScore: aiScore,
            aiDetails: aiDetails,
            suggestedCategories
        });

    } catch (error) {
        console.error(" LỖI TOÀN CỤC (CRASH):", error);
        res.status(500).send('Lỗi xử lý server');
    }
};

// Lấy lịch sử chat của user
exports.getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'Thiếu userId' });
        }

        const sql = `
            SELECT user_message, bot_reply, intent, emotion, created_at 
            FROM chat_logs 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 50
        `;

        db.query(sql, [userId], (err, rows) => {
            if (err) {
                console.error('Lỗi lấy lịch sử chat:', err);
                return res.status(500).json({ message: 'Lỗi server' });
            }
            
            // Giải mã tin nhắn trước khi trả về
            const decryptedRows = rows.map(row => ({
                ...row,
                user_message: decrypt(row.user_message),
                bot_reply: decrypt(row.bot_reply)
            }));
            
            res.json({ history: decryptedRows });
        });
    } catch (error) {
        console.error('Lỗi getChatHistory:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Lấy thống kê cảm xúc của user
exports.getEmotionStats = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'Thiếu userId' });
        }

        const sql = `
            SELECT emotion, COUNT(*) as count 
            FROM chat_logs 
            WHERE user_id = ? AND emotion IS NOT NULL AND emotion != ''
            GROUP BY emotion
        `;

        db.query(sql, [userId], (err, rows) => {
            if (err) {
                console.error('Lỗi lấy thống kê:', err);
                return res.status(500).json({ message: 'Lỗi server' });
            }

            // Chuyển đổi thành object { emotion: count }
            const stats = {};
            rows.forEach(row => {
                stats[row.emotion] = row.count;
            });

            res.json({ stats });
        });
    } catch (error) {
        console.error('Lỗi getEmotionStats:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};