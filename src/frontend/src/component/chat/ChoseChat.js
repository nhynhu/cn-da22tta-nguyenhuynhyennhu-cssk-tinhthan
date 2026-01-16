import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChoseChat = () => {
    // Dữ liệu hiển thị
    const options = [
        {
            img: "./img/chatAI.png",
            link: "/chat",
            title: "Trợ lý AI",
            description: "Trò chuyện với trợ lý ảo thông minh 24/7",
            btnText: "Bắt đầu trò chuyện",
            color: "#8b5cf6"
        },
        {
            img: "./img/chatBS2.jpg",
            link: "/choseapp",
            title: "Chuyên gia tâm lý",
            description: "Kết nối với bác sĩ chuyên môn cao",
            btnText: "Tìm chuyên gia",
            color: "#8b5cf6"
        },
        {
            img: "./img/nhatky.jpg",
            link: "/diary",
            title: "Nhật ký cảm xúc",
            description: "Ghi lại và theo dõi tâm trạng của bạn",
            btnText: "Viết nhật ký",
            color: "#8b5cf6"
        }
    ];

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '80px', paddingBottom: '60px' }}>
            <Container className="py-5">
                {/* Header */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem', color: '#2c3e50' }}>
                        Chọn Dịch Vụ Phù Hợp
                    </h2>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                        Lựa chọn cách bạn muốn được hỗ trợ
                    </p>
                </div>

                <Row className="g-4 justify-content-center">
                    {options.map((item, index) => (
                        <Col key={index} md={6} lg={4}>
                            <Card 
                                className="h-100 border-0 shadow-lg overflow-hidden"
                                style={{
                                    borderRadius: '20px',
                                    transition: 'all 0.4s ease',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-12px)';
                                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)';
                                }}
                            >
                                {/* Image Section */}
                                <div style={{ 
                                    height: '280px', 
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    <Card.Img
                                        src={item.img}
                                        alt={item.title}
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            objectFit: 'cover',
                                            filter: 'brightness(0.85)'
                                        }}
                                        onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=' + item.title; }}
                                    />
                                    {/* Gradient overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: '100%',
                                        background: `linear-gradient(to bottom, transparent 0%, ${item.color}dd 100%)`
                                    }} />
                                </div>

                                {/* Content Section */}
                                <Card.Body className="p-4" style={{ background: 'white' }}>
                                    <div className="d-flex align-items-center mb-3">
                                        <div 
                                            style={{
                                                width: '8px',
                                                height: '40px',
                                                backgroundColor: item.color,
                                                borderRadius: '4px',
                                                marginRight: '12px'
                                            }}
                                        />
                                        <Card.Title className="fw-bold mb-0" style={{ fontSize: '1.4rem', color: '#2c3e50' }}>
                                            {item.title}
                                        </Card.Title>
                                    </div>
                                    
                                    <Card.Text className="text-muted mb-4" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                        {item.description}
                                    </Card.Text>
                                    
                                    <NavLink to={item.link} className="text-decoration-none w-100 d-block">
                                        <Button
                                            className="w-100 py-3 fw-semibold border-0"
                                            style={{
                                                backgroundColor: item.color,
                                                borderRadius: '12px',
                                                fontSize: '1rem',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = 'scale(1.02)';
                                                e.target.style.boxShadow = `0 8px 20px ${item.color}40`;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'scale(1)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        >
                                            {item.btnText} →
                                        </Button>
                                    </NavLink>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Info Section */}
                <div className="text-center mt-5 pt-4">
                    <p className="text-muted">
                        💙 Chúng tôi luôn sẵn sàng đồng hành cùng bạn
                    </p>
                </div>
            </Container>
        </div>
    );
};

export default ChoseChat;