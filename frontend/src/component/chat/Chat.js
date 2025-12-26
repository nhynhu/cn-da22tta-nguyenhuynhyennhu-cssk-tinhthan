import React, { useState, useRef, useEffect } from 'react';
import { Container, InputGroup, FormControl, Button, Card, Badge, ListGroup, Row, Col, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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
        <Container fluid className="my-4">
            <Row>
                {/* THANH BÊN TRÁI - Lịch sử, thống kê, gợi ý */}
                <Col lg={3} className="d-none d-lg-block">
                    {/* Thống kê cảm xúc - Click để điều hướng */}
                    <Card className="mb-3 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => navigate('/analytic')}>
                        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                            <small className="fw-bold">📊 Thống kê cảm xúc</small>
                            <small>→</small>
                        </Card.Header>
                        <Card.Body className="text-center py-4">
                            <div className="mb-2" style={{ fontSize: '40px' }}>📈</div>
                            <div className="text-muted small">Xem thống kê chi tiết về cảm xúc của bạn</div>
                            <Button variant="outline-primary" size="sm" className="mt-2">
                                Xem thống kê
                            </Button>
                        </Card.Body>
                    </Card>

                    {/* Gợi ý bài tập */}
                    <Card className="mb-3 shadow-sm">
                        <Card.Header className="bg-success text-white">
                            <small className="fw-bold">💡 Gợi ý cho bạn</small>
                        </Card.Header>
                        <Card.Body style={{ maxHeight: '180px', overflowY: 'auto' }}>
                            {suggestedCategories.length === 0 ? (
                                <div className="text-center text-muted small">
                                    Hãy trò chuyện để nhận gợi ý phù hợp
                                </div>
                            ) : (
                                suggestedCategories.map(cat => (
                                    <div key={cat.category_id} className="mb-2 p-2 bg-light rounded">
                                        <Badge bg="info" className="mb-1">{cat.intent}</Badge>
                                        <div className="small fw-bold">{cat.category_name}</div>
                                        {cat.description && (
                                            <div className="text-muted" style={{ fontSize: '11px' }}>{cat.description}</div>
                                        )}
                                    </div>
                                ))
                            )}
                            <div className="text-center mt-2">
                                <a href="/therapy" className="small">Xem tất cả bài tập →</a>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Lịch sử trò chuyện */}
                    <Card className="shadow-sm">
                        <Card.Header className="bg-secondary text-white">
                            <small className="fw-bold">📜 Lịch sử gần đây</small>
                        </Card.Header>
                        <Card.Body style={{ maxHeight: '250px', overflowY: 'auto', padding: '0' }}>
                            {loadingHistory ? (
                                <div className="text-center text-muted p-3">Đang tải...</div>
                            ) : chatHistory.length === 0 ? (
                                <div className="text-center text-muted p-3 small">Chưa có lịch sử</div>
                            ) : (
                                <ListGroup variant="flush">
                                    {chatHistory.slice(0, 10).map((item, index) => (
                                        <ListGroup.Item key={index} className="py-2 px-2">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <Badge bg={emotionColors[item.emotion]?.bg || 'secondary'} style={{ fontSize: '10px' }}>
                                                    {emotionColors[item.emotion]?.icon} {item.emotion}
                                                </Badge>
                                                <small className="text-muted" style={{ fontSize: '10px' }}>
                                                    {formatDate(item.created_at)}
                                                </small>
                                            </div>
                                            <div className="small text-truncate" title={item.user_message}>
                                                <span className="text-primary">Bạn:</span> {item.user_message}
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* PHẦN CHÍNH - Phòng chat */}
                <Col lg={9}>
                    <Card className="shadow">
                        <Card.Header as="h5" className="d-flex justify-content-between align-items-center bg-white">
                            <span>💬 Phòng Chat</span>
                            <small className="text-muted">Trò chuyện cùng AI</small>
                        </Card.Header>

                        <Card.Body
                            style={{
                                height: "450px",
                                overflowY: "auto",
                                backgroundColor: "#f8f9fa"
                            }}
                        >
                            {/* Render tin nhắn */}
                            {messages.map(msg => {
                                const isMe = msg.sender === "me";
                                const align = isMe ? "justify-content-end" : "justify-content-start";
                                const bg = isMe ? "bg-primary text-white" : "bg-light text-dark";

                                return (
                                    <div key={msg.id} className={`d-flex ${align} mb-2`}>
                                        <div className={`p-2 rounded mw-75 ${bg}`} style={{ wordWrap: "break-word", maxWidth: "75%" }}>
                                            <div>{msg.text}</div>
                                            <div className={`text-end mt-1 ${isMe ? 'text-light' : 'text-muted'}`} style={{ fontSize: '10px' }}>
                                                {msg.time && formatTime(msg.time)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Bot typing */}
                            {loadingBot && (
                                <div className="d-flex justify-content-start mb-2">
                                    <div className="p-2 rounded mw-75 bg-light text-dark">
                                        Bot đang trả lời...
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </Card.Body>

                        <Card.Footer>
                            {/* Gợi ý danh mục bài tập theo cảm xúc/intent */}
                            {suggestedCategories.length > 0 && (
                                <div className="mb-3">
                                    <div className="fw-bold mb-1">Gợi ý cho bạn:</div>
                                    {suggestedCategories.map(cat => (
                                        <div key={cat.category_id} className="small mb-1">
                                            <Badge bg="info" className="me-2">{cat.intent}</Badge>
                                            <strong>{cat.category_name}</strong>
                                            {cat.description && (
                                                <span className="text-muted"> - {cat.description}</span>
                                            )}
                                        </div>
                                    ))}
                                    <div className="mt-1">
                                        <a href="/therapy">Xem các bài tập phù hợp &rarr;</a>
                                    </div>
                                </div>
                            )}

                            <InputGroup>
                                <FormControl
                                    placeholder="Nhập tin nhắn..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <Button variant="primary" onClick={handleSend}>Gửi</Button>
                            </InputGroup>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Chat;
