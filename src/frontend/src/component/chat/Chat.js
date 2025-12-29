import React, { useState, useRef, useEffect } from 'react';
import { Container, InputGroup, FormControl, Button, Card, Badge, ListGroup, Row, Col, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

const Chat = () => {
    const navigate = useNavigate();
    const API_URL = "http://localhost:5000/api/chat";
    const HISTORY_API_URL = "http://localhost:5000/api/chat/history";
    const STATS_API_URL = "http://localhost:5000/api/chat/stats";

    const [messages, setMessages] = useState([
        { id: 1, text: 'Chào bạn, hôm nay của bạn thế nào?', sender: 'bot', time: new Date() },
    ]);

    const [newMessage, setNewMessage] = useState('');
    const [loadingBot, setLoadingBot] = useState(false);
    const [suggestedCategories, setSuggestedCategories] = useState([]);

    // Lịch sử chat & thống kê
    const [chatHistory, setChatHistory] = useState([]);
    const [emotionStats, setEmotionStats] = useState({});
    const [loadingHistory, setLoadingHistory] = useState(false);

    const messagesEndRef = useRef(null);

    // Format thời gian
    const formatTime = (date) => {
        const d = new Date(date);
        return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Load lịch sử và thống kê khi component mount
    useEffect(() => {
        loadChatHistory();
        loadEmotionStats();
    }, []);

    // Load lịch sử chat
    const loadChatHistory = async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) return;

        setLoadingHistory(true);
        try {
            const res = await fetch(`${HISTORY_API_URL}/${user.id}`);
            const data = await res.json();
            setChatHistory(data.history || []);
        } catch (error) {
            console.error('Lỗi tải lịch sử:', error);
        }
        setLoadingHistory(false);
    };

    // Load thống kê cảm xúc
    const loadEmotionStats = async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) return;

        try {
            const res = await fetch(`${STATS_API_URL}/${user.id}`);
            const data = await res.json();
            setEmotionStats(data.stats || {});
        } catch (error) {
            console.error('Lỗi tải thống kê:', error);
        }
    };

    // Tính phần trăm cảm xúc
    const getEmotionPercent = (emotion) => {
        const total = Object.values(emotionStats).reduce((a, b) => a + b, 0);
        if (total === 0) return 0;
        return Math.round((emotionStats[emotion] || 0) / total * 100);
    };

    // Màu sắc cho từng cảm xúc
    const emotionColors = {
        happy: { bg: 'success', icon: '😊', label: 'Vui vẻ' },
        sad: { bg: 'warning', icon: '😢', label: 'Buồn' },
        angry: { bg: 'danger', icon: '😠', label: 'Tức giận' },
        fear: { bg: 'info', icon: '😨', label: 'Lo lắng' },
        neutral: { bg: 'secondary', icon: '😐', label: 'Bình thường' },
        surprise: { bg: 'primary', icon: '😮', label: 'Ngạc nhiên' }
    };

    // Gửi tin nhắn
    const handleSend = async () => {
        if (newMessage.trim() === '') return;

        const myText = newMessage;
        const currentTime = new Date();
        setNewMessage('');

        // 1. Thêm tin nhắn user vào UI
        const myMsg = {
            id: Date.now(),
            text: myText,
            sender: "me",
            time: currentTime
        };
        setMessages(prev => [...prev, myMsg]);

        // 2. Hiện trạng thái bot đang trả lời
        setLoadingBot(true);

        try {
            // 3. Lấy userId từ localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.id || 1; // Fallback to 1 if not logged in

            // 4. Gọi API backend
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: myText, userId: userId })
            });

            const data = await res.json();

            // 4. Thêm tin nhắn bot
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: data.reply || "Bot không trả lời",
                    sender: "bot",
                    time: new Date()
                }
            ]);

            // 5. Lưu gợi ý danh mục theo intent/emotion (nếu có)
            setSuggestedCategories(data.suggestedCategories || []);
        } catch (error) {
            // Lỗi backend
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: "Lỗi kết nối đến server :((",
                    sender: "bot",
                    time: new Date()
                }
            ]);
        }

        setLoadingBot(false);
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") handleSend();
    };

    return (
        <div className="chat-page">
            <Container fluid className="py-4">
                <Row>
                    {/* THANH BÊN TRÁI */}
                    <Col lg={3} className="d-none d-lg-block">
                        {/* Thống kê cảm xúc */}
                        <div className="sidebar-card">
                            <div className="sidebar-header sidebar-header-primary">
                                <span>Thống kê cảm xúc</span>
                            </div>

                            <div className="sidebar-body" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                                {Object.keys(emotionStats).length === 0 ? (
                                    <div className="text-center text-muted small">
                                        Chưa có dữ liệu cảm xúc
                                    </div>
                                ) : (
                                    Object.keys(emotionStats).map((emotion) => (
                                        <div key={emotion} className="suggest-item">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-bold small">
                                                    {emotionColors[emotion]?.icon} {emotionColors[emotion]?.label}
                                                </span>
                                                <span className="small text-muted">
                                                    {getEmotionPercent(emotion)}%
                                                </span>
                                            </div>
                                            <ProgressBar
                                                now={getEmotionPercent(emotion)}
                                                variant={emotionColors[emotion]?.bg}
                                                style={{ height: '6px', marginTop: '6px' }}
                                            />
                                        </div>
                                    ))
                                )}

                                <div className="text-center mt-2">
                                    <a
                                        href="/analytic"
                                        className="link-purple"
                                    >
                                        Xem thống kê chi tiết →
                                    </a>
                                </div>
                            </div>
                        </div>


                        {/* Gợi ý bài tập */}
                        <div className="sidebar-card">
                            <div className="sidebar-header sidebar-header-secondary">
                                <span>Gợi ý cho bạn</span>
                            </div>
                            <div className="sidebar-body" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                                {suggestedCategories.length === 0 ? (
                                    <div className="text-center text-muted small">
                                        Hãy trò chuyện để nhận gợi ý phù hợp
                                    </div>
                                ) : (
                                    suggestedCategories.map(cat => (
                                        <div key={cat.category_id} className="suggest-item">
                                            <Badge bg="info" className="mb-1">{cat.intent}</Badge>
                                            <div className="small fw-bold">{cat.category_name}</div>
                                            {cat.description && (
                                                <div className="text-muted" style={{ fontSize: '11px' }}>{cat.description}</div>
                                            )}
                                        </div>
                                    ))
                                )}
                                <div className="text-center mt-2">
                                    <a href="/therapy" className="link-purple">Xem tất cả bài tập →</a>
                                </div>
                            </div>
                        </div>

                        {/* Lịch sử trò chuyện */}
                        <div className="sidebar-card">
                            <div className="sidebar-header sidebar-header-light">
                                <span>Lịch sử gần đây</span>
                            </div>
                            <div className="sidebar-body p-0" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                {loadingHistory ? (
                                    <div className="text-center text-muted p-3">Đang tải...</div>
                                ) : chatHistory.length === 0 ? (
                                    <div className="text-center text-muted p-3 small">Chưa có lịch sử</div>
                                ) : (
                                    <div className="history-list">
                                        {chatHistory.slice(0, 10).map((item, index) => (
                                            <div key={index} className="history-item">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <Badge bg={emotionColors[item.emotion]?.bg || 'secondary'} style={{ fontSize: '10px' }}>
                                                        {item.emotion}
                                                    </Badge>
                                                    <small className="text-muted" style={{ fontSize: '10px' }}>
                                                        {formatDate(item.created_at)}
                                                    </small>
                                                </div>
                                                <div className="small text-truncate" title={item.user_message}>
                                                    <span className="text-purple">Bạn:</span> {item.user_message}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>

                    {/* PHẦN CHÍNH - Phòng chat */}
                    <Col lg={9}>
                        <div className="chat-card">
                            <div className="chat-card-header" style={{ display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #a571e1 0%, #c9a8f0 100%)', color: '#fff', borderRadius: '18px 18px 0 0', boxShadow: '0 4px 16px rgba(165,113,225,0.10)' }}>
                                <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="AI Avatar" style={{ width: 38, height: 38, borderRadius: '50%', marginRight: 16, border: '2px solid #fff', background: '#fff' }} />
                                <div style={{ flex: 1 }}>
                                    <span className="chat-title" style={{ fontWeight: 700, fontSize: '1.2rem' }}>Phòng Chat AI</span>
                                    <div style={{ fontSize: 13, color: '#e0e0e0' }}>Trò chuyện cùng AI hỗ trợ tâm lý</div>
                                </div>
                            </div>

                            <div className="chat-messages">
                                {messages.map(msg => {
                                    const isMe = msg.sender === "me";
                                    return (
                                        <div key={msg.id} className={`message-row ${isMe ? 'message-right' : 'message-left'}`} style={{ alignItems: 'flex-end' }}>
                                            {!isMe && (
                                                <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="Bot" style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8, border: '1.5px solid #a571e1', background: '#fff' }} />
                                            )}
                                            <div className={`message-bubble ${isMe ? 'bubble-user' : 'bubble-bot'}`} style={isMe ? {
                                                background: 'linear-gradient(135deg, #a571e1 0%, #c9a8f0 100%)', color: '#fff', borderRadius: '18px 18px 6px 18px', boxShadow: '0 2px 8px rgba(165,113,225,0.13)'
                                            } : {
                                                background: 'linear-gradient(135deg, #c9a8f0 0%, #a571e1 100%)', color: '#fff', border: '1px solid #a571e1', borderRadius: '18px 18px 18px 6px', boxShadow: '0 2px 8px rgba(165,113,225,0.10)'
                                            }}>
                                                <div>{msg.text}</div>
                                                <div className="message-time">
                                                    {msg.time && formatTime(msg.time)}
                                                </div>
                                            </div>
                                            {isMe && (
                                                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="User" style={{ width: 32, height: 32, borderRadius: '50%', marginLeft: 8, border: '1.5px solid #a571e1', background: '#fff' }} />
                                            )}
                                        </div>
                                    );
                                })}

                                {loadingBot && (
                                    <div className="message-row message-left">
                                        <div className="message-bubble bubble-bot">
                                            <em className="text-muted">Đang trả lời...</em>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            <div className="chat-card-footer">
                                {suggestedCategories.length > 0 && (
                                    <div className="chat-suggest-box">
                                        <div className="fw-bold mb-2 small">Gợi ý cho bạn:</div>
                                        {suggestedCategories.map(cat => (
                                            <div key={cat.category_id} className="small mb-1">
                                                <strong>{cat.category_name}</strong>
                                                {cat.description && (
                                                    <span className="text-muted"> - {cat.description}</span>
                                                )}
                                            </div>
                                        ))}
                                        <a href="/therapy" className="link-purple small">Xem các bài tập phù hợp →</a>
                                    </div>
                                )}

                                <div className="chat-input-row">
                                    <FormControl
                                        className="chat-input"
                                        placeholder="Nhập tin nhắn..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <Button className="chat-send-btn" style={{ fontWeight: 700, fontSize: 17, borderRadius: 8, padding: '9px 22px', display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #a571e1 0%, #c9a8f0 100%)', color: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(165,113,225,0.10)' }} onClick={handleSend}>
                                        <span>Gửi</span>
                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Chat;
