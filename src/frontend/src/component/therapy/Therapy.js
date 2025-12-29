import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
import './Therapy.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TherapyPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [catRes, exRes] = await Promise.all([
                    axios.get(`${API_URL}/api/mind/categories`),
                    axios.get(`${API_URL}/api/mind/exercises`)
                ]);

                setCategories(catRes.data || []);
                setExercises(exRes.data || []);
            } catch (err) {
                console.error('Lỗi tải bài tập thiền:', err);
                setError('Không thể tải danh sách bài tập. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleFilterByCategory = async (categoryId) => {
        try {
            setSelectedCategory(categoryId);
            setLoading(true);
            setError(null);

            const res = await axios.get(`${API_URL}/api/mind/exercises`, {
                params: categoryId ? { category_id: categoryId } : {}
            });
            setExercises(res.data || []);
        } catch (err) {
            console.error('Lỗi lọc bài tập:', err);
            setError('Không thể lọc bài tập.');
        } finally {
            setLoading(false);
        }
    };

    const difficultyColor = (level) => {
        if (!level) return 'secondary';
        const val = String(level).toLowerCase();
        if (val.includes('easy')) return 'success';
        if (val.includes('medium')) return 'warning';
        if (val.includes('hard')) return 'danger';
        return 'secondary';
    };

    return (
        <Container className="my-4">
            <div className="therapy-header">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h2><span role="img" aria-label="lotus">🧘‍♂️</span> Trung tâm Bài tập Thiền & Tâm lý</h2>
                    {token && (
                        <Button variant="outline-primary" onClick={() => navigate('/my-exercises')}>
                            📚 Bài tập của tôi
                        </Button>
                    )}
                </div>
                <p className="lead mb-0">
                    Chọn một danh mục phù hợp với trạng thái hiện tại của bạn và bắt đầu một bài tập ngắn để thư giãn, hít thở và cân bằng lại cảm xúc.
                </p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Bộ lọc danh mục */}
            <Row className="mb-4">
                <Col md={12}>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                        <Button
                            className="therapy-category-btn"
                            variant={selectedCategory ? 'outline-primary' : 'primary'}
                            onClick={() => handleFilterByCategory(null)}
                        >
                            Tất cả bài tập
                        </Button>
                        {categories.map((cat) => (
                            <Button
                                key={cat.category_id}
                                className="therapy-category-btn"
                                variant={selectedCategory === cat.category_id ? 'primary' : 'outline-primary'}
                                onClick={() => handleFilterByCategory(cat.category_id)}
                            >
                                {cat.category_name}
                            </Button>
                        ))}
                    </div>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Đang tải bài tập...</p>
                </div>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {exercises.length === 0 ? (
                        <Col>
                            <Alert variant="info" className="text-center">
                                Hiện chưa có bài tập nào trong danh mục này.
                            </Alert>
                        </Col>
                    ) : (
                        exercises.map((ex, idx) => {
                            // Ưu tiên hiển thị image_url nếu có, sau đó mới dùng placeholder
                            let thumb;
                            if (ex.image_url) {
                                // Sử dụng ảnh upload từ backend
                                thumb = `${API_URL}${ex.image_url}`;
                            } else if (ex.media_url && ex.media_url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                                // Nếu media_url là ảnh
                                thumb = ex.media_url;
                            } else {
                                // Hình đại diện Unsplash thiên nhiên/yoga
                                const THUMBNAILS = [
                                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
                                    'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
                                    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
                                    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
                                    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
                                    'https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&q=80',
                                    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80',
                                    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
                                ];
                                thumb = ex.category_icon || THUMBNAILS[idx % THUMBNAILS.length];
                            }

                            return (
                                <Col key={ex.exercise_id}>
                                    <Card className="h-100 therapy-card">
                                        <Card.Img
                                            variant="top"
                                            src={thumb}
                                            alt={ex.title}
                                            className="therapy-card-img"
                                            onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x180/EEE/AAA?text=Therapy'; }}
                                        />
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title as="h5" className="therapy-card-title">{ex.title}</Card.Title>
                                            <div className="mb-2">
                                                {ex.category_name && (
                                                    <Badge bg="secondary" className="me-2">
                                                        {ex.category_name}
                                                    </Badge>
                                                )}
                                                {ex.difficulty_level && (
                                                    <Badge bg={difficultyColor(ex.difficulty_level)}>
                                                        {ex.difficulty_level}
                                                    </Badge>
                                                )}
                                            </div>
                                            <Card.Text className="flex-grow-1">
                                                {ex.description}
                                            </Card.Text>
                                            <div className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
                                                {ex.duration_minutes ? `⏱ ${ex.duration_minutes} phút` : null}
                                                {ex.media_type ? ` • ${ex.media_type}` : null}
                                            </div>
                                            <Button
                                                variant="primary"
                                                onClick={() => navigate(`/therapy/${ex.exercise_id}`)}
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })
                    )}
                </Row>
            )}
        </Container>
    );
};

export default TherapyPage;