import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container, Row, Col, Form, Alert, Spinner
} from 'react-bootstrap';
import './Diary.css';

const EmotionDiary = () => {
    const navigate = useNavigate();
    const [entry, setEntry] = useState('');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const token = localStorage.getItem('token');

    const today = new Date().toLocaleDateString('vi-VN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        if (!token) return;
        try {
            const res = await axios.get('http://localhost:5000/api/emotions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    // Helper chọn màu cho viền cảm xúc
    const getEmotionColor = (emotion) => {
        const e = emotion?.toLowerCase() || '';
        if (e.includes('joy') || e.includes('vui')) return '#198754'; // Xanh lá
        if (e.includes('sad') || e.includes('buồn')) return '#0d6efd'; // Xanh dương
        if (e.includes('anger') || e.includes('giận')) return '#dc3545'; // Đỏ
        if (e.includes('fear') || e.includes('lo')) return '#ffc107'; // Vàng
        return '#6c757d'; // Xám
    };

    const handleSave = async () => {
        if (!entry.trim()) {
            setMessage({ type: 'warning', text: 'Nội dung đang để trống.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await axios.post(
                'http://localhost:5000/api/emotions',
                { user_note: entry, log_date: new Date() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: 'Đã lưu nhật ký.' });
            setEntry('');
            fetchHistory();
        } catch (err) {
            setMessage({ type: 'danger', text: 'Lỗi khi lưu dữ liệu.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="diary-wrapper">
            <Container className="py-4">
                {/* Header đơn giản */}
                <div className="mb-4 pb-2 border-secondary d-flex justify-content-between align-items-end">
                    <div>
                        <h2 className="fw-bold mb-0 text-uppercase">Nhật ký cảm xúc</h2>
                        <small className="text-muted">{today}</small>
                    </div>
                </div>

                <Row className="g-4">
                    {/* CỘT TRÁI: KHUNG VIẾT (CHIẾM 8 PHẦN) */}
                    <Col lg={8}>
                        <div className="diary-card p-4">
                            <h5 className="section-title mb-3">Hôm nay bạn thế nào?</h5>

                            {message && (
                                <Alert
                                    variant={message.type}
                                    className="square-alert"
                                    onClose={() => setMessage(null)}
                                    dismissible
                                >
                                    {message.text}
                                </Alert>
                            )}

                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    className="diary-textarea"
                                    placeholder="Viết ra những suy nghĩ của bạn..."
                                    value={entry}
                                    onChange={(e) => setEntry(e.target.value)}
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-between align-items-center">
                                <span className="text-muted small">
                                    {entry.length} ký tự
                                </span>
                                <button
                                    className="btn-square btn-primary-custom"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? <Spinner size="sm" /> : 'LƯU LẠI'}
                                </button>
                            </div>
                        </div>
                    </Col>

                    {/* CỘT PHẢI: THỐNG KÊ & LỊCH SỬ (CHIẾM 4 PHẦN) */}
                    <Col lg={4}>
                        {/* Nút chuyển trang thống kê */}
                        <div className="diary-card p-4 mb-4 text-center">
                            <p className="text-muted mb-3 small">Xem tổng quan tâm trạng của bạn</p>
                            <button
                                className="btn-square btn-outline-custom w-100"
                                onClick={() => navigate('/analytic')}
                            >
                                XEM BIỂU ĐỒ THỐNG KÊ →
                            </button>
                        </div>

                        {/* Danh sách lịch sử */}
                        <div className="diary-card p-0">
                            <div className="p-3 border-bottom bg-light-gray">
                                <h6 className="mb-0 fw-bold text-uppercase small ls-1">Dòng thời gian gần đây</h6>
                            </div>
                            <div className="history-list">
                                {logs.length === 0 ? (
                                    <div className="p-4 text-center text-muted small">
                                        Chưa có nhật ký nào.
                                    </div>
                                ) : (
                                    logs.map((log) => (
                                        <div key={log.log_id} className="history-item">
                                            <div
                                                className="emotion-indicator"
                                                style={{ backgroundColor: getEmotionColor(log.primary_emotion) }}
                                            ></div>
                                            <div className="p-3 w-100">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span
                                                        className="fw-bold small text-uppercase"
                                                        style={{ color: getEmotionColor(log.primary_emotion) }}
                                                    >
                                                        {log.primary_emotion || 'Chưa rõ'}
                                                    </span>
                                                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                        {new Date(log.created_at).toLocaleDateString('vi-VN')}
                                                    </small>
                                                </div>
                                                <p className="mb-0 text-muted small text-truncate-2">
                                                    {log.user_note}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default EmotionDiary;