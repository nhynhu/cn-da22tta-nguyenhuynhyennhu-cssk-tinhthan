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
        <Container className="my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📚 Bài Tập Của Tôi</h2>
                <Button variant="outline-primary" onClick={() => navigate('/therapy')}>
                    ← Quay lại danh sách
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
            >
                <Tab eventKey="history" title={`Lịch sử xem (${history.length})`}>
                    {history.length === 0 ? (
                        <Alert variant="info">
                            Bạn chưa xem bài tập nào. Hãy bắt đầu khám phá các bài tập thiền và tâm lý!
                        </Alert>
                    ) : (
                        <Row xs={1} md={2} className="g-3">
                            {history.map((item) => (
                                <Col key={item.view_id}>
                                    <Card className="h-100">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <Card.Title className="mb-0">{item.title}</Card.Title>
                                                {item.completed === 1 && (
                                                    <Badge bg="success">✓ Hoàn thành</Badge>
                                                )}
                                            </div>
                                            <Card.Text className="text-muted small mb-2">
                                                {item.description}
                                            </Card.Text>
                                            <div className="text-muted small mb-2">
                                                {item.duration_minutes && `⏱ ${item.duration_minutes} phút`}
                                                {item.media_type && ` • ${item.media_type}`}
                                            </div>
                                            <div className="text-muted small">
                                                Xem lần cuối: {formatDate(item.viewed_at)}
                                            </div>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() => navigate(`/therapy/${item.exercise_id}`)}
                                            >
                                                Xem lại
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Tab>

                <Tab eventKey="completed" title={`Đã hoàn thành (${completed.length})`}>
                    {completed.length === 0 ? (
                        <Alert variant="info">
                            Bạn chưa hoàn thành bài tập nào. Hãy bắt đầu thực hành và đánh dấu hoàn thành để theo dõi tiến độ!
                        </Alert>
                    ) : (
                        <Row xs={1} md={2} className="g-3">
                            {completed.map((item) => (
                                <Col key={item.exercise_id}>
                                    <Card className="h-100 border-success">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <Card.Title className="mb-0">{item.title}</Card.Title>
                                                <Badge bg="success">✓</Badge>
                                            </div>
                                            <Card.Text className="text-muted small mb-2">
                                                {item.description}
                                            </Card.Text>
                                            <div className="text-muted small mb-2">
                                                {item.duration_minutes && `⏱ ${item.duration_minutes} phút`}
                                            </div>
                                            <div className="text-muted small">
                                                Hoàn thành: {formatDate(item.last_completed_at)}
                                            </div>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() => navigate(`/therapy/${item.exercise_id}`)}
                                            >
                                                Thực hành lại
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Tab>
            </Tabs>

            <div className="mt-4 p-3 bg-light rounded">
                <h5>📊 Thống kê của bạn</h5>
                <div className="row">
                    <div className="col-md-6">
                        <strong>Tổng bài tập đã xem:</strong> {history.length}
                    </div>
                    <div className="col-md-6">
                        <strong>Đã hoàn thành:</strong> {completed.length}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default MyExercises;
