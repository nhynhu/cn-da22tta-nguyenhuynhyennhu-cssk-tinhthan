import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Button, Spinner, Alert, Badge, Modal } from 'react-bootstrap';
import './Therapy.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TherapyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exercise, setExercise] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showVideo, setShowVideo] = useState(false);
    const [hasTracked, setHasTracked] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        loadExerciseDetail();
        if (token) {
            loadStats();
            recordView();
        }
    }, [id]);

    const loadExerciseDetail = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/mind/exercises/${id}`);
            setExercise(res.data);
        } catch (err) {
            console.error('Lỗi tải bài tập:', err);
            setError('Không thể tải chi tiết bài tập.');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/mind/exercises/${id}/stats`);
            setStats(res.data);
        } catch (err) {
            console.error('Lỗi tải thống kê:', err);
        }
    };

    const recordView = async () => {
        if (!token || hasTracked) return;

        try {
            await axios.post(`${API_URL}/api/mind/exercises/${id}/view`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setHasTracked(true);
            console.log('Đã ghi nhận lượt xem');
        } catch (err) {
            console.error('Lỗi ghi nhận view:', err);
        }
    };

    const handleMarkComplete = async () => {
        if (!token) {
            alert('Vui lòng đăng nhập để đánh dấu hoàn thành!');
            return;
        }

        try {
            await axios.post(`${API_URL}/api/mind/exercises/${id}/complete`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Đã đánh dấu hoàn thành bài tập! 🎉');
            loadStats(); // Reload stats
        } catch (err) {
            console.error('Lỗi đánh dấu hoàn thành:', err);
            alert('Không thể đánh dấu hoàn thành. Vui lòng thử lại.');
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

    const getMediaType = (url) => {
        if (!url) return null;
        if (url.match(/\.(mp4|avi|mov|webm)$/i)) return 'video';
        if (url.match(/\.(mp3|wav)$/i)) return 'audio';
        return 'link';
    };

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Đang tải chi tiết bài tập...</p>
            </Container>
        );
    }

    if (error || !exercise) {
        return (
            <Container className="my-5">
                <Alert variant="danger">
                    {error || 'Không tìm thấy bài tập.'}
                </Alert>
                <Button variant="primary" onClick={() => navigate('/therapy')}>
                    ← Quay lại danh sách
                </Button>
            </Container>
        );
    }

    const mediaType = getMediaType(exercise.media_url);

    return (
        <Container className="my-4">
            {/* Header với nút back */}
            <div className="mb-4">
                <Button variant="link" onClick={() => navigate('/therapy')} className="p-0 mb-3">
                    ← Quay lại danh sách bài tập
                </Button>
            </div>

            <Card className="mb-4">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h2>{exercise.title}</h2>
                            <div className="mb-2">
                                {exercise.difficulty_level && (
                                    <Badge bg={difficultyColor(exercise.difficulty_level)} className="me-2">
                                        {exercise.difficulty_level}
                                    </Badge>
                                )}
                                {exercise.duration_minutes && (
                                    <Badge bg="info">⏱ {exercise.duration_minutes} phút</Badge>
                                )}
                            </div>
                        </div>
                        {token && (
                            <Button variant="success" onClick={handleMarkComplete}>
                                ✓ Đánh dấu hoàn thành
                            </Button>
                        )}
                    </div>

                    <p className="text-muted">{exercise.description}</p>

                    {/* Thống kê */}
                    {stats && (
                        <div className="mt-3 p-3 bg-light rounded">
                            <small className="text-muted">
                                👁 {stats.total_views || 0} lượt xem •
                                👥 {stats.unique_viewers || 0} người đã xem •
                                ✓ {stats.total_completed || 0} đã hoàn thành
                            </small>
                        </div>
                    )}

                    {/* Hướng dẫn */}
                    {exercise.instructions && (
                        <div className="mt-4">
                            <h5>Hướng dẫn thực hiện:</h5>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{exercise.instructions}</p>
                        </div>
                    )}

                    {/* Media Controls */}
                    {exercise.media_url && (
                        <div className="mt-4">
                            <h5>Nội dung bài tập:</h5>
                            {mediaType === 'video' && (
                                <>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={() => setShowVideo(true)}
                                        className="mb-3"
                                    >
                                        ▶ Xem video hướng dẫn
                                    </Button>
                                    <Modal
                                        show={showVideo}
                                        onHide={() => setShowVideo(false)}
                                        size="lg"
                                        centered
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title>{exercise.title}</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <video
                                                controls
                                                autoPlay
                                                className="w-100"
                                                style={{ maxHeight: '70vh' }}
                                            >
                                                <source src={exercise.media_url} type="video/mp4" />
                                                Trình duyệt không hỗ trợ video.
                                            </video>
                                        </Modal.Body>
                                    </Modal>
                                </>
                            )}
                            {mediaType === 'audio' && (
                                <audio controls className="w-100">
                                    <source src={exercise.media_url} />
                                    Trình duyệt không hỗ trợ audio.
                                </audio>
                            )}
                            {mediaType === 'link' && (
                                <Button
                                    variant="primary"
                                    href={exercise.media_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Mở nội dung bài tập
                                </Button>
                            )}
                        </div>
                    )}
                </Card.Body>
            </Card>

            {!token && (
                <Alert variant="info">
                    <strong>💡 Mẹo:</strong> Đăng nhập để theo dõi tiến độ và đánh dấu bài tập đã hoàn thành!
                </Alert>
            )}
        </Container>
    );
};

export default TherapyDetail;
