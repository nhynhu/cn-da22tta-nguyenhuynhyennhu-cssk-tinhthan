import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000';

// Trang chọn chuyên gia
function ExpertList() {
    const [experts, setExperts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/experts`);
                const data = await res.json();
                setExperts(data.data || []);
            } catch (err) {
                console.error('Lỗi tải danh sách chuyên gia:', err);
            }
        };

        fetchExperts();
    }, []);

    const handleStartChat = (expert) => {
        navigate(`/doctor-chat/${expert.id}`, { state: { expert } });
    };

    return (
        <div style={{ background: '#ffffff', minHeight: '100vh', paddingTop: '60px', paddingBottom: '60px' }}>
            <Container className="py-5">
                {/* Header Section */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem', color: '#2c3e50' }}>
                        🩺 Chọn Chuyên Gia Tư Vấn
                    </h2>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                        Kết nối với các chuyên gia tâm lý hàng đầu để được hỗ trợ tốt nhất
                    </p>
                </div>

                <Row className="g-4">
                    {experts.map((e) => (
                        <Col md={6} lg={4} key={e.id}>
                            <Card 
                                className="h-100 shadow-lg border-0"
                                style={{
                                    borderRadius: '16px',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(event) => {
                                    event.currentTarget.style.transform = 'translateY(-8px)';
                                    event.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(event) => {
                                    event.currentTarget.style.transform = 'translateY(0)';
                                    event.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                                }}
                            >
                                <Card.Body className="p-4">
                                    {/* Avatar placeholder */}
                                    <div 
                                        className="d-flex justify-content-center mb-3"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            margin: '0 auto',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '2rem',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {(e.name || e.full_name || 'CG').charAt(0).toUpperCase()}
                                    </div>
                                    
                                    <Card.Title className="text-center fw-bold mb-2" style={{ fontSize: '1.3rem', color: '#2c3e50' }}>
                                        {e.name || e.full_name || 'Chuyên gia'}
                                    </Card.Title>
                                    
                                    {e.specialization && (
                                        <div className="text-center mb-3">
                                            <Badge 
                                                bg="light" 
                                                text="dark"
                                                style={{ 
                                                    fontSize: '0.85rem',
                                                    padding: '6px 12px',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                {e.specialization}
                                            </Badge>
                                        </div>
                                    )}
                                    
                                    <div className="text-center mb-3">
                                        <small className="text-muted d-flex align-items-center justify-content-center">
                                            <i className="bi bi-envelope me-2"></i>
                                            {e.email}
                                        </small>
                                    </div>

                                    {e.bio && (
                                        <Card.Text className="text-muted text-center mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                                            {e.bio}
                                        </Card.Text>
                                    )}
                                    
                                    <div className="d-grid">
                                        <Button 
                                            onClick={() => handleStartChat(e)}
                                            style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                padding: '12px 24px',
                                                fontWeight: '600',
                                                fontSize: '1rem',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = 'scale(1.05)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'scale(1)';
                                            }}
                                        >
                                            💬 Bắt đầu chat
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                    
                    {experts.length === 0 && (
                        <Col>
                            <Card className="text-center py-5 border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                                <Card.Body>
                                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                                    <h5 className="text-muted">Chưa có chuyên gia nào</h5>
                                    <p className="text-muted">Vui lòng quay lại sau</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
}

export default ExpertList;
