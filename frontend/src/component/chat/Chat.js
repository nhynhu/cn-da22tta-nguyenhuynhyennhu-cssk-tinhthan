import React, { useState, useRef, useEffect } from 'react';
import { Container, InputGroup, FormControl, Button, Card } from 'react-bootstrap';


const Chat = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Chào bạn!', sender: 'other' },
        { id: 2, text: 'Chào, mình có thể giúp gì cho bạn?', sender: 'me' },
    ]);

    const [newMessage, setNewMessage] = useState('');

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const handleSend = () => {
        if (newMessage.trim() === '') return;

        const newMsg = {
            id: messages.length + 1,
            text: newMessage,
            sender: 'me',
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');

        setTimeout(() => {
            setMessages(prevMessages => [
                ...prevMessages,
                { id: prevMessages.length + 1, text: 'Bot đang trả lời...', sender: 'other' }
            ]);
        }, 1000);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <Container className="my-4" style={{ maxWidth: '700px' }}>
            <Card>
                <Card.Header as="h5">Phòng Chat</Card.Header>
                <Card.Body
                    style={{
                        height: '400px',
                        overflowY: 'auto',
                        backgroundColor: '#f8f9fa'
                    }}
                >
                    {/* Hiển thị các tin nhắn */}
                    {messages.map((msg) => {
                        const isMe = msg.sender === 'me';

                        const alignClass = isMe ? 'justify-content-end' : 'justify-content-start';

                        const bgClass = isMe ? 'bg-primary text-white' : 'bg-light text-dark';

                        return (
                            <div key={msg.id} className={`d-flex ${alignClass} mb-2`}>

                                {/* 2. Đây là bong bóng chat
                                     Dùng các lớp tiện ích của Bootstrap:
                                     - p-2: padding
                                     - rounded: bo góc
                                     - mw-75: max-width 75%
                                */}
                                <div className={`p-2 rounded mw-75 ${bgClass}`}
                                    style={{ wordWrap: 'break-word' }}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })}
                    {/* Div trống để cuộn */}
                    <div ref={messagesEndRef} />
                </Card.Body>
                <Card.Footer>
                    {/* Ô nhập liệu và nút gửi */}
                    <InputGroup>
                        <FormControl
                            placeholder="Nhập tin nhắn..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <Button variant="primary" onClick={handleSend}>
                            Gửi
                        </Button>
                    </InputGroup>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default Chat;