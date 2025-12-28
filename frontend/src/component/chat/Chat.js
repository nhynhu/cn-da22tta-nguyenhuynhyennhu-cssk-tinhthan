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
                            <div className="chat-card-header">
                                <span className="chat-title">Phòng Chat</span>
                                <small className="text-muted">Trò chuyện cùng AI</small>
                            </div>

                            <div className="chat-messages">
                                {messages.map(msg => {
                                    const isMe = msg.sender === "me";
                                    return (
                                        <div key={msg.id} className={`message-row ${isMe ? 'message-right' : 'message-left'}`}>
                                            <div className={`message-bubble ${isMe ? 'bubble-user' : 'bubble-bot'}`}>
                                                <div>{msg.text}</div>
                                                <div className="message-time">
                                                    {msg.time && formatTime(msg.time)}
                                                </div>
                                            </div>
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
                                    <Button className="chat-send-btn" onClick={handleSend}>Gửi</Button>
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
