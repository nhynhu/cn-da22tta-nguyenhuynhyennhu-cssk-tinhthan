import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, ListGroup, Card, InputGroup, FormControl, Button, Alert } from 'react-bootstrap';

const API_BASE = 'http://localhost:5000';

// Trang chat dành riêng cho bác sĩ/chuyên gia trò chuyện với bệnh nhân
function DoctorChat() {
    const [partners, setPartners] = useState([]); // danh sách bệnh nhân
    const [selectedPeer, setSelectedPeer] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const bottomRef = useRef(null);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'user';

    // Cho phép cả role 'doctor' và 'expert' sử dụng trang này
    const isExpert = role === 'expert' || role === 'doctor';

    // Auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load danh sách bệnh nhân đã chat với bác sĩ/chuyên gia hiện tại
    useEffect(() => {
        const fetchPartners = async () => {
            try {
                if (!isExpert || !token) return;
                const res = await fetch(`${API_BASE}/api/doctor-chat/partners`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setPartners(data.data || []);
            } catch (err) {
                console.error('Lỗi tải danh sách bệnh nhân:', err);
            }
        };

        fetchPartners();
    }, [isExpert, token]);

    // Tải hội thoại với 1 bệnh nhân
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
            console.error('Lỗi tải tin nhắn:', err);
        }
    };

    // Gửi tin nhắn
    const handleSend = async () => {
        if (!newMessage.trim() || !selectedPeer || !token) return;

        const text = newMessage.trim();
        setNewMessage('');

        // Optimistic UI
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
            console.error('Lỗi gửi tin nhắn:', err);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };
    return (
        <Container fluid className="my-4">
            <Row>
                <Col md={3}>
                    <h5>Bệnh nhân</h5>
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
                            <ListGroup.Item disabled>Chưa có bệnh nhân nào trò chuyện.</ListGroup.Item>
                        )}
                    </ListGroup>
                </Col>

                <Col md={9}>
                    <Card style={{ height: '500px' }}>
                        <Card.Header>
                            {selectedPeer
                                ? `Bệnh nhân: ${selectedPeer.name || selectedPeer.full_name || selectedPeer.email}`
                                : 'Chọn bệnh nhân để bắt đầu chat'}
                        </Card.Header>
                        <Card.Body style={{ overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                            {messages.map((m, idx) => {
                                // Tin nhắn "của mình" là những tin không phải từ user (ENUM hiện tại: 'user' | 'doctor')
                                const isMe = m.sender_type !== 'user';
                                const align = isMe ? 'justify-content-end' : 'justify-content-start';
                                const bg = isMe ? 'bg-primary text-white' : 'bg-light text-dark';

                                return (
                                    <div key={m.id || idx} className={`d-flex ${align} mb-2`}>
                                        <div className={`p-2 rounded mw-75 ${bg}`} style={{ wordWrap: 'break-word' }}>
                                            {m.message}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={bottomRef} />
                        </Card.Body>
                        <Card.Footer>
                            <InputGroup>
                                <FormControl
                                    placeholder="Nhập tin nhắn..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <Button variant="primary" onClick={handleSend} disabled={!selectedPeer}>
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