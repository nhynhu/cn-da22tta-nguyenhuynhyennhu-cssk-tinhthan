import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, ListGroup, Card, InputGroup, FormControl, Button } from 'react-bootstrap';
import './DoctorChat.css';

const API_BASE = 'http://localhost:5000';

// Trang chat dành riêng cho bác sĩ/chuyên gia
function DoctorChat() {
    const [partners, setPartners] = useState([]);
    const [selectedPeer, setSelectedPeer] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const bottomRef = useRef(null);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'user';
    const isExpert = role === 'expert' || role === 'doctor';

    // Auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load danh sách bệnh nhân
    useEffect(() => {
        const fetchPartners = async () => {
            if (!isExpert || !token) return;
            try {
                const res = await fetch(`${API_BASE}/api/doctor-chat/partners`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setPartners(data.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPartners();
    }, [isExpert, token]);

    // Load hội thoại
    const loadConversation = async (peer) => {
        if (!token) return;
        try {
            setSelectedPeer(peer);
            setMessages([]);
            const res = await fetch(`${API_BASE}/api/doctor-chat/messages/${peer.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setMessages(data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    // Gửi tin nhắn
    const handleSend = async () => {
        if (!newMessage.trim() || !selectedPeer || !token) return;

        const text = newMessage.trim();
        setNewMessage('');

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                message: text,
                sender_type: 'expert',
                created_at: new Date().toISOString(),
            },
        ]);

        try {
            await fetch(`${API_BASE}/api/doctor-chat/messages/${selectedPeer.id}`, {
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
        <Container fluid className="doctor-chat-page">
            <Row>
                {/* SIDEBAR */}
                <Col md={3} className="doctor-sidebar">
                    <h6 className="sidebar-title">Người dùng</h6>
                    <ListGroup>
                        {partners.map((p) => (
                            <ListGroup.Item
                                key={p.id}
                                action
                                active={selectedPeer && selectedPeer.id === p.id}
                                onClick={() => loadConversation(p)}
                            >
                                {p.name || p.full_name || p.email}
                            </ListGroup.Item>
                        ))}
                        {partners.length === 0 && (
                            <ListGroup.Item disabled>
                                Chưa có người dùng nào
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Col>

                {/* CHAT */}
                <Col md={9}>
                    <Card className="doctor-chat-card">
                        <Card.Header className="doctor-chat-header">
                            {selectedPeer
                                ? `Người dùng: ${selectedPeer.name || selectedPeer.full_name || selectedPeer.email}`
                                : 'Chọn người dùng để bắt đầu chat'}
                        </Card.Header>

                        <Card.Body className="doctor-chat-messages">
                            {messages.map((m, idx) => {
                                const isMe = m.sender_type !== 'user';
                                return (
                                    <div
                                        key={m.id || idx}
                                        className={`doctor-message-row ${isMe ? 'me' : 'peer'}`}
                                    >
                                        <div className={`doctor-message-bubble ${isMe ? 'bubble-me' : 'bubble-peer'}`}>
                                            {m.message}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={bottomRef} />
                        </Card.Body>

                        <Card.Footer className="doctor-chat-footer">
                            <InputGroup>
                                <FormControl
                                    placeholder="Nhập tin nhắn..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <Button onClick={handleSend} disabled={!selectedPeer}>
                                    Gửi
                                </Button>
                            </InputGroup>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default DoctorChat;
