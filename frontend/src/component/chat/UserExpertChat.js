import React, { useEffect, useState, useRef } from 'react';
import { Container, Card, InputGroup, FormControl, Button } from 'react-bootstrap';
import { useParams, useLocation } from 'react-router-dom';
import './UserExpertChat.css';

const API_BASE = 'http://localhost:5000';

// Trang chat dành riêng cho user trò chuyện với chuyên gia
function UserExpertChat() {
    const [expert, setExpert] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const bottomRef = useRef(null);

    const token = localStorage.getItem('token');
    const { expertId } = useParams();
    const location = useLocation();

    // Auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load expert + conversation
    useEffect(() => {
        const init = async () => {
            if (!token) return;

            try {
                let chosenExpert = location.state?.expert || null;

                const res = await fetch(`${API_BASE}/api/experts`);
                const data = await res.json();
                const list = data.data || [];

                if (!chosenExpert) {
                    if (expertId) {
                        chosenExpert = list.find(e => String(e.id) === String(expertId)) || null;
                    } else if (list.length > 0) {
                        chosenExpert = list[0];
                    }
                }

                if (chosenExpert) {
                    setExpert(chosenExpert);
                    await loadConversation(chosenExpert);
                }
            } catch (err) {
                console.error(err);
            }
        };

        init();
        // eslint-disable-next-line
    }, [token, expertId, location.state]);

    const loadConversation = async (peer) => {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE}/api/doctor-chat/messages/${peer.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setMessages(data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !expert || !token) return;

        const text = newMessage.trim();
        setNewMessage('');

        setMessages(prev => [
            ...prev,
            {
                id: Date.now(),
                message: text,
                sender_type: 'user',
                created_at: new Date().toISOString(),
            },
        ]);

        try {
            await fetch(`${API_BASE}/api/doctor-chat/messages/${expert.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ message: text }),
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <Container className="user-expert-chat-page">
            <Card className="user-expert-chat-card">
                <Card.Header className="user-expert-chat-header">
                    {expert
                        ? `Chuyên gia: ${expert.name || expert.full_name || expert.email}`
                        : 'Đang tải thông tin chuyên gia...'}
                </Card.Header>

                <Card.Body className="user-expert-chat-messages">
                    {messages.map((m, idx) => {
                        const isMe = m.sender_type === 'user';
                        return (
                            <div
                                key={m.id || idx}
                                className={`ue-message-row ${isMe ? 'me' : 'peer'}`}
                            >
                                <div className={`ue-message-bubble ${isMe ? 'bubble-me' : 'bubble-peer'}`}>
                                    {m.message}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </Card.Body>

                <Card.Footer className="user-expert-chat-footer">
                    <InputGroup>
                        <FormControl
                            placeholder="Nhập tin nhắn..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={!expert}
                        />
                        <Button onClick={handleSend} disabled={!expert}>
                            Gửi
                        </Button>
                    </InputGroup>
                </Card.Footer>
            </Card>
        </Container>
    );
}

export default UserExpertChat;
