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
            // Không gọi recordView tự động nữa
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
            loadStats(); // Reload stats sau khi ghi nhận view
        } catch (err) {
            console.error('Lỗi ghi nhận view:', err);
        }
    };

    const handleOpenContent = () => {
        // Ghi nhận view khi người dùng mở nội dung
        recordView();
        // Hiển thị modal hoặc mở content
        setShowVideo(true);
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
        <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '60px', paddingBottom: '60px' }}>
            <Container className="py-4">
                {/* Header với nút back */}
                <div className="mb-4">
                    <Button 
                        onClick={() => navigate('/therapy')} 
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#3b82f6',
                            fontSize: '1rem',
                            fontWeight: '600',
                            padding: '8px 0',
                            textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                        ← Quay lại danh sách bài tập
                    </Button>
                </div>

                <Card className="border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                    <Card.Body className="p-0">
                        {/* Header Section with gradient */}
                        <div style={{ 
                            background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', 
                            padding: '40px',
                            color: 'white'
                        }}>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="flex-grow-1">
                                    <h1 className="mb-3 fw-bold" style={{ fontSize: '2.2rem' }}>{exercise.title}</h1>
                                    <p className="mb-4 opacity-90" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                        {exercise.description}
                                    </p>
                                    <div className="d-flex gap-2 flex-wrap">
                                        {exercise.difficulty_level && (
                                            <Badge 
                                                bg={difficultyColor(exercise.difficulty_level)} 
                                                style={{ 
                                                    padding: '8px 16px', 
                                                    fontSize: '0.9rem',
                                                    borderRadius: '8px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {exercise.difficulty_level}
                                            </Badge>
                                        )}
                                        {exercise.duration_minutes && (
                                            <Badge 
                                                bg="light" 
                                                text="dark"
                                                style={{ 
                                                    padding: '8px 16px', 
                                                    fontSize: '0.9rem',
                                                    borderRadius: '8px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                ⏱ {exercise.duration_minutes} phút
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                {token && (
                                    <Button 
                                        onClick={handleMarkComplete}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            backdropFilter: 'blur(10px)',
                                            border: '2px solid white',
                                            borderRadius: '12px',
                                            padding: '12px 24px',
                                            fontWeight: '600',
                                            fontSize: '1rem',
                                            color: 'white',
                                            whiteSpace: 'nowrap',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'white';
                                            e.target.style.color = '#3b82f6';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                            e.target.style.color = 'white';
                                        }}
                                    >
                                        ✓ Đánh dấu hoàn thành
                                    </Button>
                                )}
                            </div>

                            {/* Statistics */}
                            {stats && (
                                <div className="d-flex gap-4 flex-wrap" style={{ fontSize: '0.95rem', opacity: 0.9 }}>
                                    <span>
                                        <i className="bi bi-eye me-2"></i>
                                        {stats.total_views || 0} lượt xem
                                    </span>
                                    <span>
                                        <i className="bi bi-people me-2"></i>
                                        {stats.unique_viewers || 0} người đã xem
                                    </span>
                                    <span>
                                        <i className="bi bi-check-circle me-2"></i>
                                        {stats.total_completed || 0} đã hoàn thành
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="p-5">
                            {/* Instructions */}
                            {exercise.instructions && (
                                <div className="mb-5">
                                    <div className="d-flex align-items-center mb-3">
                                        <div 
                                            style={{
                                                width: '6px',
                                                height: '30px',
                                                background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                                                borderRadius: '3px',
                                                marginRight: '12px'
                                            }}
                                        />
                                        <h4 className="mb-0 fw-bold" style={{ color: '#2c3e50' }}>Hướng dẫn thực hiện:</h4>
                                    </div>
                                    <p style={{ 
                                        whiteSpace: 'pre-wrap', 
                                        fontSize: '1.05rem', 
                                        lineHeight: '1.8',
                                        color: '#4b5563',
                                        marginLeft: '18px'
                                    }}>
                                        {exercise.instructions}
                                    </p>
                                </div>
                            )}

                            {/* Media Controls */}
                            {exercise.media_url && (
                                <div>
                                    <div className="d-flex align-items-center mb-4">
                                        <div 
                                            style={{
                                                width: '6px',
                                                height: '30px',
                                                background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                                                borderRadius: '3px',
                                                marginRight: '12px'
                                            }}
                                        />
                                        <h4 className="mb-0 fw-bold" style={{ color: '#2c3e50' }}>Nội dung bài tập:</h4>
                                    </div>
                                    <div style={{ marginLeft: '18px' }}>
                                        {mediaType === 'video' && (
                                            <>
                                                <Button
                                                    onClick={handleOpenContent}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        padding: '14px 32px',
                                                        fontWeight: '600',
                                                        fontSize: '1.05rem',
                                                        color: 'white',
                                                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.transform = 'translateY(-2px)';
                                                        e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform = 'translateY(0)';
                                                        e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                                                    }}
                                                >
                                                    ▶ Xem video hướng dẫn
                                                </Button>
                                                <Modal
                                                    show={showVideo}
                                                    onHide={() => setShowVideo(false)}
                                                    size="lg"
                                                    centered
                                                    style={{ borderRadius: '20px' }}
                                                >
                                                    <Modal.Header closeButton style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                        <Modal.Title className="fw-bold">{exercise.title}</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body className="p-0">
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
                                            <audio 
                                                controls 
                                                className="w-100"
                                                style={{
                                                    borderRadius: '12px',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                }}
                                                onPlay={recordView}
                                            >
                                                <source src={exercise.media_url} />
                                                Trình duyệt không hỗ trợ audio.
                                            </audio>
                                        )}
                                        {mediaType === 'link' && (
                                            <Button
                                                href={exercise.media_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={recordView}
                                                style={{
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    padding: '14px 32px',
                                                    fontWeight: '600',
                                                    fontSize: '1.05rem',
                                                    color: 'white',
                                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                                    transition: 'all 0.3s ease',
                                                    textDecoration: 'none',
                                                    display: 'inline-block'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.transform = 'translateY(-2px)';
                                                    e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                                                }}
                                            >
                                                Mở nội dung bài tập
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card.Body>
                </Card>

                {!token && (
                    <Card className="mt-4 border-0 shadow-sm" style={{ 
                        borderRadius: '16px',
                        borderLeft: '4px solid #3b82f6'
                    }}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-start">
                                <div style={{ fontSize: '2rem', marginRight: '16px' }}>💡</div>
                                <div>
                                    <h6 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>Mẹo cho bạn</h6>
                                    <p className="mb-0 text-muted">
                                        Đăng nhập để theo dõi tiến độ và đánh dấu bài tập đã hoàn thành!
                                    </p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                )}
            </Container>
        </div>
    );
};

export default TherapyDetail;
