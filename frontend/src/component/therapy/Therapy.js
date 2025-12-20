import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Button, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';

const TherapyPage = () => {
    const [categories, setCategories] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [catRes, exRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/mind/categories'),
                    axios.get('http://localhost:5000/api/mind/exercises')
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

            const res = await axios.get('http://localhost:5000/api/mind/exercises', {
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
            <h2 className="mb-3">Trung tâm Bài tập Thiền & Tâm lý</h2>
            <p className="lead text-muted mb-4">
                Chọn một danh mục phù hợp với trạng thái hiện tại của bạn và bắt đầu một bài tập ngắn để thư giãn, hít thở và cân bằng lại cảm xúc.
            </p>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Bộ lọc danh mục */}
            <Row className="mb-4">
                <Col md={12}>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                        <Button
                            variant={selectedCategory ? 'outline-primary' : 'primary'}
                            onClick={() => handleFilterByCategory(null)}
                        >
                            Tất cả bài tập
                        </Button>
                        {categories.map((cat) => (
                            <Button
                                key={cat.category_id}
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
                        exercises.map((ex) => (
                            <Col key={ex.exercise_id}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title as="h5">{ex.title}</Card.Title>
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
                                            href={ex.media_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            disabled={!ex.media_url}
                                        >
                                            {ex.media_url ? 'Bắt đầu bài tập' : 'Chưa có nội dung'}
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            )}
        </Container>
    );
};

export default TherapyPage;