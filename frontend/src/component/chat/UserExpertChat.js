import React, { useEffect, useState, useRef } from 'react';
import { Container, Card, InputGroup, FormControl, Button, Alert } from 'react-bootstrap';
import { useParams, useLocation } from 'react-router-dom';

const API_BASE = 'http://localhost:5000';

// Trang chat dành riêng cho user trò chuyện với chuyên gia
function UserExpertChat() {
    const [expert, setExpert] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const bottomRef = useRef(null);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'user';

    const { expertId } = useParams();
    const location = useLocation();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Xác định chuyên gia từ state hoặc từ API, sau đó tải hội thoại
    useEffect(() => {
        const init = async () => {
            if (!token) return;

            try {
                // Ưu tiên chuyên gia truyền qua state (từ ExpertList)
                let chosenExpert = location.state?.expert || null;

                // Luôn tải danh sách chuyên gia để có thể chọn theo id hoặc chọn mặc định
                const res = await fetch(`${API_BASE}/api/experts`);
                const data = await res.json();
                const list = data.data || [];

                if (!chosenExpert) {
                    // Nếu có expertId trên URL thì chọn đúng chuyên gia đó
                    if (expertId) {
                        chosenExpert = list.find((e) => String(e.id) === String(expertId)) || null;
                    } else if (list.length > 0) {
                        // Nếu không có expertId và không có state, chọn chuyên gia đầu tiên
                        chosenExpert = list[0];
                    }
                }

                if (chosenExpert) {
                    setExpert(chosenExpert);
                    await loadConversation(chosenExpert);
                }
            } catch (err) {
                console.error('Lỗi tải danh sách chuyên gia:', err);
            }
        };

        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            console.error('Lỗi tải tin nhắn:', err);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !expert || !token) return;

        const text = newMessage.trim();
        setNewMessage('');

        // Optimistic UI
        setMessages((prev) => [
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
            console.error('Lỗi gửi tin nhắn:', err);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <Container className="my-4">
            <Card style={{ height: '500px' }}>
                <Card.Header>
                    {expert
                        ? `Chuyên gia: ${expert.name || expert.full_name || expert.email}`
                        : 'Đang tải thông tin chuyên gia...'}
                </Card.Header>
                <Card.Body style={{ overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                    {messages.map((m, idx) => {
                        const isMe = m.sender_type === 'user';
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
                            disabled={!expert}
                        />
                        <Button variant="primary" onClick={handleSend} disabled={!expert}>
                            Gửi
                        </Button>
                    </InputGroup>
                </Card.Footer>
            </Card>
        </Container>
    );
}

export default UserExpertChat;
