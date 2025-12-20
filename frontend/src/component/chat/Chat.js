import React, { useState, useRef, useEffect } from 'react';
import { Container, InputGroup, FormControl, Button, Card, Badge } from 'react-bootstrap';

const Chat = () => {
    const API_URL = "http://localhost:5000/api/chat";

    const [messages, setMessages] = useState([
        { id: 1, text: 'Chào bạn, hôm nay của bạn thế nào?', sender: 'bot' },
    ]);

    const [newMessage, setNewMessage] = useState('');
    const [loadingBot, setLoadingBot] = useState(false);
    const [suggestedCategories, setSuggestedCategories] = useState([]);

    const messagesEndRef = useRef(null);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Gửi tin nhắn
    const handleSend = async () => {
        if (newMessage.trim() === '') return;

        const myText = newMessage;
        setNewMessage('');

        // 1. Thêm tin nhắn user vào UI
        const myMsg = {
            id: Date.now(),
            text: myText,
            sender: "me"
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
                    sender: "bot"
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
                    sender: "bot"
                }
            ]);
        }

        setLoadingBot(false);
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") handleSend();
    };

    return (
        <Container className="my-4" style={{ maxWidth: "700px" }}>
            <Card>
                <Card.Header as="h5">Phòng Chat</Card.Header>

                <Card.Body
                    style={{
                        height: "400px",
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
                                <div className={`p-2 rounded mw-75 ${bg}`} style={{ wordWrap: "break-word" }}>
                                    {msg.text}
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
        </Container>
    );
};

export default Chat;
