import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Row, Col, Spinner, Alert, Badge, Button, Tabs, Tab } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MyExercises = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('history');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [historyRes, completedRes] = await Promise.all([
                axios.get(`${API_URL}/api/mind/my-history`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/api/mind/my-completed`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);
            setHistory(historyRes.data || []);
            setCompleted(completedRes.data || []);
        } catch (err) {
            console.error('Lỗi tải dữ liệu:', err);
            setError('Không thể tải lịch sử bài tập.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Đang tải...</p>
            </Container>
        );
    }

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '60px', paddingBottom: '60px' }}>
            <Container className="py-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-2" style={{ fontSize: '2rem', color: '#2c3e50' }}>
                            📚 Bài Tập Của Tôi
                        </h2>
                        <p className="text-muted mb-0">Theo dõi tiến độ học tập của bạn</p>
                    </div>
                    <Button 
                        onClick={() => navigate('/therapy')}
                        style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '10px 24px',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                        }}
                    >
                        ← Quay lại danh sách
                    </Button>
                </div>

                {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

                {/* Statistics Cards */}
                <Row className="g-3 mb-4">
                    <Col md={6}>
                        <Card className="border-0 shadow-sm" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' }}>
                            <Card.Body className="p-4 text-white">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-2 opacity-75">Tổng bài tập đã xem</h6>
                                        <h2 className="mb-0 fw-bold" style={{ fontSize: '2.5rem' }}>{history.length}</h2>
                                    </div>
                                    <div style={{ fontSize: '3rem', opacity: 0.3 }}>👁️</div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="border-0 shadow-sm" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' }}>
                            <Card.Body className="p-4 text-white">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-2 opacity-75">Đã hoàn thành</h6>
                                        <h2 className="mb-0 fw-bold" style={{ fontSize: '2.5rem' }}>{completed.length}</h2>
                                    </div>
                                    <div style={{ fontSize: '3rem', opacity: 0.3 }}>✅</div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Tabs */}
                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    className="mb-4"
                    style={{
                        borderBottom: '2px solid #e5e7eb'
                    }}
                >
                    <Tab 
                        eventKey="history" 
                        title={
                            <span style={{ fontSize: '1rem', fontWeight: '600' }}>
                                Lịch sử xem ({history.length})
                            </span>
                        }
                    >
                        <div className="mt-4">
                            {history.length === 0 ? (
                                <Card className="border-0 shadow-sm text-center p-5" style={{ borderRadius: '16px' }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📖</div>
                                    <h5 className="text-muted mb-2">Chưa có lịch sử</h5>
                                    <p className="text-muted mb-3">Bạn chưa xem bài tập nào. Hãy bắt đầu khám phá!</p>
                                    <Button
                                        onClick={() => navigate('/therapy')}
                                        style={{
                                            background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            padding: '12px 32px',
                                            fontWeight: '600',
                                            color: 'white'
                                        }}
                                    >
                                        Khám phá ngay
                                    </Button>
                                </Card>
                            ) : (
                                <Row xs={1} md={2} className="g-4">
                                    {history.map((item) => (
                                        <Col key={item.view_id}>
                                            <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '16px', transition: 'all 0.3s ease' }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                                                }}
                                            >
                                                <Card.Body className="p-4">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <Card.Title className="mb-0 fw-bold" style={{ fontSize: '1.1rem', color: '#2c3e50' }}>
                                                            {item.title}
                                                        </Card.Title>
                                                        {item.completed === 1 && (
                                                            <Badge bg="success" style={{ borderRadius: '8px', padding: '6px 12px' }}>
                                                                ✓ Hoàn thành
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <Card.Text className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                                                        {item.description}
                                                    </Card.Text>
                                                    <div className="d-flex gap-3 mb-3 text-muted" style={{ fontSize: '0.85rem' }}>
                                                        {item.duration_minutes && (
                                                            <span><i className="bi bi-clock"></i> {item.duration_minutes} phút</span>
                                                        )}
                                                        {item.media_type && (
                                                            <Badge bg="light" text="dark" style={{ fontWeight: '500' }}>{item.media_type}</Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                                                        <i className="bi bi-calendar-check me-2"></i>
                                                        {formatDate(item.viewed_at)}
                                                    </div>
                                                    <Button
                                                        onClick={() => navigate(`/therapy/${item.exercise_id}`)}
                                                        style={{
                                                            background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                                                            border: 'none',
                                                            borderRadius: '10px',
                                                            padding: '8px 20px',
                                                            fontWeight: '600',
                                                            fontSize: '0.9rem',
                                                            color: 'white',
                                                            width: '100%'
                                                        }}
                                                    >
                                                        Xem lại
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </div>
                    </Tab>

                    <Tab 
                        eventKey="completed" 
                        title={
                            <span style={{ fontSize: '1rem', fontWeight: '600' }}>
                                Đã hoàn thành ({completed.length})
                            </span>
                        }
                    >
                        <div className="mt-4">
                            {completed.length === 0 ? (
                                <Card className="border-0 shadow-sm text-center p-5" style={{ borderRadius: '16px' }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
                                    <h5 className="text-muted mb-2">Chưa hoàn thành bài tập nào</h5>
                                    <p className="text-muted">Hãy bắt đầu thực hành và đánh dấu hoàn thành!</p>
                                </Card>
                            ) : (
                                <Row xs={1} md={2} className="g-4">
                                    {completed.map((item) => (
                                        <Col key={item.exercise_id}>
                                            <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '16px', borderLeft: '4px solid #3b82f6', transition: 'all 0.3s ease' }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(59, 130, 246, 0.15)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                                                }}
                                            >
                                                <Card.Body className="p-4">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <Card.Title className="mb-0 fw-bold" style={{ fontSize: '1.1rem', color: '#2c3e50' }}>
                                                            {item.title}
                                                        </Card.Title>
                                                        <Badge bg="primary" style={{ borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                                                            ✓
                                                        </Badge>
                                                    </div>
                                                    <Card.Text className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                                                        {item.description}
                                                    </Card.Text>
                                                    {item.duration_minutes && (
                                                        <div className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                                                            <i className="bi bi-clock me-2"></i>{item.duration_minutes} phút
                                                        </div>
                                                    )}
                                                    <div className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                                                        <i className="bi bi-check-circle me-2"></i>
                                                        {formatDate(item.last_completed_at)}
                                                    </div>
                                                    <Button
                                                        onClick={() => navigate(`/therapy/${item.exercise_id}`)}
                                                        style={{
                                                            background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                                                            border: 'none',
                                                            borderRadius: '10px',
                                                            padding: '8px 20px',
                                                            fontWeight: '600',
                                                            fontSize: '0.9rem',
                                                            color: 'white',
                                                            width: '100%'
                                                        }}
                                                    >
                                                        Thực hành lại
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </div>
                    </Tab>
                </Tabs>
            </Container>
        </div>
    );
};

export default MyExercises;
