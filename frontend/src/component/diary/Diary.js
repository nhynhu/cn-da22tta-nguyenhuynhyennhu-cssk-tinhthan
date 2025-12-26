import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Card,
    Form,
    Button,
    Alert,
    Spinner,
    ListGroup,
    Badge,
    // THÊM:
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap';

const EmotionDiary = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [mood, setMood] = useState(null);
    const [entry, setEntry] = useState('');

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    // Lấy token và user từ localStorage (đã lưu sau khi login)
    const token = localStorage.getItem('token');
    const currentUser = (() => {
        try {
            const raw = localStorage.getItem('user');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    })();

    const today = new Date().toLocaleDateString('vi-VN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    // Các tùy chọn cảm xúc
    const moodOptions = [
        { value: 'joy', label: '😊 Vui vẻ', color: 'success' },
        { value: 'neutral', label: '😐 Bình thường', color: 'primary' },
        { value: 'sadness', label: '😢 Buồn', color: 'info' },
        { value: 'anger', label: '😠 Tức giận', color: 'danger' },
        { value: 'fear', label: '😰 Lo lắng', color: 'warning' }
    ];

    // --- 1. LOAD LỊCH SỬ KHI VÀO TRANG ---
    useEffect(() => {
        // Chỉ load lịch sử khi đã đăng nhập
        if (token && currentUser?.id) {
            fetchHistory();
        }
    }, []);

    const fetchHistory = async () => {
        if (!token) {
            setMessage({ type: 'warning', text: 'Bạn cần đăng nhập để xem nhật ký cảm xúc.' });
            return;
        }

        try {
            const [logsRes, sugRes] = await Promise.all([
                axios.get('http://localhost:5000/api/emotions', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }),
                axios.get('http://localhost:5000/api/suggestions', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            ]);

            setLogs(logsRes.data || []);
            setSuggestions(sugRes.data || []);
        } catch (error) {
            console.error("Lỗi tải lịch sử hoặc gợi ý:", error);
        }
    };

    // --- HELPER: MÀU SẮC ---
    const getBadgeColor = (m) => {
        if (!m) return 'secondary';
        const lowerM = m.toLowerCase();
        if (lowerM.includes('vui') || lowerM.includes('pos')) return 'success';
        if (lowerM.includes('buồn') || lowerM.includes('neg')) return 'info';
        if (lowerM.includes('giận') || lowerM.includes('tức')) return 'danger';
        if (lowerM.includes('bình') || lowerM.includes('neu')) return 'primary';
        return 'secondary';
    };

    // --- 2. HÀM XỬ LÝ LƯU NHẬT KÝ ---
    const handleSave = async () => {
        // Validation: Phải có ít nhất nội dung
        if (entry.trim() === '') {
            setMessage({ type: 'warning', text: ' Hãy viết gì đó trước khi lưu nhật ký!' });
            return;
        }

        if (!token) {
            setMessage({ type: 'warning', text: 'Bạn cần đăng nhập để lưu nhật ký.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            // SỬA: BẮT PHẢN HỒI CỦA BACKEND ĐỂ LẤY AI ANALYSIS
            const res = await axios.post('http://localhost:5000/api/emotions', {
                primary_emotion: mood,
                user_note: entry,
                log_date: new Date()
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Lấy kết quả AI từ Backend (nếu có)
            const aiData = res.data.ai_analysis;
            let successMsg = '✅ Đã lưu nhật ký thành công!';

            // Nếu Backend có trả về phân tích của AI
            if (aiData && aiData.detected) {
                const emotionMap = {
                    'joy': 'vui vẻ ',
                    'sadness': 'buồn ',
                    'anger': 'tức giận ',
                    'fear': 'lo lắng ',
                    'neutral': 'bình thường '
                };
                const emotionText = emotionMap[aiData.detected] || aiData.detected;
                successMsg = ` Đã lưu! AI nhận thấy bạn đang ${emotionText}`;
            }

            // Thành công
            setMessage({ type: 'success', text: successMsg });

            // Reset form
            setMood(null);
            setEntry('');

            // Tải lại danh sách lịch sử để hiện cái mới nhất
            fetchHistory();

        } catch (error) {
            console.error(error);
            // SỬA: Nếu lỗi 400 (Client side) thì hiện lỗi cụ thể
            const errorMsg = error.response?.data?.message || 'Lỗi server: Không thể lưu lúc này.';
            setMessage({ type: 'danger', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    // --- JSX RENDER ---
    return (
        <Container className="my-4" style={{ maxWidth: '900px' }}> {/* Mở rộng container 900px */}

            {/* --- NÚT XEM THỐNG KÊ BÊN NGOÀI --- */}
            <div className="d-flex justify-content-end mb-3">
                <Button
                    variant="outline-primary"
                    className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm"
                    onClick={() => navigate('/analytic')}
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        color: 'white',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                    }}
                >
                    <span style={{ fontSize: '1.2rem' }}>📊</span>
                    Xem thống kê cảm xúc
                </Button>
            </div>

            {/* --- PHẦN 1: FORM VIẾT NHẬT KÝ (CODE CỦA BẠN) --- */}
            <Card className="shadow-sm mb-4">
                <Card.Header as="h4" className="text-center p-3 bg-primary text-white">
                    Nhật ký Cảm xúc
                </Card.Header>
                <Card.Body className="p-4">
                    <p className="text-center text-muted">{today}</p>
                    <hr />

                    {/* Thông báo kết quả (Có AI Feedback) */}
                    {message && (
                        <Alert variant={message.type} dismissible onClose={() => setMessage(null)} className="text-center fw-bold">
                            {message.text}
                        </Alert>
                    )}


                    {/* Viết nội dung */}
                    <Form.Group>
                        <Form.Label as="h5" className="mb-3">Viết về ngày của bạn:</Form.Label>
                        <Form.Control
                            as="textarea" rows={6}
                            placeholder="Hôm nay bạn đã làm gì? Có chuyện gì đặc biệt không? Hãy chia sẻ suy nghĩ của bạn..."
                            value={entry}
                            onChange={(e) => setEntry(e.target.value)}
                            style={{ fontSize: '1rem' }}
                        />
                        <Form.Text className="text-muted">
                            💡 Gợi ý: Viết về công việc, mối quan hệ, suy nghĩ cá nhân... AI sẽ phân tích cảm xúc của bạn
                        </Form.Text>
                    </Form.Group>

                    {/* Nút Lưu */}
                    <div className="text-end mt-4">
                        <Button variant="primary" size="lg" onClick={handleSave} disabled={loading}>
                            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Lưu nhật ký'}
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* --- PHẦN 2: LỊCH SỬ NHẬT KÝ (HIỂN THỊ AI ANALYSIS) --- */}
            <h5 className="mb-3 text-secondary fw-bold mt-5"> Lịch sử dòng tâm trạng</h5>
            <ListGroup>
                {logs.length === 0 ? (
                    <ListGroup.Item className="text-center py-4 text-muted">Chưa có nhật ký nào.</ListGroup.Item>
                ) : (
                    logs.map((log) => {
                        // Thử parse JSON từ cột analysis (nếu có)
                        let aiInfo = null;
                        try {
                            if (log.analysis) aiInfo = JSON.parse(log.analysis);
                        } catch (e) { }

                        const logSuggestions = suggestions.filter(s => s.log_id === log.log_id);

                        return (
                            <ListGroup.Item key={log.log_id} className="mb-3 border rounded shadow-sm">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                        <Badge bg={getBadgeColor(log.primary_emotion)} className="me-2" style={{ fontSize: '0.9rem' }}>
                                            {log.primary_emotion}
                                        </Badge>

                                        {/* Icon Robot nếu bài này có AI phân tích */}
                                        {aiInfo && aiInfo.ai_detected && (
                                            <OverlayTrigger
                                                placement="top"
                                                // Hiển thị kết quả AI: Cảm xúc + % tin cậy
                                                overlay={<Tooltip>AI phân tích: {aiInfo.ai_detected} ({Math.round(aiInfo.confidence * 100)}%)</Tooltip>}
                                            >
                                                <Badge bg="light" text="dark" className="border">
                                                    AI
                                                </Badge>
                                            </OverlayTrigger>
                                        )}
                                    </div>
                                    <small className="text-muted">
                                        {new Date(log.created_at).toLocaleString('vi-VN')}
                                    </small>
                                </div>

                                <p className="mb-1" style={{ whiteSpace: 'pre-line', color: '#444' }}>
                                    {log.user_note || <em className="text-muted">Không có nội dung</em>}
                                </p>

                                {/* Gợi ý đi kèm nhật ký này (nếu có) */}
                                {logSuggestions.length > 0 && (
                                    <div className="mt-3">
                                        <div className="fw-bold text-muted mb-1" style={{ fontSize: '0.9rem' }}>
                                            Gợi ý dành cho bạn:
                                        </div>
                                        <ul className="mb-0" style={{ paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
                                            {logSuggestions.map(s => (
                                                <li key={s.suggestion_id}>
                                                    <span className="fw-semibold">{s.title}</span>
                                                    {s.priority && (
                                                        <Badge bg="warning" text="dark" className="ms-2">
                                                            {s.priority}
                                                        </Badge>
                                                    )}
                                                    <div className="text-muted">{s.content}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </ListGroup.Item>
                        );
                    })
                )}
            </ListGroup>

        </Container>
    );
};

export default EmotionDiary;