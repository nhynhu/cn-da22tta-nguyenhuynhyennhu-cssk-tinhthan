import React, { useState, useRef, useEffect } from 'react';
import { Container, InputGroup, FormControl, Button, Card } from 'react-bootstrap';

const Chat = () => {
    const API_URL = "http://localhost:5000/api/chat";

    const [messages, setMessages] = useState([
        { id: 1, text: 'Chào bạn!', sender: 'bot' },
    ]);

    const [newMessage, setNewMessage] = useState('');
    const [loadingBot, setLoadingBot] = useState(false);

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
            // 3. Gọi API backend
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: myText })
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
        } catch (error) {
            // Lỗi backend
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: "❌ Lỗi kết nối đến server",
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
